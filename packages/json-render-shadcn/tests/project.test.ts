import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
	jsonRenderExtensionProtocol,
	parseShadcnStyle,
	renderShadcnProjectModule,
	resolveShadcnProject,
} from "../src/project";

const extensionItem = {
	name: "json-render-extended",
	type: "registry:item",
	meta: {
		"json-render-extended": {
			protocol: jsonRenderExtensionProtocol,
			catalog: "@acme/json-render/catalog",
			registries: {
				"base-ui": "@acme/json-render/base-ui",
				"react-aria": {
					module: "@acme/json-render/react-aria",
					export: "reactAriaComponents",
				},
				radix: "@acme/json-render/radix",
			},
		},
	},
};

describe("components.json project resolution", () => {
	it.each([
		["base-nova", "base-ui", "nova"],
		["base-ui-mira", "base-ui", "mira"],
		["aria-nova", "react-aria", "nova"],
		["react-aria-vega", "react-aria", "vega"],
		["radix-nova", "radix", "nova"],
		["new-york", "radix", "new-york"],
	] as const)("derives the base and style from %s", (input, base, style) => {
		expect(parseShadcnStyle(input)).toEqual({ base, style });
	});

	it("resolves the JSON Render icon adapter from components.json", async () => {
		const project = await resolveShadcnProject({
			componentsJson: { style: "base-nova", iconLibrary: "lucide" },
		});

		expect(project.iconLibrary).toEqual({
			name: "lucide",
			catalog: {
				module: "@json-render-extended/icons/lucide/catalog",
				export: "lucideComponentDefinitions",
			},
			registry: {
				module: "@json-render-extended/icons/lucide/react",
				export: "lucideComponents",
			},
		});
		const code = renderShadcnProjectModule(project);
		expect(code).toContain(
			'import { lucideComponentDefinitions as iconDefinitions } from "@json-render-extended/icons/lucide/catalog";',
		);
		expect(code).toContain(
			'import { lucideComponents as iconRegistry } from "@json-render-extended/icons/lucide/react";',
		);
		expect(code).toContain('iconLibrary: "lucide"');
		expect(code).toContain("...iconComponentDefinitions");
		expect(code).toContain("...iconComponents");
	});

	it("detects the icon set from package.json without components.json iconLibrary", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "json-render-shadcn-icons-"));
		try {
			await writeFile(
				join(cwd, "package.json"),
				JSON.stringify({ dependencies: { "lucide-react": "^1.28.0" } }),
			);
			const project = await resolveShadcnProject({
				cwd,
				componentsJson: { style: "base-nova" },
			});
			expect(project.iconLibrary).toMatchObject({ name: "lucide" });
			expect(renderShadcnProjectModule(project)).toContain(
				'from "@json-render-extended/icons/lucide/catalog"',
			);
		} finally {
			await rm(cwd, { recursive: true });
		}
	});

	it("reports an icon library without an installed adapter", async () => {
		const project = await resolveShadcnProject({
			componentsJson: { style: "base-nova", iconLibrary: "future-icons" },
		});
		expect(project.iconLibrary).toBeNull();
		expect(project.diagnostics).toEqual([
			expect.objectContaining({ code: "unsupported-icon-library" }),
		]);
		await expect(
			resolveShadcnProject({
				componentsJson: { style: "base-nova", iconLibrary: "future-icons" },
				strict: true,
			}),
		).rejects.toThrow("No JSON Render icon adapter is configured");
	});

	it("accepts application-defined icon adapters", async () => {
		const project = await resolveShadcnProject({
			componentsJson: { style: "base-nova", iconLibrary: "acme" },
			iconLibraries: {
				acme: {
					catalog: { module: "@acme/icons/catalog" },
					registry: { module: "@acme/icons/react" },
				},
			},
		});
		expect(project.iconLibrary?.name).toBe("acme");
		expect(renderShadcnProjectModule(project)).toContain('from "@acme/icons/catalog"');
	});

	it("discovers a well-known extension item from every configured namespace", async () => {
		const fetcher = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
			const url = String(input);
			if (url.startsWith("https://empty.example")) {
				return new Response(null, { status: 404 });
			}
			expect(url).toBe("https://registry.example/r/json-render-extended.json?channel=stable");
			expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer secret");
			return Response.json(extensionItem);
		}) as typeof globalThis.fetch;

		const project = await resolveShadcnProject({
			cwd: "/workspace/app",
			componentsJson: {
				style: "aria-nova",
				registries: {
					"@acme": {
						url: "https://registry.example/r/{name}.json",
						// biome-ignore lint/suspicious/noTemplateCurlyInString: shadcn expands this placeholder.
						headers: { Authorization: "Bearer ${REGISTRY_TOKEN}" },
						// biome-ignore lint/suspicious/noTemplateCurlyInString: shadcn expands this placeholder.
						params: { channel: "${REGISTRY_CHANNEL}" },
					},
					"@empty": "https://empty.example/{name}.json",
				},
			},
			environment: {
				REGISTRY_TOKEN: "secret",
				REGISTRY_CHANNEL: "stable",
			},
			fetch: fetcher,
		});

		expect(project.base).toBe("react-aria");
		expect(project.style).toBe("nova");
		expect(project.diagnostics).toEqual([]);
		expect(project.extensions).toEqual([
			expect.objectContaining({
				namespace: "@acme",
				catalog: {
					module: "@acme/json-render/catalog",
					export: "componentDefinitions",
				},
				registry: {
					module: "@acme/json-render/react-aria",
					export: "reactAriaComponents",
				},
			}),
		]);
		expect(fetcher).toHaveBeenCalledTimes(2);
	});

	it("records incompatible manifests without weakening the selected registry", async () => {
		const project = await resolveShadcnProject({
			componentsJson: {
				style: "base-nova",
				registries: { "@radix-only": "https://registry.example/{name}.json" },
			},
			fetch: (async () =>
				Response.json({
					...extensionItem,
					meta: {
						"json-render-extended": {
							protocol: jsonRenderExtensionProtocol,
							catalog: "@acme/json-render/catalog",
							registries: { radix: "@acme/json-render/radix" },
						},
					},
				})) as typeof globalThis.fetch,
		});

		expect(project.extensions).toEqual([]);
		expect(project.diagnostics).toEqual([
			expect.objectContaining({ code: "unsupported-base", namespace: "@radix-only" }),
		]);
	});

	it("recognizes registries that discover extensions from installed items", async () => {
		const project = await resolveShadcnProject({
			componentsJson: {
				style: "base-nova",
				registries: { "@jr-ext": "https://registry.example/r/{name}.json" },
			},
			fetch: (async () =>
				Response.json({
					name: "json-render-extended",
					meta: {
						"json-render-extended": {
							protocol: jsonRenderExtensionProtocol,
							mode: "installed-items",
						},
					},
				})) as typeof globalThis.fetch,
		});

		expect(project.providers).toEqual([
			expect.objectContaining({ namespace: "@jr-ext", itemName: "json-render-extended" }),
		]);
		expect(project.extensions).toEqual([]);
	});

	it("discovers package extensions installed by registry items", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "json-render-shadcn-"));
		const manifestDirectory = join(cwd, "lib/json-render-extended/manifests");
		await mkdir(manifestDirectory, { recursive: true });
		await writeFile(
			join(manifestDirectory, "code-block.json"),
			JSON.stringify({
				name: "@jr-ext/code-block",
				meta: {
					"json-render-extended": {
						protocol: jsonRenderExtensionProtocol,
						mode: "package",
						catalog: "@/lib/json-render-extended/code-block.catalog",
						registries: {
							"base-ui": "@/lib/json-render-extended/code-block.registry",
						},
					},
				},
			}),
			"utf8",
		);

		try {
			const project = await resolveShadcnProject({
				cwd,
				componentsJson: { style: "base-nova" },
			});

			expect(project.extensions).toEqual([
				expect.objectContaining({
					source: "installed",
					namespace: "@jr-ext",
					itemName: "@jr-ext/code-block",
					catalog: {
						module: "@/lib/json-render-extended/code-block.catalog",
						export: "componentDefinitions",
					},
				}),
			]);
			const code = renderShadcnProjectModule(project);
			expect(code.indexOf('from "@json-render-extended/shadcn/base-ui"')).toBeLessThan(
				code.indexOf('from "@/lib/json-render-extended/code-block.catalog"'),
			);
		} finally {
			await rm(cwd, { recursive: true, force: true });
		}
	});

	it("fails in strict mode when a published manifest is invalid", async () => {
		await expect(
			resolveShadcnProject({
				componentsJson: {
					style: "base-nova",
					registries: { "@broken": "https://registry.example/{name}.json" },
				},
				fetch: (async () => Response.json({ name: "json-render-extended" })) as typeof fetch,
				strict: true,
			}),
		).rejects.toThrow("does not contain valid json-render-extended metadata");
	});

	it("rejects executable text in remote export names", async () => {
		await expect(
			resolveShadcnProject({
				componentsJson: {
					style: "base-nova",
					registries: { "@unsafe": "https://registry.example/{name}.json" },
				},
				fetch: (async () =>
					Response.json({
						...extensionItem,
						meta: {
							"json-render-extended": {
								...extensionItem.meta["json-render-extended"],
								catalog: {
									module: "@unsafe/catalog",
									export: "components; process.exit(1)",
								},
							},
						},
					})) as typeof globalThis.fetch,
				strict: true,
			}),
		).rejects.toThrow("does not contain valid json-render-extended metadata");
	});
});

describe("generated project module", () => {
	it("uses static imports and applies local overrides after ecosystem extensions", async () => {
		const project = await resolveShadcnProject({
			componentsJson: {
				style: "aria-nova",
				registries: { "@acme": "https://registry.example/{name}.json" },
			},
			fetch: (async () => Response.json(extensionItem)) as typeof globalThis.fetch,
		});
		const code = renderShadcnProjectModule(project, {
			localExtensions: [
				{
					name: "application",
					catalog: { module: "./catalog.local", export: "localDefinitions" },
					registry: { module: "./registry.local", export: "localComponents" },
				},
			],
		});

		expect(code).toContain(
			'import { reactAriaComponents as shadcnComponents } from "@json-render-extended/shadcn/react-aria";',
		);
		expect(code).toContain(
			'import { componentDefinitions as extensionCatalog0 } from "@acme/json-render/catalog";',
		);
		expect(code).toContain('import { localDefinitions as localCatalog0 } from "./catalog.local";');
		expect(code.indexOf("...extensionCatalog0")).toBeLessThan(code.indexOf("...localCatalog0"));
		expect(code).toContain("export const extensionComponents");
		expect(code).toContain('base: "react-aria"');
	});
});
