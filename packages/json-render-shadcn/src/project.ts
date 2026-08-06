import type { Dirent } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { resolveProjectIconSet } from "@json-render-extended/icons/project";

import type { ShadcnBase } from "./bases";

export const jsonRenderExtensionItemName = "json-render-extended";
export const jsonRenderExtensionMetaKey = "json-render-extended";
export const jsonRenderExtensionProtocol = "json-render-extended/v1";
export const installedExtensionManifestDirectory = "lib/json-render-extended/manifests";

export type RegistryConfiguration =
	| string
	| {
			url: string;
			headers?: Record<string, string>;
			params?: Record<string, string>;
	  };

export interface ShadcnComponentsJson {
	$schema?: string;
	style: string;
	rsc?: boolean;
	tsx?: boolean;
	iconLibrary?: string;
	tailwind?: Record<string, unknown>;
	aliases?: Record<string, string>;
	registries?: Record<string, RegistryConfiguration>;
}

export interface ExtensionModuleReference {
	module: string;
	export?: string;
}

export interface IconLibraryAdapter {
	catalog: ExtensionModuleReference;
	registry: ExtensionModuleReference;
}

export interface ResolvedIconLibrary extends IconLibraryAdapter {
	name: string;
}

export const defaultIconLibraryAdapters: Readonly<Record<string, IconLibraryAdapter>> = {
	lucide: {
		catalog: {
			module: "@json-render-extended/icons/lucide/catalog",
			export: "lucideComponentDefinitions",
		},
		registry: {
			module: "@json-render-extended/icons/lucide/react",
			export: "lucideComponents",
		},
	},
};

export interface JsonRenderPackageExtensionManifest {
	protocol: typeof jsonRenderExtensionProtocol;
	mode?: "package";
	catalog: ExtensionModuleReference;
	registries: Partial<Record<ShadcnBase, ExtensionModuleReference>>;
}

export interface JsonRenderInstalledItemsManifest {
	protocol: typeof jsonRenderExtensionProtocol;
	mode: "installed-items";
}

export type JsonRenderRegistryExtensionManifest =
	| JsonRenderPackageExtensionManifest
	| JsonRenderInstalledItemsManifest;

export interface ResolvedRegistryExtension {
	source: "installed" | "registry";
	namespace: string;
	itemName: string;
	url: string;
	catalog: Required<ExtensionModuleReference>;
	registry: Required<ExtensionModuleReference>;
	manifest: JsonRenderPackageExtensionManifest;
}

export interface ResolvedRegistryProvider {
	namespace: string;
	itemName: string;
	url: string;
	manifest: JsonRenderInstalledItemsManifest;
}

export type ProjectDiagnosticCode =
	| "ambiguous-icon-library"
	| "fetch-failed"
	| "invalid-components-json"
	| "invalid-extension-manifest"
	| "invalid-installed-extension"
	| "missing-environment-variable"
	| "unsupported-base"
	| "unsupported-icon-library";

export interface ProjectDiagnostic {
	code: ProjectDiagnosticCode;
	message: string;
	namespace?: string;
	url?: string;
}

export interface ResolvedShadcnProject {
	componentsJsonPath: string;
	componentsJson: ShadcnComponentsJson;
	base: ShadcnBase;
	style: string;
	iconLibrary: ResolvedIconLibrary | null;
	extensions: ResolvedRegistryExtension[];
	providers: ResolvedRegistryProvider[];
	diagnostics: ProjectDiagnostic[];
}

export interface ResolveShadcnProjectOptions {
	cwd?: string;
	componentsJsonPath?: string;
	componentsJson?: ShadcnComponentsJson;
	environment?: Record<string, string | undefined>;
	fetch?: typeof globalThis.fetch;
	manifestName?: string;
	installedManifestDirectory?: string | false;
	iconLibraries?: Record<string, IconLibraryAdapter>;
	detectIconLibrary?: boolean;
	strict?: boolean;
}

export interface LocalProjectExtension {
	name?: string;
	catalog: ExtensionModuleReference;
	registry: ExtensionModuleReference;
}

export interface RenderShadcnProjectModuleOptions {
	localExtensions?: LocalProjectExtension[];
}

export interface GenerateShadcnProjectModuleOptions
	extends ResolveShadcnProjectOptions,
		RenderShadcnProjectModuleOptions {
	output?: string;
}

export interface GeneratedShadcnProjectModule {
	outputPath: string;
	project: ResolvedShadcnProject;
	code: string;
}

interface RegistryItemPayload {
	name?: unknown;
	meta?: Record<string, unknown>;
}

const baseEntryPoints: Record<ShadcnBase, { entry: string; exportName: string }> = {
	"base-ui": {
		entry: "@json-render-extended/shadcn/base-ui",
		exportName: "baseUiComponents",
	},
	"react-aria": {
		entry: "@json-render-extended/shadcn/react-aria",
		exportName: "reactAriaComponents",
	},
	radix: {
		entry: "@json-render-extended/shadcn/radix",
		exportName: "radixComponents",
	},
};

export function parseShadcnStyle(style: string): { base: ShadcnBase; style: string } {
	const prefixes: Array<[string, ShadcnBase]> = [
		["react-aria-", "react-aria"],
		["base-ui-", "base-ui"],
		["radix-", "radix"],
		["aria-", "react-aria"],
		["base-", "base-ui"],
	];

	for (const [prefix, base] of prefixes) {
		if (style.startsWith(prefix)) {
			return { base, style: style.slice(prefix.length) };
		}
	}

	// Legacy shadcn styles such as new-york were Radix-based.
	return { base: "radix", style };
}

export async function readShadcnComponentsJson(
	componentsJsonPath: string,
): Promise<ShadcnComponentsJson> {
	const source = await readFile(componentsJsonPath, "utf8");
	const value = JSON.parse(source) as unknown;
	if (!isRecord(value) || typeof value.style !== "string") {
		throw new Error(`${componentsJsonPath} is not a valid shadcn components.json file.`);
	}
	if (value.registries !== undefined && !isRecord(value.registries)) {
		throw new Error(`${componentsJsonPath} has an invalid registries field.`);
	}
	if (value.iconLibrary !== undefined && typeof value.iconLibrary !== "string") {
		throw new Error(`${componentsJsonPath} has an invalid iconLibrary field.`);
	}
	return value as unknown as ShadcnComponentsJson;
}

export async function resolveShadcnProject(
	options: ResolveShadcnProjectOptions = {},
): Promise<ResolvedShadcnProject> {
	const cwd = resolve(options.cwd ?? process.cwd());
	const componentsJsonPath = resolve(options.componentsJsonPath ?? resolve(cwd, "components.json"));
	const componentsJson =
		options.componentsJson ?? (await readShadcnComponentsJson(componentsJsonPath));
	const parsedStyle = parseShadcnStyle(componentsJson.style);
	const diagnostics: ProjectDiagnostic[] = [];
	const registryEntries = Object.entries(componentsJson.registries ?? {});
	const environment = options.environment ?? process.env;
	const fetcher = options.fetch ?? globalThis.fetch;
	const manifestName = options.manifestName ?? jsonRenderExtensionItemName;
	const iconLibraryName = componentsJson.iconLibrary?.trim();
	const iconLibraryAdapters = {
		...defaultIconLibraryAdapters,
		...options.iconLibraries,
	};
	let iconLibrary: ResolvedIconLibrary | null = null;
	const detectedIconSet =
		options.detectIconLibrary === false
			? { status: "not-found" as const, iconSet: null, candidates: [] }
			: await resolveProjectIconSet({
					cwd,
					preferredName: iconLibraryName,
				});
	if (detectedIconSet.iconSet) {
		const detectedAdapter = {
			catalog: detectedIconSet.iconSet.catalog,
			registry: detectedIconSet.iconSet.registry,
		};
		iconLibrary = {
			name: detectedIconSet.iconSet.name,
			...(options.iconLibraries?.[detectedIconSet.iconSet.name] ?? detectedAdapter),
		};
	} else if (iconLibraryName) {
		const adapter = iconLibraryAdapters[iconLibraryName];
		if (adapter) {
			iconLibrary = { name: iconLibraryName, ...adapter };
		} else {
			const error = projectError(
				"unsupported-icon-library",
				`No JSON Render icon adapter is configured for components.json iconLibrary ${iconLibraryName}.`,
			);
			if (options.strict) throw error;
			diagnostics.push(toDiagnostic(error));
		}
	} else if (detectedIconSet.status === "ambiguous") {
		diagnostics.push({
			code: "ambiguous-icon-library",
			message: `Multiple JSON Render icon adapters were detected in package.json (${detectedIconSet.candidates
				.map((candidate) => candidate.name)
				.join(", ")}). Select one explicitly.`,
		});
	}

	const discovered = await Promise.all(
		registryEntries.map(async ([namespace, registry]) => {
			try {
				return await resolveRegistryExtension({
					namespace,
					registry,
					base: parsedStyle.base,
					manifestName,
					environment,
					fetcher,
				});
			} catch (error) {
				if (options.strict) throw error;
				diagnostics.push(toDiagnostic(error, namespace));
				return undefined;
			}
		}),
	);
	const providers = discovered.filter(isResolvedRegistryProvider);
	const registryExtensions = discovered.filter(isResolvedRegistryExtension);
	const installedExtensions =
		options.installedManifestDirectory === false
			? []
			: await resolveInstalledExtensions({
					base: parsedStyle.base,
					cwd,
					diagnostics,
					directory: options.installedManifestDirectory ?? installedExtensionManifestDirectory,
					strict: options.strict ?? false,
				});

	return {
		componentsJsonPath,
		componentsJson,
		base: parsedStyle.base,
		style: parsedStyle.style,
		iconLibrary,
		extensions: [...registryExtensions, ...installedExtensions],
		providers,
		diagnostics,
	};
}

export function renderShadcnProjectModule(
	project: ResolvedShadcnProject,
	options: RenderShadcnProjectModuleOptions = {},
): string {
	const baseEntry = baseEntryPoints[project.base];
	const imports = [
		{
			module: baseEntry.entry,
			statement: `import { ${baseEntry.exportName} as shadcnComponents } from ${JSON.stringify(baseEntry.entry)};`,
		},
		{
			module: "@json-render-extended/shadcn/catalog",
			statement:
				'import { shadcnComponentDefinitions } from "@json-render-extended/shadcn/catalog";',
		},
	];
	const extensionCatalogSpreads: string[] = [];
	const extensionComponentSpreads: string[] = [];
	const sources: Array<{ name: string; namespace: string | null }> = [];
	if (project.iconLibrary) {
		imports.push(
			renderNamedImport(
				withDefaultExport(project.iconLibrary.catalog, "componentDefinitions"),
				"iconDefinitions",
			),
		);
		imports.push(
			renderNamedImport(
				withDefaultExport(project.iconLibrary.registry, "components"),
				"iconRegistry",
			),
		);
	}

	for (const [index, extension] of project.extensions.entries()) {
		const catalogAlias = `extensionCatalog${index}`;
		const registryAlias = `extensionRegistry${index}`;
		imports.push(renderNamedImport(extension.catalog, catalogAlias));
		imports.push(renderNamedImport(extension.registry, registryAlias));
		extensionCatalogSpreads.push(catalogAlias);
		extensionComponentSpreads.push(registryAlias);
		sources.push({ name: extension.itemName, namespace: extension.namespace });
	}

	for (const [index, extension] of (options.localExtensions ?? []).entries()) {
		const catalogAlias = `localCatalog${index}`;
		const registryAlias = `localRegistry${index}`;
		imports.push(
			renderNamedImport(withDefaultExport(extension.catalog, "componentDefinitions"), catalogAlias),
		);
		imports.push(
			renderNamedImport(withDefaultExport(extension.registry, "components"), registryAlias),
		);
		extensionCatalogSpreads.push(catalogAlias);
		extensionComponentSpreads.push(registryAlias);
		sources.push({ name: extension.name ?? `local-${index + 1}`, namespace: null });
	}

	return `/* This file is generated by @json-render-extended/shadcn. */

${imports
	.sort(compareImports)
	.map((entry) => entry.statement)
	.join("\n")}

export const shadcnProject = {
	base: ${JSON.stringify(project.base)},
	style: ${JSON.stringify(project.style)},
	iconLibrary: ${project.iconLibrary ? JSON.stringify(project.iconLibrary.name) : "null"},
	sources: ${renderSources(sources)},
} as const;

export const iconComponentDefinitions = ${project.iconLibrary ? "iconDefinitions" : "{}"};

export const iconComponents = ${project.iconLibrary ? "iconRegistry" : "{}"};

export const extensionComponentDefinitions = {
${extensionCatalogSpreads.map((spread) => `\t...${spread},`).join("\n")}
};

export const extensionComponents = {
${extensionComponentSpreads.map((spread) => `\t...${spread},`).join("\n")}
};

export const componentDefinitions = {
	...shadcnComponentDefinitions,
	...iconComponentDefinitions,
	...extensionComponentDefinitions,
};

export const components = {
	...shadcnComponents,
	...iconComponents,
	...extensionComponents,
};
`;
}

function renderNamedImport(
	reference: Required<ExtensionModuleReference>,
	alias: string,
): { module: string; statement: string } {
	if (!isModuleExportName(reference.export)) {
		throw new Error(`Invalid module export name: ${reference.export}`);
	}
	return {
		module: reference.module,
		statement: `import { ${reference.export} as ${alias} } from ${JSON.stringify(reference.module)};`,
	};
}

function compareImports(left: { module: string }, right: { module: string }): number {
	const leftGroup = importGroup(left.module);
	const rightGroup = importGroup(right.module);
	if (leftGroup !== rightGroup) return leftGroup - rightGroup;
	return left.module.localeCompare(right.module);
}

function importGroup(moduleName: string): number {
	if (moduleName.startsWith(".")) return 2;
	if (moduleName.startsWith("@/")) return 1;
	return 0;
}

function renderSources(sources: Array<{ name: string; namespace: string | null }>): string {
	if (sources.length === 0) return "[]";
	return `[\n${sources
		.map(
			(source) => `\t\t{
\t\t\tname: ${JSON.stringify(source.name)},
\t\t\tnamespace: ${source.namespace === null ? "null" : JSON.stringify(source.namespace)},
\t\t},`,
		)
		.join("\n")}\n\t]`;
}

export async function generateShadcnProjectModule(
	options: GenerateShadcnProjectModuleOptions = {},
): Promise<GeneratedShadcnProjectModule> {
	const cwd = resolve(options.cwd ?? process.cwd());
	const project = await resolveShadcnProject({ ...options, cwd });
	const outputPath = resolve(cwd, options.output ?? "json-render-extended.generated.ts");
	const code = renderShadcnProjectModule(project, options);
	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, code, "utf8");
	return { outputPath, project, code };
}

async function resolveRegistryExtension(options: {
	namespace: string;
	registry: RegistryConfiguration;
	base: ShadcnBase;
	manifestName: string;
	environment: Record<string, string | undefined>;
	fetcher: typeof globalThis.fetch;
}): Promise<ResolvedRegistryExtension | ResolvedRegistryProvider | undefined> {
	const normalized =
		typeof options.registry === "string" ? { url: options.registry } : options.registry;
	const requestUrl = createRegistryItemUrl(normalized, options.manifestName, options.environment);
	const url = publicRegistryItemUrl(normalized.url, options.manifestName);
	const headers = expandRecord(normalized.headers ?? {}, options.environment);
	let response: Response;
	try {
		response = await options.fetcher(requestUrl, { headers });
	} catch {
		throw projectError(
			"fetch-failed",
			`Could not inspect ${options.namespace} for a JSON Render extension because the request failed.`,
			url,
		);
	}
	if (response.status === 404) return undefined;
	if (!response.ok) {
		throw projectError(
			"fetch-failed",
			`Could not inspect ${options.namespace}: ${response.status} ${response.statusText}`,
			url,
		);
	}

	const payload = (await response.json()) as RegistryItemPayload;
	const rawManifest = isRecord(payload.meta) ? payload.meta[jsonRenderExtensionMetaKey] : undefined;
	const manifest = parseExtensionManifest(rawManifest);
	if (!manifest) {
		throw projectError(
			"invalid-extension-manifest",
			`${options.namespace}/${options.manifestName} does not contain valid ${jsonRenderExtensionMetaKey} metadata.`,
			url,
		);
	}
	if (manifest.mode === "installed-items") {
		return {
			namespace: options.namespace,
			itemName: typeof payload.name === "string" ? payload.name : options.manifestName,
			url,
			manifest,
		};
	}
	const registry = manifest.registries[options.base];
	if (!registry) {
		throw projectError(
			"unsupported-base",
			`${options.namespace}/${options.manifestName} does not support ${options.base}.`,
			url,
		);
	}

	return {
		source: "registry",
		namespace: options.namespace,
		itemName: typeof payload.name === "string" ? payload.name : options.manifestName,
		url,
		catalog: withDefaultExport(manifest.catalog, "componentDefinitions"),
		registry: withDefaultExport(registry, "components"),
		manifest,
	};
}

function parseExtensionManifest(value: unknown): JsonRenderRegistryExtensionManifest | undefined {
	if (!isRecord(value) || value.protocol !== jsonRenderExtensionProtocol) return undefined;
	if (value.mode === "installed-items") {
		return { protocol: jsonRenderExtensionProtocol, mode: "installed-items" };
	}
	if (value.mode !== undefined && value.mode !== "package") return undefined;
	const catalog = parseModuleReference(value.catalog);
	if (!catalog || !isRecord(value.registries)) return undefined;
	const registries: Partial<Record<ShadcnBase, ExtensionModuleReference>> = {};
	for (const base of ["base-ui", "react-aria", "radix"] as const) {
		const reference = parseModuleReference(value.registries[base]);
		if (reference) registries[base] = reference;
	}
	if (Object.keys(registries).length === 0) return undefined;
	return { protocol: jsonRenderExtensionProtocol, mode: "package", catalog, registries };
}

async function resolveInstalledExtensions(options: {
	base: ShadcnBase;
	cwd: string;
	diagnostics: ProjectDiagnostic[];
	directory: string;
	strict: boolean;
}): Promise<ResolvedRegistryExtension[]> {
	const manifestDirectory = resolve(options.cwd, options.directory);
	let entries: Dirent[];
	try {
		entries = await readdir(manifestDirectory, { withFileTypes: true });
	} catch (error) {
		if (isNodeError(error, "ENOENT")) return [];
		throw error;
	}

	const extensions: ResolvedRegistryExtension[] = [];
	for (const entry of entries
		.filter((candidate) => candidate.isFile() && candidate.name.endsWith(".json"))
		.sort((left, right) => left.name.localeCompare(right.name))) {
		const manifestPath = resolve(manifestDirectory, entry.name);
		try {
			const payload = JSON.parse(await readFile(manifestPath, "utf8")) as RegistryItemPayload;
			const rawManifest = isRecord(payload.meta)
				? payload.meta[jsonRenderExtensionMetaKey]
				: undefined;
			const manifest = parseExtensionManifest(rawManifest);
			if (!manifest || manifest.mode === "installed-items") {
				throw projectError(
					"invalid-installed-extension",
					`${manifestPath} does not contain a package extension manifest.`,
					manifestPath,
				);
			}
			const registry = manifest.registries[options.base];
			if (!registry) {
				throw projectError(
					"unsupported-base",
					`${manifestPath} does not support ${options.base}.`,
					manifestPath,
				);
			}
			const itemName = typeof payload.name === "string" ? payload.name : entry.name.slice(0, -5);
			extensions.push({
				source: "installed",
				namespace: namespaceFromItemName(itemName),
				itemName,
				url: manifestPath,
				catalog: withDefaultExport(manifest.catalog, "componentDefinitions"),
				registry: withDefaultExport(registry, "components"),
				manifest,
			});
		} catch (error) {
			if (options.strict) throw error;
			options.diagnostics.push(toDiagnostic(error, namespaceFromItemName(entry.name)));
		}
	}
	return extensions;
}

function isResolvedRegistryExtension(
	value: ResolvedRegistryExtension | ResolvedRegistryProvider | undefined,
): value is ResolvedRegistryExtension {
	return value !== undefined && "catalog" in value;
}

function isResolvedRegistryProvider(
	value: ResolvedRegistryExtension | ResolvedRegistryProvider | undefined,
): value is ResolvedRegistryProvider {
	return value !== undefined && !("catalog" in value);
}

function namespaceFromItemName(itemName: string): string {
	if (!itemName.startsWith("@")) return "local";
	return itemName.split("/")[0] ?? "local";
}

function isNodeError(error: unknown, code: string): boolean {
	return error instanceof Error && "code" in error && error.code === code;
}

function parseModuleReference(value: unknown): ExtensionModuleReference | undefined {
	if (typeof value === "string" && value.length > 0) return { module: value };
	if (!isRecord(value) || typeof value.module !== "string" || value.module.length === 0) {
		return undefined;
	}
	if (
		value.export !== undefined &&
		(typeof value.export !== "string" || !isModuleExportName(value.export))
	) {
		return undefined;
	}
	return { module: value.module, export: value.export as string | undefined };
}

function isModuleExportName(value: string): boolean {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value);
}

function withDefaultExport(
	reference: ExtensionModuleReference,
	defaultExport: string,
): Required<ExtensionModuleReference> {
	return { module: reference.module, export: reference.export ?? defaultExport };
}

function createRegistryItemUrl(
	registry: Exclude<RegistryConfiguration, string>,
	manifestName: string,
	environment: Record<string, string | undefined>,
): string {
	const expandedUrl = expandEnvironment(registry.url, environment).replaceAll(
		"{name}",
		encodeURIComponent(manifestName),
	);
	if (!registry.url.includes("{name}")) {
		throw projectError(
			"invalid-components-json",
			`Registry URL ${registry.url} must contain a {name} placeholder.`,
		);
	}
	const url = new URL(expandedUrl);
	for (const [name, value] of Object.entries(expandRecord(registry.params ?? {}, environment))) {
		url.searchParams.set(name, value);
	}
	return url.toString();
}

function publicRegistryItemUrl(template: string, manifestName: string): string {
	return template
		.replaceAll("{name}", encodeURIComponent(manifestName))
		.replace(/\$\{[A-Za-z_][A-Za-z0-9_]*\}/g, "[redacted]");
}

function expandRecord(
	values: Record<string, string>,
	environment: Record<string, string | undefined>,
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(values).map(([name, value]) => [name, expandEnvironment(value, environment)]),
	);
}

function expandEnvironment(value: string, environment: Record<string, string | undefined>): string {
	return value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_match, name: string) => {
		const resolved = environment[name];
		if (resolved === undefined) {
			throw projectError(
				"missing-environment-variable",
				`Registry configuration requires environment variable ${name}.`,
			);
		}
		return resolved;
	});
}

function projectError(code: ProjectDiagnosticCode, message: string, url?: string): Error {
	return Object.assign(new Error(message), { code, url });
}

function toDiagnostic(error: unknown, namespace?: string): ProjectDiagnostic {
	if (error instanceof Error) {
		const coded = error as Error & { code?: ProjectDiagnosticCode; url?: string };
		return {
			code: coded.code ?? "fetch-failed",
			message: coded.message,
			namespace,
			url: coded.url,
		};
	}
	return { code: "fetch-failed", message: String(error), namespace };
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
