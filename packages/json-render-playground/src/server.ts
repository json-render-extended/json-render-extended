import { randomBytes } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import {
	type ResolvedExtensionProject,
	resolveExtensionProject,
	resolveProjectAuthoringProviders,
} from "@json-render-extended/core";
import tailwindcss from "@tailwindcss/vite";
import { createServer, type Plugin, type ViteDevServer } from "vite";

import { renderPlaygroundProjectModule } from "./project-module";
import { PlaygroundSession, RevisionConflictError } from "./session";
import { ProjectSpecStore, type ResolvedTargetProject, resolveTargetProject } from "./spec-store";

const virtualProjectId = "virtual:json-render-extended-playground/project";
const resolvedVirtualProjectId = `\0${virtualProjectId}`;
const virtualProjectStylesId = "virtual:json-render-extended-playground/project-styles";
const resolvedVirtualProjectStylesId = `\0${virtualProjectStylesId}`;
const virtualShellStylesId = "virtual:json-render-extended-playground/shell.css";
const resolvedVirtualShellStylesId = `\0${virtualShellStylesId}`;

export interface StartPlaygroundOptions {
	cwd?: string;
	project?: string;
	specDirectory?: string;
	specId?: string;
	presetId?: string;
	providerId?: string;
	port?: number;
}

export interface RunningPlayground {
	url: string;
	apiUrl: string;
	token: string;
	session: PlaygroundSession;
	project: ResolvedTargetProject;
	server: ViteDevServer;
	close(): Promise<void>;
}

export async function startPlayground(
	options: StartPlaygroundOptions = {},
): Promise<RunningPlayground> {
	const target = await resolveTargetProject(options);
	const extensionProject = await resolveExtensionProject({
		cwd: target.projectRoot,
		runtime: "react",
	});
	const authoringProviders = await resolveProjectAuthoringProviders(extensionProject);
	const resolvedProvider = options.providerId
		? authoringProviders.find(({ provider }) => provider.id === options.providerId)
		: authoringProviders[0];
	if (!resolvedProvider) {
		throw new Error(
			authoringProviders.length === 0
				? `No installed extension in ${target.projectRoot} exposes an authoring provider.`
				: `Authoring provider ${options.providerId} was not found.`,
		);
	}
	const store = new ProjectSpecStore(target);
	const session = await PlaygroundSession.create({
		store,
		provider: resolvedProvider.provider,
		specId: options.specId,
		presetId: options.presetId,
	});
	const token = randomBytes(24).toString("base64url");
	const clientEntryPath = createRequire(target.packageJsonPath).resolve(
		"@json-render-extended/playground/client",
	);
	const projectModule = renderPlaygroundProjectModule(extensionProject);
	const projectStyles = await renderProjectStylesModule(target);
	const server = await createServer({
		root: target.projectRoot,
		appType: "custom",
		plugins: [
			tailwindcss(),
			playgroundPlugin({
				clientEntryPath,
				extensionProject,
				projectModule,
				projectStyles,
				session,
				token,
			}),
		],
		resolve: {
			alias: [{ find: /^@\//, replacement: `${target.projectRoot}/` }],
			dedupe: ["react", "react-dom", "@json-render/react"],
		},
		server: {
			host: "127.0.0.1",
			port: options.port ?? 0,
			strictPort: options.port !== undefined && options.port !== 0,
			fs: {
				allow: [target.repositoryRoot, dirname(clientEntryPath)],
			},
		},
	});
	await server.listen();
	const address = server.httpServer?.address();
	if (!address || typeof address === "string") throw new Error("Playground server did not bind.");
	const origin = `http://127.0.0.1:${address.port}`;
	const url = `${origin}/session/${session.id}?token=${encodeURIComponent(token)}`;
	return {
		url,
		apiUrl: `${origin}/api/session`,
		token,
		session,
		project: target,
		server,
		close: () => server.close(),
	};
}

function playgroundPlugin(options: {
	clientEntryPath: string;
	extensionProject: ResolvedExtensionProject;
	projectModule: string;
	projectStyles: string;
	session: PlaygroundSession;
	token: string;
}): Plugin {
	return {
		name: "json-render-extended-playground",
		resolveId(id) {
			if (id === virtualProjectId) return resolvedVirtualProjectId;
			if (id === virtualProjectStylesId) return resolvedVirtualProjectStylesId;
			if (id === virtualShellStylesId) return resolvedVirtualShellStylesId;
		},
		load(id) {
			if (id === resolvedVirtualProjectId) return options.projectModule;
			if (id === resolvedVirtualProjectStylesId) return options.projectStyles;
			if (id === resolvedVirtualShellStylesId) return shellStyles;
		},
		configureServer(server) {
			server.middlewares.use(async (request, response, next) => {
				try {
					const url = new URL(request.url ?? "/", "http://127.0.0.1");
					if (url.pathname.startsWith("/api/")) {
						if (!isAuthorized(request.headers.authorization, url, options.token)) {
							return json(response, 401, { error: "Unauthorized." });
						}
						return await handleApi(request, response, url, options.session);
					}
					if (url.pathname === "/" || url.pathname.startsWith("/session/")) {
						const html = await server.transformIndexHtml(
							url.pathname,
							renderHtml(options.clientEntryPath),
						);
						response.statusCode = 200;
						response.setHeader("Content-Type", "text/html; charset=utf-8");
						response.end(html);
						return;
					}
					next();
				} catch (error) {
					json(response, 500, { error: error instanceof Error ? error.message : String(error) });
				}
			});
		},
	};
}

async function handleApi(
	request: import("node:http").IncomingMessage,
	response: import("node:http").ServerResponse,
	url: URL,
	session: PlaygroundSession,
) {
	if (request.method === "GET" && url.pathname === "/api/session") {
		return json(response, 200, session.state);
	}
	if (request.method === "GET" && url.pathname === "/api/session/events") {
		response.statusCode = 200;
		response.setHeader("Content-Type", "text/event-stream");
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Connection", "keep-alive");
		const send = (state: unknown) => response.write(`data: ${JSON.stringify(state)}\n\n`);
		send(session.state);
		const unsubscribe = session.subscribe(send);
		const heartbeat = setInterval(() => response.write(": heartbeat\n\n"), 15_000);
		request.on("close", () => {
			clearInterval(heartbeat);
			unsubscribe();
		});
		return;
	}
	if (request.method === "PUT" && url.pathname === "/api/session") {
		const body = await readBody(request);
		if (typeof body.source !== "string" || typeof body.revision !== "number") {
			return json(response, 400, { error: "source and revision are required." });
		}
		try {
			return json(response, 200, await session.update(body.source, body.revision));
		} catch (error) {
			if (error instanceof RevisionConflictError) return json(response, 409, error.state);
			throw error;
		}
	}
	if (request.method === "POST" && url.pathname === "/api/session/open") {
		const body = await readBody(request);
		if (typeof body.specId !== "string" || typeof body.revision !== "number") {
			return json(response, 400, { error: "specId and revision are required." });
		}
		try {
			return json(response, 200, await session.open(body.specId, body.revision));
		} catch (error) {
			if (error instanceof RevisionConflictError) return json(response, 409, error.state);
			throw error;
		}
	}
	if (request.method === "POST" && url.pathname === "/api/session/specs") {
		const body = await readBody(request);
		if (typeof body.specId !== "string" || typeof body.revision !== "number") {
			return json(response, 400, { error: "specId and revision are required." });
		}
		try {
			return json(
				response,
				201,
				await session.createSpec(
					body.specId,
					typeof body.presetId === "string" ? body.presetId : undefined,
					body.revision,
				),
			);
		} catch (error) {
			if (error instanceof RevisionConflictError) return json(response, 409, error.state);
			throw error;
		}
	}
	return json(response, 404, { error: "Not found." });
}

function isAuthorized(header: string | undefined, url: URL, token: string) {
	return header === `Bearer ${token}` || url.searchParams.get("token") === token;
}

async function readBody(request: import("node:http").IncomingMessage) {
	const chunks: Buffer[] = [];
	for await (const chunk of request) chunks.push(Buffer.from(chunk));
	const source = Buffer.concat(chunks).toString("utf8");
	const value = JSON.parse(source || "{}") as unknown;
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		throw new Error("The request body must be a JSON object.");
	}
	return value as Record<string, unknown>;
}

function json(response: import("node:http").ServerResponse, status: number, body: unknown) {
	response.statusCode = status;
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.end(JSON.stringify(body));
}

function renderHtml(clientEntryPath: string) {
	return `<!doctype html>
<html lang="en">
<head>
\t<meta charset="UTF-8" />
\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\t<title>JSON Render Extended Playground</title>
</head>
<body>
\t<div id="root"></div>
\t<script type="module" src="/@fs${clientEntryPath}"></script>
</body>
</html>`;
}

async function renderProjectStylesModule(target: ResolvedTargetProject) {
	const imports: string[] = [];
	try {
		const componentsJson = JSON.parse(
			await readFile(resolve(target.projectRoot, "components.json"), "utf8"),
		) as { tailwind?: { css?: unknown } };
		const cssPath = componentsJson.tailwind?.css;
		if (typeof cssPath === "string" && cssPath.length > 0) {
			const absolute = resolve(target.projectRoot, cssPath);
			await access(absolute);
			imports.push(`import ${JSON.stringify(`/@fs${absolute}`)};`);
		}
	} catch {
		// A package without components.json still gets the isolated playground shell styles.
	}
	return imports.join("\n") || "export {};";
}

const shellStyles = `
:root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #050505; color: #f5f5f5; }
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; margin: 0; }
button, select, textarea { font: inherit; }
.jr-playground { min-height: 100vh; background: #050505; color: #f5f5f5; }
.jr-header { position: sticky; top: 0; z-index: 10; display: flex; gap: 1rem; align-items: center; justify-content: space-between; min-height: 64px; padding: .75rem 1.25rem; border-bottom: 1px solid #262626; background: rgba(5,5,5,.94); backdrop-filter: blur(12px); }
.jr-title { display: grid; gap: .15rem; }
.jr-title strong { font-size: .95rem; }
.jr-title span, .jr-muted { color: #8c8c8c; font-size: .78rem; }
.jr-toolbar { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
.jr-control { min-height: 36px; border: 1px solid #2a2a2a; border-radius: 8px; padding: .45rem .65rem; color: inherit; background: #0b0b0b; }
.jr-button { cursor: pointer; }
.jr-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); min-height: calc(100vh - 64px); }
.jr-pane { min-width: 0; display: flex; flex-direction: column; }
.jr-pane + .jr-pane { border-left: 1px solid #262626; }
.jr-pane-header { display: flex; height: 48px; min-height: 48px; align-items: center; justify-content: space-between; gap: 1rem; padding: 0 1rem; border-bottom: 1px solid #262626; color: #a3a3a3; font-size: .8rem; }
.jr-tabs { align-self: stretch; display: flex; gap: 1rem; }
.jr-tab { display: flex; align-items: center; border: 0; border-bottom: 2px solid transparent; padding: 0; color: #888; background: none; cursor: pointer; }
.jr-tab[aria-selected="true"] { border-color: #48d7a0; color: #fff; }
.jr-editor { position: relative; flex: 1; min-height: 520px; }
.jr-editor textarea { position: absolute; inset: 0; width: 100%; height: 100%; resize: none; border: 0; outline: 0; padding: 1.25rem; color: #e5e5e5; background: #06090e; font: 14px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; tab-size: 2; white-space: pre; overflow: auto; }
.jr-error { padding: .6rem 1rem; border-top: 1px solid #4a1d1d; color: #ff9b9b; background: #1a0909; font-size: .8rem; }
.jr-stage { flex: 1; min-height: 520px; padding: clamp(1rem, 3vw, 3rem); overflow: auto; background: radial-gradient(circle at 50% 0, rgba(72,215,160,.07), transparent 42%); }
.jr-stage-inner { max-width: 900px; margin: 0 auto; }
.jr-code { flex: 1; min-height: 520px; margin: 0; padding: 1.25rem; overflow: auto; color: #e5e5e5; background: #06090e; font: 14px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre; }
.jr-mobile-switch { display: none; }
@media (max-width: 760px) {
\t.jr-header { align-items: flex-start; flex-direction: column; }
\t.jr-toolbar { width: 100%; }
\t.jr-control { min-width: 0; flex: 1; }
\t.jr-mobile-switch { display: flex; }
\t.jr-grid { display: block; min-height: 0; }
\t.jr-pane { display: none; }
\t.jr-playground[data-mobile-pane="editor"] .jr-pane:first-child, .jr-playground[data-mobile-pane="output"] .jr-pane:last-child { display: flex; min-height: calc(100vh - 132px); }
\t.jr-pane + .jr-pane { border-left: 0; }
}
`;
