export const jsonRenderExtensionProtocol = "json-render-extended/v1" as const;
export const jsonRenderExtensionPackageKey = "json-render-extended" as const;
export const jsonRenderAuthoringProviderProtocol = "json-render-extended-authoring/v1" as const;

export interface ExtensionModuleReference {
	module: string;
	export: string;
}

export interface ExtensionSurfaceReference extends ExtensionModuleReference {
	keys?: readonly string[];
}

export interface ExtensionCatalogReferences {
	components?: ExtensionSurfaceReference;
	actions?: ExtensionSurfaceReference;
}

export interface ExtensionRuntimeReferences {
	components?: ExtensionSurfaceReference;
	actions?: ExtensionSurfaceReference;
}

export interface ExtensionCapabilities {
	description?: string;
	tags?: readonly string[];
	documentation?: string;
	skills?: readonly string[];
}

export interface ExtensionAuthoringReferences {
	playground?: ExtensionModuleReference;
}

export interface ExtensionOverrides {
	components?: readonly string[];
	actions?: readonly string[];
}

export interface ExtensionProvenance {
	packageName?: string;
	version?: string;
	source?: string;
}

export interface JsonRenderExtension {
	protocol: typeof jsonRenderExtensionProtocol;
	id: string;
	version?: string;
	description?: string;
	catalog: ExtensionCatalogReferences;
	runtimes: Readonly<Record<string, ExtensionRuntimeReferences>>;
	styles?: readonly string[];
	capabilities?: ExtensionCapabilities;
	authoring?: ExtensionAuthoringReferences;
	overrides?: ExtensionOverrides;
	provenance?: ExtensionProvenance;
}

export interface AuthoringPreset {
	id: string;
	label: string;
	description?: string;
	spec: unknown;
}

export interface AuthoringCodegenResult {
	code: string;
	language: string;
	diagnostics?: readonly ExtensionDiagnostic[];
}

export interface AuthoringCodegenContext {
	componentName?: string;
	componentProps?: readonly AuthoringComponentProp[];
	specId?: string;
	sourceDigest?: string;
	outputPath?: string;
}

export interface AuthoringComponentProp {
	name: string;
	type: "array" | "boolean" | "number" | "object" | "string" | "unknown";
	defaultValue: unknown;
}

export interface AuthoringPreparationResult {
	installed?: readonly string[];
	diagnostics?: readonly ExtensionDiagnostic[];
	runtimeCompositions?: readonly AuthoringRuntimeComposition[];
}

export interface AuthoringRuntimeComposition {
	factory: ExtensionModuleReference;
	modules: readonly string[];
	keys: readonly string[];
}

export interface AuthoringProviderContext {
	cwd: string;
	runtime: string;
	extensionIds: readonly string[];
	packageJsonPath: string;
	packageJson: Record<string, unknown>;
}

export interface ResolvedAuthoringProvider {
	id: string;
	label: string;
	presets: readonly AuthoringPreset[];
	prepareMaterialization?(
		spec: unknown,
		context?: AuthoringCodegenContext,
	): Promise<AuthoringPreparationResult> | AuthoringPreparationResult;
	generateCode(
		spec: unknown,
		context?: AuthoringCodegenContext,
	): Promise<AuthoringCodegenResult> | AuthoringCodegenResult;
}

export interface ProjectAuthoringProvider {
	protocol: typeof jsonRenderAuthoringProviderProtocol;
	id: string;
	resolve(
		context: AuthoringProviderContext,
	): Promise<ResolvedAuthoringProvider> | ResolvedAuthoringProvider;
}

export type ProjectAuthoringProviderInput = Omit<ProjectAuthoringProvider, "protocol"> & {
	protocol?: typeof jsonRenderAuthoringProviderProtocol;
};

export type JsonRenderExtensionInput = Omit<JsonRenderExtension, "protocol"> & {
	protocol?: typeof jsonRenderExtensionProtocol;
};

export interface ExtensionDiagnostic {
	code: string;
	message: string;
	severity?: "error" | "warning";
	extensionId?: string;
	packageName?: string;
}

export interface ExtensionAdapterContext {
	cwd: string;
	runtime: string;
	packageJsonPath: string;
	packageJson: Record<string, unknown>;
	environment: Readonly<Record<string, string | undefined>>;
	options: Readonly<Record<string, unknown>>;
}

export interface ExtensionAdapterResult {
	extensions: readonly JsonRenderExtension[];
	diagnostics?: readonly ExtensionDiagnostic[];
	metadata?: Readonly<Record<string, unknown>>;
}

export interface ProjectExtensionAdapter {
	protocol: typeof jsonRenderExtensionProtocol;
	id: string;
	resolve(
		context: ExtensionAdapterContext,
	): Promise<ExtensionAdapterResult> | ExtensionAdapterResult;
}

export type ProjectExtensionAdapterInput = Omit<ProjectExtensionAdapter, "protocol"> & {
	protocol?: typeof jsonRenderExtensionProtocol;
};

export interface ExtensionPackageRegistration {
	protocol: typeof jsonRenderExtensionProtocol;
	extension?: ExtensionModuleReference;
	adapter?: ExtensionModuleReference;
}

export type ExtensionConfigEntry = JsonRenderExtension | ExtensionModuleReference;

export interface JsonRenderExtensionConfig {
	runtime?: string;
	extensions?: readonly ExtensionConfigEntry[];
	adapterOptions?: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
	exclude?: readonly string[];
	strict?: boolean;
}

export function defineExtension<const Input extends JsonRenderExtensionInput>(
	input: Input,
): Input & { protocol: typeof jsonRenderExtensionProtocol } {
	return {
		...input,
		protocol: jsonRenderExtensionProtocol,
	};
}

export function defineExtensionAdapter<const Input extends ProjectExtensionAdapterInput>(
	input: Input,
): Input & { protocol: typeof jsonRenderExtensionProtocol } {
	return {
		...input,
		protocol: jsonRenderExtensionProtocol,
	};
}

export function defineAuthoringProvider<const Input extends ProjectAuthoringProviderInput>(
	input: Input,
): Input & { protocol: typeof jsonRenderAuthoringProviderProtocol } {
	return {
		...input,
		protocol: jsonRenderAuthoringProviderProtocol,
	};
}

export function defineConfig<const Config extends JsonRenderExtensionConfig>(
	config: Config,
): Config {
	return config;
}

export function parseExtensionPackageRegistration(
	packageManifest: Record<string, unknown>,
): ExtensionPackageRegistration | null {
	const raw = packageManifest[jsonRenderExtensionPackageKey];
	if (!isRecord(raw) || raw.protocol !== jsonRenderExtensionProtocol) return null;
	const extension = raw.extension === undefined ? undefined : parseModuleReference(raw.extension);
	const adapter = raw.adapter === undefined ? undefined : parseModuleReference(raw.adapter);
	if (!extension && !adapter) return null;
	if (raw.extension !== undefined && !extension) return null;
	if (raw.adapter !== undefined && !adapter) return null;
	return {
		protocol: jsonRenderExtensionProtocol,
		...(extension ? { extension } : {}),
		...(adapter ? { adapter } : {}),
	};
}

export function isJsonRenderExtension(value: unknown): value is JsonRenderExtension {
	if (!isRecord(value) || value.protocol !== jsonRenderExtensionProtocol) return false;
	if (typeof value.id !== "string" || value.id.trim().length === 0) return false;
	if (!isCatalogReferences(value.catalog) || !isRecord(value.runtimes)) return false;
	if (value.authoring !== undefined && !isAuthoringReferences(value.authoring)) return false;
	for (const runtime of Object.values(value.runtimes)) {
		if (!isRuntimeReferences(runtime)) return false;
	}
	return true;
}

export function isProjectExtensionAdapter(value: unknown): value is ProjectExtensionAdapter {
	return (
		isRecord(value) &&
		value.protocol === jsonRenderExtensionProtocol &&
		typeof value.id === "string" &&
		typeof value.resolve === "function"
	);
}

export function isProjectAuthoringProvider(value: unknown): value is ProjectAuthoringProvider {
	return (
		isRecord(value) &&
		value.protocol === jsonRenderAuthoringProviderProtocol &&
		typeof value.id === "string" &&
		typeof value.resolve === "function"
	);
}

export function parseModuleReference(value: unknown): ExtensionModuleReference | null {
	if (!isRecord(value) || typeof value.module !== "string") return null;
	if (value.module.trim().length === 0) return null;
	const exportName = value.export ?? "default";
	if (typeof exportName !== "string" || !isModuleExportName(exportName)) return null;
	return { module: value.module, export: exportName };
}

function isCatalogReferences(value: unknown): value is ExtensionCatalogReferences {
	if (!isRecord(value)) return false;
	return isOptionalSurfaceReference(value.components) && isOptionalSurfaceReference(value.actions);
}

function isRuntimeReferences(value: unknown): value is ExtensionRuntimeReferences {
	if (!isRecord(value)) return false;
	return isOptionalSurfaceReference(value.components) && isOptionalSurfaceReference(value.actions);
}

function isAuthoringReferences(value: unknown): value is ExtensionAuthoringReferences {
	if (!isRecord(value)) return false;
	return value.playground === undefined || parseModuleReference(value.playground) !== null;
}

function isOptionalSurfaceReference(value: unknown): boolean {
	if (value === undefined) return true;
	const reference = parseModuleReference(value);
	if (!reference || !isRecord(value)) return false;
	return value.keys === undefined || isStringArray(value.keys);
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isModuleExportName(value: string): boolean {
	return value === "default" || /^[$A-Z_a-z][$\w]*$/.test(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
