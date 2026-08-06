import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { defineExtension, defineExtensionAdapter } from "@json-render-extended/core";

import { resolveProjectIconSet } from "./project";

export const iconsExtensionAdapter = defineExtensionAdapter({
	id: "@json-render-extended/icons",
	async resolve(context) {
		const configuredPreference = readConfiguredIconSet(context.options);
		if (configuredPreference.diagnostic) {
			return { extensions: [], diagnostics: [configuredPreference.diagnostic] };
		}
		const componentsPreference = configuredPreference.name
			? { diagnostics: [] }
			: await readComponentsJsonIconLibrary(context.cwd);
		const preferredName = configuredPreference.name ?? componentsPreference.name;
		const preferenceDiagnostics = componentsPreference.diagnostics;
		const detected = await resolveProjectIconSet({
			cwd: context.cwd,
			preferredName,
		});
		if (!detected.iconSet) {
			if (detected.status === "ambiguous") {
				return {
					extensions: [],
					diagnostics: [
						...preferenceDiagnostics,
						{
							code: "ambiguous-icon-set",
							message: `Multiple icon sets are installed (${detected.candidates
								.map((candidate) => candidate.name)
								.join(
									", ",
								)}). Select one with adapterOptions["@json-render-extended/icons"].iconSet.`,
							severity: "error" as const,
							extensionId: "@json-render-extended/icons",
						},
					],
				};
			}
			return {
				extensions: [],
				diagnostics: [
					...preferenceDiagnostics,
					...(preferredName
						? [
								{
									code: "unsupported-icon-set",
									message: `The project selects ${preferredName}, but no matching installed icon-set adapter was found.`,
									severity: "error" as const,
									extensionId: "@json-render-extended/icons",
								},
							]
						: []),
				],
			};
		}

		const iconSet = detected.iconSet;
		const extension = defineExtension({
			id: `@json-render-extended/icons/${iconSet.name}`,
			description: `JSON Render Icon catalog and renderer for ${iconSet.name}.`,
			catalog: {
				components: {
					...iconSet.catalog,
					keys: ["Icon"],
				},
			},
			runtimes: {
				react: {
					components: {
						...iconSet.registry,
						keys: ["Icon"],
					},
				},
			},
			capabilities: {
				description: "A validated semantic icon vocabulary with intent-based retrieval.",
				tags: ["icons", "semantic-retrieval", iconSet.name],
				skills: ["json-render-icons"],
			},
			provenance: {
				packageName: iconSet.packageName,
				source: iconSet.source,
			},
		});

		return {
			extensions: [extension],
			diagnostics: [
				...preferenceDiagnostics,
				...(context.runtime === "react"
					? []
					: [
							{
								code: "unsupported-icon-runtime",
								message: `The ${iconSet.name} adapter currently provides a React renderer, not ${context.runtime}.`,
								severity: "warning" as const,
								extensionId: extension.id,
							},
						]),
			],
		};
	},
});

function readConfiguredIconSet(options: Readonly<Record<string, unknown>>): {
	name?: string;
	diagnostic?: {
		code: string;
		message: string;
		severity: "error";
		extensionId: string;
	};
} {
	if (options.iconSet === undefined) return {};
	if (typeof options.iconSet !== "string" || options.iconSet.trim().length === 0) {
		return {
			diagnostic: {
				code: "invalid-icon-set-option",
				message:
					'adapterOptions["@json-render-extended/icons"].iconSet must be a non-empty string.',
				severity: "error",
				extensionId: "@json-render-extended/icons",
			},
		};
	}
	return { name: options.iconSet.trim() };
}

async function readComponentsJsonIconLibrary(cwd: string): Promise<{
	name?: string;
	diagnostics: Array<{
		code: string;
		message: string;
		severity: "warning";
		extensionId: string;
	}>;
}> {
	const path = resolve(cwd, "components.json");
	let source: string;
	try {
		source = await readFile(path, "utf8");
	} catch (error) {
		if (isNodeError(error, "ENOENT")) return { diagnostics: [] };
		return {
			diagnostics: [
				{
					code: "components-json-read-failed",
					message: `Could not read ${path}.`,
					severity: "warning",
					extensionId: "@json-render-extended/icons",
				},
			],
		};
	}

	try {
		const value = JSON.parse(source) as unknown;
		if (!isRecord(value)) throw new Error("Expected an object.");
		if (value.iconLibrary === undefined) return { diagnostics: [] };
		if (typeof value.iconLibrary !== "string" || value.iconLibrary.trim().length === 0) {
			throw new Error("iconLibrary must be a non-empty string.");
		}
		return { name: value.iconLibrary.trim(), diagnostics: [] };
	} catch (error) {
		return {
			diagnostics: [
				{
					code: "invalid-components-json-icon-library",
					message: `${path} cannot provide an icon-set preference: ${error instanceof Error ? error.message : String(error)}`,
					severity: "warning",
					extensionId: "@json-render-extended/icons",
				},
			],
		};
	}
}

function isNodeError(error: unknown, code: string): boolean {
	return error instanceof Error && "code" in error && error.code === code;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
