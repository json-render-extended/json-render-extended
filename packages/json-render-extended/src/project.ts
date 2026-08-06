import { access, readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, extname, join, parse, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
	type ExtensionAdapterContext,
	type ExtensionConfigEntry,
	type ExtensionDiagnostic,
	type ExtensionModuleReference,
	type ExtensionPackageRegistration,
	isJsonRenderExtension,
	isProjectAuthoringProvider,
	isProjectExtensionAdapter,
	isRecord,
	type JsonRenderExtension,
	type JsonRenderExtensionConfig,
	parseExtensionPackageRegistration,
	type ResolvedAuthoringProvider,
} from "./protocol";

export const defaultExtensionConfigNames = [
	"json-render-extended.config.ts",
	"json-render-extended.config.mts",
	"json-render-extended.config.js",
	"json-render-extended.config.mjs",
	"json-render-extended.config.cjs",
	"json-render-extended.config.json",
] as const;

export const defaultLocalExtensionDirectory = "json-render/extensions";

export interface DiscoveredExtensionPackage {
	packageName: string;
	packageJsonPath: string;
	version: string | null;
	registration: ExtensionPackageRegistration;
}

export interface ResolvedExtensionSource {
	id: string;
	packageName: string | null;
	type: "adapter" | "config" | "extension" | "local" | "package";
}

export interface ResolvedExtensionProject {
	cwd: string;
	packageJsonPath: string;
	runtime: string;
	strict: boolean;
	configPath: string | null;
	extensions: JsonRenderExtension[];
	diagnostics: ExtensionDiagnostic[];
	sources: ResolvedExtensionSource[];
}

export interface ResolvedProjectAuthoringProvider {
	extensionId: string;
	provider: ResolvedAuthoringProvider;
}

export interface ResolveExtensionProjectOptions {
	cwd?: string;
	runtime?: string;
	config?: JsonRenderExtensionConfig;
	configPath?: string | false;
	extensions?: readonly ExtensionConfigEntry[];
	environment?: Readonly<Record<string, string | undefined>>;
	strict?: boolean;
}

export async function detectExtensionPackages(
	options: { cwd?: string; packageJsonPath?: string } = {},
): Promise<{
	packageJsonPath: string | null;
	packageJson: Record<string, unknown> | null;
	packages: DiscoveredExtensionPackage[];
}> {
	const cwd = resolve(options.cwd ?? process.cwd());
	const packageJsonPath = options.packageJsonPath
		? resolve(cwd, options.packageJsonPath)
		: await findClosestFile(cwd, "package.json");
	if (!packageJsonPath) return { packageJsonPath: null, packageJson: null, packages: [] };

	const packageJson = await readJsonRecord(packageJsonPath, "project package.json");
	const packages: DiscoveredExtensionPackage[] = [];
	for (const packageName of dependencyNames(packageJson)) {
		const dependencyManifestPath = await findDependencyManifest(
			dirname(packageJsonPath),
			packageName,
		);
		if (!dependencyManifestPath) continue;
		const dependencyManifest = await readJsonRecord(dependencyManifestPath, packageName);
		const registration = parseExtensionPackageRegistration(dependencyManifest);
		if (!registration) continue;
		packages.push({
			packageName,
			packageJsonPath: dependencyManifestPath,
			version: typeof dependencyManifest.version === "string" ? dependencyManifest.version : null,
			registration,
		});
	}

	return { packageJsonPath, packageJson, packages };
}

export async function resolveExtensionProject(
	options: ResolveExtensionProjectOptions = {},
): Promise<ResolvedExtensionProject> {
	const cwd = resolve(options.cwd ?? process.cwd());
	const detected = await detectExtensionPackages({ cwd });
	if (!detected.packageJsonPath || !detected.packageJson) {
		throw new Error(`No package.json was found from ${cwd}.`);
	}

	const loadedConfig = options.config
		? { config: options.config, path: null }
		: await loadExtensionConfig({ cwd, configPath: options.configPath });
	const config = loadedConfig.config;
	const runtime = options.runtime ?? config?.runtime ?? "react";
	const strict = options.strict ?? config?.strict ?? false;
	const excluded = new Set(config?.exclude ?? []);
	const diagnostics: ExtensionDiagnostic[] = [];
	const extensions: JsonRenderExtension[] = [];
	const sources: ResolvedExtensionSource[] = [];
	const context: ExtensionAdapterContext = {
		cwd,
		runtime,
		packageJsonPath: detected.packageJsonPath,
		packageJson: detected.packageJson,
		environment: options.environment ?? process.env,
		options: {},
	};
	const adapterOptions = config?.adapterOptions ?? {};

	for (const discovered of detected.packages) {
		for (const [type, reference] of registrationReferences(discovered.registration)) {
			await resolveReference({
				reference,
				type,
				packageName: discovered.packageName,
				packageVersion: discovered.version,
				context,
				excluded,
				extensions,
				diagnostics,
				sources,
				strict,
				adapterOptions,
			});
		}
	}

	for (const manifestPath of await listJsonFiles(resolve(cwd, defaultLocalExtensionDirectory))) {
		try {
			const extension = await readJsonRecord(manifestPath, "local extension manifest");
			if (!isJsonRenderExtension(extension)) {
				throw new Error(`${manifestPath} is not a valid JSON Render Extended extension.`);
			}
			appendExtension(extension, {
				type: "local",
				packageName: null,
				packageVersion: null,
				excluded,
				extensions,
				sources,
			});
		} catch (error) {
			pushDiagnostic(
				diagnostics,
				{
					code: "local-extension-load-failed",
					message: error instanceof Error ? error.message : String(error),
					severity: "error",
				},
				strict,
			);
		}
	}

	for (const entry of [...(config?.extensions ?? []), ...(options.extensions ?? [])]) {
		if (isJsonRenderExtension(entry)) {
			appendExtension(entry, {
				type: "config",
				packageName: null,
				packageVersion: null,
				excluded,
				extensions,
				sources,
			});
			continue;
		}
		await resolveReference({
			reference: entry,
			type: "config",
			packageName: null,
			packageVersion: null,
			context,
			excluded,
			extensions,
			diagnostics,
			sources,
			strict,
			adapterOptions,
		});
	}

	const duplicateIds = duplicateValues(extensions.map((extension) => extension.id));
	for (const id of duplicateIds) {
		pushDiagnostic(
			diagnostics,
			{
				code: "duplicate-extension-id",
				message: `Extension id ${id} was resolved more than once.`,
				severity: "error",
				extensionId: id,
			},
			strict,
		);
	}

	return {
		cwd,
		packageJsonPath: detected.packageJsonPath,
		runtime,
		strict,
		configPath: loadedConfig.path,
		extensions,
		diagnostics,
		sources,
	};
}

export async function resolveProjectAuthoringProviders(
	project: ResolvedExtensionProject,
): Promise<ResolvedProjectAuthoringProvider[]> {
	const packageJson = await readJsonRecord(project.packageJsonPath, "project package.json");
	const providers: ResolvedProjectAuthoringProvider[] = [];
	for (const extension of project.extensions) {
		const reference = extension.authoring?.playground;
		if (!reference) continue;
		const value = await importModuleReference(reference, project.cwd, project.packageJsonPath);
		if (!isProjectAuthoringProvider(value)) {
			throw new Error(
				`${reference.module}#${reference.export} is not a JSON Render Extended authoring provider.`,
			);
		}
		const provider = await value.resolve({
			cwd: project.cwd,
			runtime: project.runtime,
			extensionIds: project.extensions.map((entry) => entry.id),
			packageJsonPath: project.packageJsonPath,
			packageJson,
		});
		providers.push({ extensionId: extension.id, provider });
	}
	return providers;
}

export async function loadExtensionConfig(options: {
	cwd: string;
	configPath?: string | false;
}): Promise<{ config: JsonRenderExtensionConfig | null; path: string | null }> {
	if (options.configPath === false) return { config: null, path: null };
	const path = options.configPath
		? resolve(options.cwd, options.configPath)
		: await findFirstExisting(options.cwd, defaultExtensionConfigNames);
	if (!path) return { config: null, path: null };

	let value: unknown;
	if (extname(path) === ".json") {
		value = await readJsonRecord(path, "JSON Render Extended config");
	} else {
		const namespace = await importLocalModule(path, options.cwd);
		value = readConfigExport(namespace);
	}
	if (!isExtensionConfig(value)) {
		throw new Error(`${path} does not export a valid JSON Render Extended configuration.`);
	}
	return { config: value, path };
}

function readConfigExport(namespace: Record<string, unknown>): unknown {
	let value = namespace.config ?? namespace.default;
	for (let depth = 0; depth < 2; depth += 1) {
		if (!isRecord(value) || hasConfigField(value)) break;
		if (value.config !== undefined) {
			value = value.config;
			continue;
		}
		if (value.default !== undefined) {
			value = value.default;
			continue;
		}
		break;
	}
	return value;
}

function hasConfigField(value: Record<string, unknown>): boolean {
	return ["runtime", "extensions", "adapterOptions", "exclude", "strict"].some(
		(key) => key in value,
	);
}

async function resolveReference(options: {
	reference: ExtensionModuleReference;
	type: ResolvedExtensionSource["type"];
	packageName: string | null;
	packageVersion: string | null;
	context: ExtensionAdapterContext;
	excluded: Set<string>;
	extensions: JsonRenderExtension[];
	diagnostics: ExtensionDiagnostic[];
	sources: ResolvedExtensionSource[];
	strict: boolean;
	adapterOptions: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
}) {
	try {
		const value = await importModuleReference(
			options.reference,
			options.context.cwd,
			options.context.packageJsonPath,
		);
		if (isJsonRenderExtension(value)) {
			appendExtension(value, options);
			return;
		}
		if (!isProjectExtensionAdapter(value)) {
			throw new Error(
				`${options.reference.module}#${options.reference.export} is neither an extension nor an adapter.`,
			);
		}
		const result = await value.resolve({
			...options.context,
			options: options.adapterOptions[value.id] ?? {},
		});
		for (const diagnostic of result.diagnostics ?? []) {
			pushDiagnostic(options.diagnostics, diagnostic, options.strict);
		}
		for (const extension of result.extensions) {
			if (!isJsonRenderExtension(extension)) {
				throw new Error(`Adapter ${value.id} returned an invalid extension.`);
			}
			appendExtension(extension, {
				...options,
				type: "adapter",
			});
		}
	} catch (error) {
		if (error instanceof StrictExtensionDiagnosticError) throw error;
		pushDiagnostic(
			options.diagnostics,
			{
				code: "extension-load-failed",
				message: error instanceof Error ? error.message : String(error),
				severity: "error",
				packageName: options.packageName ?? undefined,
			},
			options.strict,
		);
	}
}

function appendExtension(
	extension: JsonRenderExtension,
	options: {
		type: ResolvedExtensionSource["type"];
		packageName: string | null;
		packageVersion: string | null;
		excluded: Set<string>;
		extensions: JsonRenderExtension[];
		sources: ResolvedExtensionSource[];
	},
) {
	if (options.excluded.has(extension.id)) return;
	const provenancePackageName =
		extension.provenance?.packageName ?? options.packageName ?? undefined;
	const resolved = options.packageName
		? {
				...extension,
				provenance: {
					...extension.provenance,
					packageName: provenancePackageName,
					version:
						extension.provenance?.version ??
						(provenancePackageName === options.packageName
							? (options.packageVersion ?? undefined)
							: undefined),
				},
			}
		: extension;
	options.extensions.push(resolved);
	options.sources.push({ id: extension.id, packageName: options.packageName, type: options.type });
}

async function importModuleReference(
	reference: ExtensionModuleReference,
	cwd: string,
	packageJsonPath: string,
): Promise<unknown> {
	const namespace =
		reference.module.startsWith(".") || reference.module.startsWith("/")
			? await importLocalModule(resolve(cwd, reference.module), cwd)
			: await importPackageModule(reference.module, packageJsonPath, cwd);
	return reference.export === "default" ? namespace.default : namespace[reference.export];
}

async function importPackageModule(
	moduleName: string,
	packageJsonPath: string,
	cwd: string,
): Promise<Record<string, unknown>> {
	const require = createRequire(packageJsonPath);
	const resolvedPath = require.resolve(moduleName);
	return importLocalModule(resolvedPath, cwd);
}

async function importLocalModule(path: string, cwd: string): Promise<Record<string, unknown>> {
	if ([".ts", ".tsx", ".mts", ".cts"].includes(extname(path))) {
		const { tsImport } = await import("tsx/esm/api");
		return tsImport(path, {
			parentURL: pathToFileURL(resolve(cwd, "package.json")).href,
		}) as Promise<Record<string, unknown>>;
	}
	return import(pathToFileURL(path).href) as Promise<Record<string, unknown>>;
}

function registrationReferences(
	registration: ExtensionPackageRegistration,
): Array<["extension" | "package", ExtensionModuleReference]> {
	const references: Array<["extension" | "package", ExtensionModuleReference]> = [];
	if (registration.extension) references.push(["extension", registration.extension]);
	if (registration.adapter) references.push(["package", registration.adapter]);
	return references;
}

function pushDiagnostic(
	diagnostics: ExtensionDiagnostic[],
	diagnostic: ExtensionDiagnostic,
	strict: boolean,
) {
	diagnostics.push(diagnostic);
	if (strict && diagnostic.severity === "error") {
		throw new StrictExtensionDiagnosticError(diagnostic.message);
	}
}

class StrictExtensionDiagnosticError extends Error {}

function duplicateValues(values: readonly string[]): string[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const value of values) {
		if (seen.has(value)) duplicates.add(value);
		seen.add(value);
	}
	return [...duplicates];
}

function isExtensionConfig(value: unknown): value is JsonRenderExtensionConfig {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const config = value as Record<string, unknown>;
	if (config.runtime !== undefined && typeof config.runtime !== "string") return false;
	if (config.strict !== undefined && typeof config.strict !== "boolean") return false;
	if (config.exclude !== undefined && !isStringArray(config.exclude)) return false;
	if (config.extensions !== undefined && !Array.isArray(config.extensions)) return false;
	if (config.adapterOptions !== undefined && !isAdapterOptions(config.adapterOptions)) return false;
	return true;
}

function isAdapterOptions(value: unknown): boolean {
	return isRecord(value) && Object.values(value).every((entry) => isRecord(entry));
}

function dependencyNames(manifest: Record<string, unknown>): string[] {
	const names = new Set<string>();
	for (const field of [
		"dependencies",
		"devDependencies",
		"optionalDependencies",
		"peerDependencies",
	]) {
		const value = manifest[field];
		if (!value || typeof value !== "object" || Array.isArray(value)) continue;
		for (const name of Object.keys(value)) names.add(name);
	}
	return [...names].sort();
}

async function findDependencyManifest(
	startDirectory: string,
	packageName: string,
): Promise<string | null> {
	let directory = resolve(startDirectory);
	const packageSegments = packageName.split("/");
	while (true) {
		const candidate = join(directory, "node_modules", ...packageSegments, "package.json");
		if (await pathExists(candidate)) return candidate;
		const parent = dirname(directory);
		if (parent === directory || parse(directory).root === directory) return null;
		directory = parent;
	}
}

async function findClosestFile(startDirectory: string, name: string): Promise<string | null> {
	let directory = resolve(startDirectory);
	while (true) {
		const candidate = resolve(directory, name);
		if (await pathExists(candidate)) return candidate;
		const parent = dirname(directory);
		if (parent === directory || parse(directory).root === directory) return null;
		directory = parent;
	}
}

async function findFirstExisting(
	directory: string,
	names: readonly string[],
): Promise<string | null> {
	for (const name of names) {
		const candidate = resolve(directory, name);
		if (await pathExists(candidate)) return candidate;
	}
	return null;
}

async function listJsonFiles(directory: string): Promise<string[]> {
	try {
		const entries = await readdir(directory, { recursive: true, withFileTypes: true });
		return entries
			.filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
			.map((entry) => resolve(entry.parentPath, entry.name))
			.sort((left, right) => left.localeCompare(right));
	} catch {
		return [];
	}
}

async function readJsonRecord(path: string, label: string): Promise<Record<string, unknown>> {
	let parsed: unknown;
	try {
		parsed = JSON.parse(await readFile(path, "utf8"));
	} catch (error) {
		throw new Error(`Could not read ${label} at ${path}.`, { cause: error });
	}
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		throw new Error(`${label} at ${path} must contain a JSON object.`);
	}
	return parsed as Record<string, unknown>;
}

async function pathExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
