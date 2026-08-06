import { access } from "node:fs/promises";
import { resolve } from "node:path";

import {
	defineExtension,
	defineExtensionAdapter,
	type ExtensionDiagnostic,
	type JsonRenderExtension,
} from "@json-render-extended/core";

import { defaultShadcnBase, type ShadcnBase } from "./bases";
import { generatedShadcnStyle } from "./capabilities";
import {
	installedExtensionManifestDirectory,
	type ResolvedRegistryExtension,
	resolveShadcnProject,
} from "./project";
import { implementedJsonRenderComponentNames } from "./supported-components";

const runtimeEntries: Record<ShadcnBase, string> = {
	"base-ui": "@json-render-extended/shadcn/base-ui",
	"react-aria": "@json-render-extended/shadcn/react-aria",
	radix: "@json-render-extended/shadcn/radix",
};

const runtimeExports: Record<ShadcnBase, string> = {
	"base-ui": "baseUiComponents",
	"react-aria": "reactAriaComponents",
	radix: "radixComponents",
};

export const shadcnExtensionAdapter = defineExtensionAdapter({
	id: "@json-render-extended/shadcn",
	async resolve(context) {
		const componentsJsonPath = resolve(context.cwd, "components.json");
		const hasComponentsJson = await pathExists(componentsJsonPath);
		const project = hasComponentsJson
			? await resolveShadcnProject({
					cwd: context.cwd,
					detectIconLibrary: false,
					environment: { ...context.environment },
					strict: false,
				})
			: null;
		const base = project?.base ?? defaultShadcnBase;
		const style = project?.style ?? generatedShadcnStyle;
		const extensions: JsonRenderExtension[] = [createShadcnExtension(base, style)];
		for (const registryExtension of project?.extensions ?? []) {
			extensions.push(createRegistryExtension(registryExtension));
		}

		const diagnostics: ExtensionDiagnostic[] = (project?.diagnostics ?? []).map((diagnostic) => ({
			code: diagnostic.code,
			message: diagnostic.message,
			severity: "warning" as const,
			extensionId: "@json-render-extended/shadcn",
		}));
		if (!hasComponentsJson) {
			diagnostics.push({
				code: "missing-components-json",
				message: `No components.json was found. Using the prebuilt ${base}/${style} shadcn registry.`,
				severity: "warning" as const,
				extensionId: "@json-render-extended/shadcn",
			});
		}
		if (context.runtime !== "react") {
			diagnostics.push({
				code: "unsupported-shadcn-runtime",
				message: `The shadcn extension currently provides a React renderer, not ${context.runtime}.`,
				severity: "warning" as const,
				extensionId: "@json-render-extended/shadcn",
			});
		}

		return {
			extensions,
			diagnostics,
			metadata: {
				base,
				style,
				componentsJsonPath: hasComponentsJson ? componentsJsonPath : null,
				installedManifestDirectory: installedExtensionManifestDirectory,
			},
		};
	},
});

function createShadcnExtension(base: ShadcnBase, style: string) {
	return defineExtension({
		id: "@json-render-extended/shadcn",
		description: `Multi-base shadcn registry using ${base}/${style}.`,
		catalog: {
			components: {
				module: "@json-render-extended/shadcn/catalog",
				export: "shadcnComponentDefinitions",
				keys: implementedJsonRenderComponentNames,
			},
		},
		runtimes: {
			react: {
				components: {
					module: runtimeEntries[base],
					export: runtimeExports[base],
					keys: implementedJsonRenderComponentNames,
				},
			},
		},
		styles: ["@json-render-extended/shadcn/tailwind.css"],
		capabilities: {
			description: "shadcn component definitions and interchangeable primitive registries.",
			tags: ["components", "shadcn", base, style],
			skills: ["json-render-shadcn"],
		},
		authoring: {
			playground: {
				module: "@json-render-extended/shadcn/authoring",
				export: "shadcnAuthoringProvider",
			},
		},
		provenance: {
			packageName: "@json-render-extended/shadcn",
			source: hasBaseSpecificSource(base),
		},
	});
}

function createRegistryExtension(extension: ResolvedRegistryExtension) {
	return defineExtension({
		id: `registry:${extension.namespace}:${extension.itemName}`,
		description: `JSON Render extension discovered from ${extension.namespace}.`,
		catalog: {
			components: {
				module: extension.catalog.module,
				export: extension.catalog.export,
			},
		},
		runtimes: {
			react: {
				components: {
					module: extension.registry.module,
					export: extension.registry.export,
				},
			},
		},
		capabilities: {
			tags: ["registry-extension", extension.namespace],
		},
		provenance: {
			packageName: extension.itemName,
			source: extension.source === "installed" ? `installed:${extension.itemName}` : extension.url,
		},
	});
}

function hasBaseSpecificSource(base: ShadcnBase): string {
	return `${runtimeEntries[base]}#${runtimeExports[base]}`;
}

async function pathExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}
