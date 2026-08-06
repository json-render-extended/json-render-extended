import { access, readFile } from "node:fs/promises";
import { dirname, join, parse, resolve } from "node:path";

export const iconSetManifestProtocol = "json-render-icons/v1";

export interface IconSetModuleReference {
	module: string;
	export: string;
}

export interface IconSetAdapter {
	name: string;
	packageName: string;
	requiredPackageNames?: readonly string[];
	catalog: IconSetModuleReference;
	registry: IconSetModuleReference;
}

export interface IconSetPackageManifest {
	protocol: typeof iconSetManifestProtocol;
	name: string;
	catalog: IconSetModuleReference;
	registries: {
		react: IconSetModuleReference;
	};
}

export interface DetectedIconSet extends IconSetAdapter {
	source: "built-in" | "package";
}

export const builtInIconSetAdapters: readonly IconSetAdapter[] = [
	{
		name: "lucide",
		packageName: "lucide-react",
		catalog: {
			module: "@json-render-extended/icons/lucide/catalog",
			export: "lucideComponentDefinitions",
		},
		registry: {
			module: "@json-render-extended/icons/lucide/react",
			export: "lucideComponents",
		},
	},
	{
		name: "tabler",
		packageName: "@tabler/icons-react",
		catalog: {
			module: "@json-render-extended/icons/tabler/catalog",
			export: "tablerComponentDefinitions",
		},
		registry: {
			module: "@json-render-extended/icons/tabler/react",
			export: "tablerComponents",
		},
	},
	{
		name: "hugeicons",
		packageName: "@hugeicons/core-free-icons",
		requiredPackageNames: ["@hugeicons/core-free-icons", "@hugeicons/react"],
		catalog: {
			module: "@json-render-extended/icons/hugeicons/catalog",
			export: "hugeiconsComponentDefinitions",
		},
		registry: {
			module: "@json-render-extended/icons/hugeicons/react",
			export: "hugeiconsComponents",
		},
	},
	{
		name: "phosphor",
		packageName: "@phosphor-icons/react",
		catalog: {
			module: "@json-render-extended/icons/phosphor/catalog",
			export: "phosphorComponentDefinitions",
		},
		registry: {
			module: "@json-render-extended/icons/phosphor/react",
			export: "phosphorComponents",
		},
	},
	{
		name: "remix",
		packageName: "@remixicon/react",
		catalog: {
			module: "@json-render-extended/icons/remix/catalog",
			export: "remixComponentDefinitions",
		},
		registry: {
			module: "@json-render-extended/icons/remix/react",
			export: "remixComponents",
		},
	},
];

export interface DetectProjectIconSetsOptions {
	cwd?: string;
	packageJsonPath?: string;
	builtIns?: readonly IconSetAdapter[];
}

export type ResolveProjectIconSetStatus =
	| "ambiguous"
	| "detected"
	| "missing-package-json"
	| "not-found";

export interface ResolvedProjectIconSet {
	status: ResolveProjectIconSetStatus;
	packageJsonPath: string | null;
	iconSet: DetectedIconSet | null;
	candidates: readonly DetectedIconSet[];
}

export interface ResolveProjectIconSetOptions extends DetectProjectIconSetsOptions {
	preferredName?: string;
}

export async function detectProjectIconSets(
	options: DetectProjectIconSetsOptions = {},
): Promise<{ packageJsonPath: string | null; iconSets: DetectedIconSet[] }> {
	const cwd = resolve(options.cwd ?? process.cwd());
	const packageJsonPath = options.packageJsonPath
		? resolve(cwd, options.packageJsonPath)
		: await findClosestFile(cwd, "package.json");
	if (!packageJsonPath) return { packageJsonPath: null, iconSets: [] };

	const manifest = await readJsonRecord(packageJsonPath, "package.json");
	const dependencies = dependencyNames(manifest);
	const iconSets = (options.builtIns ?? builtInIconSetAdapters)
		.filter((adapter) =>
			(adapter.requiredPackageNames ?? [adapter.packageName]).every((packageName) =>
				dependencies.has(packageName),
			),
		)
		.map((adapter): DetectedIconSet => ({ ...adapter, source: "built-in" }));

	for (const dependency of dependencies) {
		const dependencyManifestPath = await findDependencyManifest(
			dirname(packageJsonPath),
			dependency,
		);
		if (!dependencyManifestPath) continue;
		const dependencyManifest = await readJsonRecord(dependencyManifestPath, dependency);
		const iconSetManifest = parseIconSetPackageManifest(dependencyManifest);
		if (!iconSetManifest || iconSets.some((iconSet) => iconSet.name === iconSetManifest.name)) {
			continue;
		}
		iconSets.push({
			name: iconSetManifest.name,
			packageName: dependency,
			catalog: iconSetManifest.catalog,
			registry: iconSetManifest.registries.react,
			source: "package",
		});
	}

	return { packageJsonPath, iconSets };
}

export async function resolveProjectIconSet(
	options: ResolveProjectIconSetOptions = {},
): Promise<ResolvedProjectIconSet> {
	const detected = await detectProjectIconSets(options);
	if (!detected.packageJsonPath) {
		return {
			status: "missing-package-json",
			packageJsonPath: null,
			iconSet: null,
			candidates: [],
		};
	}
	const preferredName = options.preferredName?.trim();
	const preferred = preferredName
		? detected.iconSets.find((iconSet) => iconSet.name === preferredName)
		: undefined;
	if (preferred) {
		return {
			status: "detected",
			packageJsonPath: detected.packageJsonPath,
			iconSet: preferred,
			candidates: detected.iconSets,
		};
	}
	if (preferredName) {
		return {
			status: "not-found",
			packageJsonPath: detected.packageJsonPath,
			iconSet: null,
			candidates: detected.iconSets,
		};
	}
	if (detected.iconSets.length === 1) {
		return {
			status: "detected",
			packageJsonPath: detected.packageJsonPath,
			iconSet: detected.iconSets[0],
			candidates: detected.iconSets,
		};
	}
	return {
		status: detected.iconSets.length === 0 ? "not-found" : "ambiguous",
		packageJsonPath: detected.packageJsonPath,
		iconSet: null,
		candidates: detected.iconSets,
	};
}

export function parseIconSetPackageManifest(
	packageManifest: Record<string, unknown>,
): IconSetPackageManifest | null {
	const extension = packageManifest["json-render-extended"];
	if (!isRecord(extension) || !isRecord(extension.iconSet)) return null;
	const iconSet = extension.iconSet;
	if (
		iconSet.protocol !== iconSetManifestProtocol ||
		typeof iconSet.name !== "string" ||
		!isModuleReference(iconSet.catalog) ||
		!isRecord(iconSet.registries) ||
		!isModuleReference(iconSet.registries.react)
	) {
		return null;
	}
	return iconSet as unknown as IconSetPackageManifest;
}

function dependencyNames(manifest: Record<string, unknown>): Set<string> {
	const names = new Set<string>();
	for (const field of [
		"dependencies",
		"devDependencies",
		"optionalDependencies",
		"peerDependencies",
	]) {
		const dependencies = manifest[field];
		if (!isRecord(dependencies)) continue;
		for (const name of Object.keys(dependencies)) names.add(name);
	}
	return names;
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

async function readJsonRecord(path: string, label: string): Promise<Record<string, unknown>> {
	let parsed: unknown;
	try {
		parsed = JSON.parse(await readFile(path, "utf8"));
	} catch (error) {
		throw new Error(`Could not read ${label} at ${path}.`, { cause: error });
	}
	if (!isRecord(parsed)) throw new Error(`${label} at ${path} must contain a JSON object.`);
	return parsed;
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

async function pathExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

function isModuleReference(value: unknown): value is IconSetModuleReference {
	return isRecord(value) && typeof value.module === "string" && typeof value.export === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
