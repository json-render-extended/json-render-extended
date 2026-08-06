import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { resolveExtensionProject } from "../src/project";
import { jsonRenderExtensionProtocol } from "../src/protocol";

const temporaryDirectories: string[] = [];

afterEach(async () => {
	await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true })));
});

async function temporaryProject() {
	const cwd = await mkdtemp(join(tmpdir(), "json-render-extended-"));
	temporaryDirectories.push(cwd);
	return cwd;
}

describe("extension project discovery", () => {
	it("passes adapter-specific options from project configuration", async () => {
		const cwd = await temporaryProject();
		const dependencyDirectory = join(cwd, "node_modules", "@acme", "widgets");
		await mkdir(dependencyDirectory, { recursive: true });
		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({ dependencies: { "@acme/widgets": "1.2.3" } }),
		);
		await writeFile(
			join(cwd, "json-render-extended.config.json"),
			JSON.stringify({
				adapterOptions: { "@acme/widgets": { variant: "dense" } },
			}),
		);
		await writeFile(
			join(dependencyDirectory, "package.json"),
			JSON.stringify({
				name: "@acme/widgets",
				version: "1.2.3",
				type: "module",
				exports: { "./extension": "./extension.mjs" },
				"json-render-extended": {
					protocol: jsonRenderExtensionProtocol,
					adapter: { module: "@acme/widgets/extension", export: "adapter" },
				},
			}),
		);
		await writeFile(
			join(dependencyDirectory, "extension.mjs"),
			`export const adapter = {
	protocol: ${JSON.stringify(jsonRenderExtensionProtocol)},
	id: "@acme/widgets",
	resolve(context) {
		return {
			extensions: [{
				protocol: ${JSON.stringify(jsonRenderExtensionProtocol)},
				id: \`@acme/widgets/\${context.options.variant}\`,
				catalog: {},
				runtimes: {},
			}],
		};
	},
};`,
		);

		const project = await resolveExtensionProject({ cwd });

		expect(project.extensions.map((extension) => extension.id)).toEqual(["@acme/widgets/dense"]);
	});

	it("loads a self-describing direct dependency", async () => {
		const cwd = await temporaryProject();
		const dependencyDirectory = join(cwd, "node_modules", "@acme", "widgets");
		await mkdir(dependencyDirectory, { recursive: true });
		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({ dependencies: { "@acme/widgets": "1.2.3" } }),
		);
		await writeFile(
			join(dependencyDirectory, "package.json"),
			JSON.stringify({
				name: "@acme/widgets",
				version: "1.2.3",
				type: "module",
				exports: { "./extension": "./extension.mjs" },
				"json-render-extended": {
					protocol: jsonRenderExtensionProtocol,
					extension: { module: "@acme/widgets/extension", export: "extension" },
				},
			}),
		);
		await writeFile(
			join(dependencyDirectory, "extension.mjs"),
			`export const extension = {
	protocol: ${JSON.stringify(jsonRenderExtensionProtocol)},
	id: "@acme/widgets",
	catalog: {},
	runtimes: {},
};`,
		);

		const project = await resolveExtensionProject({ cwd });

		expect(project.extensions).toEqual([
			expect.objectContaining({
				id: "@acme/widgets",
				provenance: { packageName: "@acme/widgets", version: "1.2.3" },
			}),
		]);
		expect(project.sources).toEqual([
			{ id: "@acme/widgets", packageName: "@acme/widgets", type: "extension" },
		]);
	});

	it("loads TypeScript configuration and applies exclusions", async () => {
		const cwd = await temporaryProject();
		await writeFile(join(cwd, "package.json"), JSON.stringify({ name: "fixture" }));
		await writeFile(
			join(cwd, "json-render-extended.config.ts"),
			`export default {
	runtime: "react",
	exclude: ["local:hidden"],
	extensions: [
		{
			protocol: ${JSON.stringify(jsonRenderExtensionProtocol)},
			id: "local:visible",
			catalog: {},
			runtimes: {},
		},
		{
			protocol: ${JSON.stringify(jsonRenderExtensionProtocol)},
			id: "local:hidden",
			catalog: {},
			runtimes: {},
		},
	],
};`,
		);

		const project = await resolveExtensionProject({ cwd });

		expect(project.configPath).toBe(join(cwd, "json-render-extended.config.ts"));
		expect(project.extensions.map((extension) => extension.id)).toEqual(["local:visible"]);
	});

	it("discovers project-local extension manifests", async () => {
		const cwd = await temporaryProject();
		await writeFile(join(cwd, "package.json"), JSON.stringify({ name: "fixture" }));
		const manifestDirectory = join(cwd, "json-render", "extensions");
		await mkdir(manifestDirectory, { recursive: true });
		await writeFile(
			join(manifestDirectory, "materialized.json"),
			JSON.stringify({
				protocol: jsonRenderExtensionProtocol,
				id: "local:materialized",
				catalog: {
					components: {
						module: "./json-render/materialized/catalog",
						export: "componentDefinitions",
						keys: ["ProfileCard"],
					},
				},
				runtimes: {
					react: {
						components: {
							module: "./json-render/materialized/registry",
							export: "components",
							keys: ["ProfileCard"],
						},
					},
				},
			}),
		);

		const project = await resolveExtensionProject({ cwd });

		expect(project.extensions.map((extension) => extension.id)).toEqual(["local:materialized"]);
		expect(project.sources).toEqual([
			{ id: "local:materialized", packageName: null, type: "local" },
		]);
	});
});
