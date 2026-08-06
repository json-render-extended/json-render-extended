import { describe, expect, it } from "vitest";

import {
	defineAuthoringProvider,
	defineConfig,
	defineExtension,
	defineExtensionAdapter,
	isJsonRenderExtension,
	isProjectAuthoringProvider,
	isProjectExtensionAdapter,
	jsonRenderAuthoringProviderProtocol,
	jsonRenderExtensionProtocol,
	parseExtensionPackageRegistration,
} from "../src/protocol";

describe("extension protocol", () => {
	it("defines extensions, adapters, and project configuration", () => {
		const extension = defineExtension({
			id: "@acme/json-render-widgets",
			catalog: {},
			runtimes: {},
			authoring: {
				playground: {
					module: "@acme/json-render-widgets/authoring",
					export: "widgetsAuthoringProvider",
				},
			},
		});
		const adapter = defineExtensionAdapter({
			id: "@acme/json-render-widgets/adapter",
			resolve: () => ({ extensions: [extension] }),
		});

		expect(extension.protocol).toBe(jsonRenderExtensionProtocol);
		expect(adapter.protocol).toBe(jsonRenderExtensionProtocol);
		expect(isJsonRenderExtension(extension)).toBe(true);
		expect(isProjectExtensionAdapter(adapter)).toBe(true);
		const authoringProvider = defineAuthoringProvider({
			id: "@acme/json-render-widgets/authoring",
			resolve: () => ({
				id: "widgets",
				label: "Widgets",
				presets: [],
				generateCode: () => ({ code: "export {};", language: "tsx" }),
			}),
		});
		expect(authoringProvider.protocol).toBe(jsonRenderAuthoringProviderProtocol);
		expect(isProjectAuthoringProvider(authoringProvider)).toBe(true);
		expect(
			defineConfig({
				extensions: [extension],
				adapterOptions: { [adapter.id]: { mode: "compact" } },
				strict: true,
			}),
		).toMatchObject({
			adapterOptions: { [adapter.id]: { mode: "compact" } },
			strict: true,
		});
	});

	it("rejects invalid authoring references", () => {
		expect(
			isJsonRenderExtension({
				protocol: jsonRenderExtensionProtocol,
				id: "@acme/invalid",
				catalog: {},
				runtimes: {},
				authoring: { playground: { module: "", export: "provider" } },
			}),
		).toBe(false);
	});

	it("reads only versioned package registrations", () => {
		expect(
			parseExtensionPackageRegistration({
				"json-render-extended": {
					protocol: jsonRenderExtensionProtocol,
					extension: {
						module: "@acme/json-render-widgets/extension",
						export: "widgetsExtension",
					},
				},
			}),
		).toEqual({
			protocol: jsonRenderExtensionProtocol,
			extension: {
				module: "@acme/json-render-widgets/extension",
				export: "widgetsExtension",
			},
		});
		expect(
			parseExtensionPackageRegistration({
				"json-render-extended": {
					protocol: "json-render-extended/future",
					extension: { module: "@acme/future", export: "extension" },
				},
			}),
		).toBeNull();
	});
});
