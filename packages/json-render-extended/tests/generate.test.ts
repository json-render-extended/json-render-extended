import { describe, expect, it } from "vitest";

import { renderExtensionProjectModule, validateDeclaredExtensionCollisions } from "../src/generate";
import type { ResolvedExtensionProject } from "../src/project";
import { defineExtension } from "../src/protocol";

const first = defineExtension({
	id: "first",
	catalog: {
		components: { module: "@acme/first/catalog", export: "components", keys: ["Card"] },
	},
	runtimes: {
		react: { components: { module: "@acme/first/react", export: "components" } },
	},
});

function project(extensions: ResolvedExtensionProject["extensions"]): ResolvedExtensionProject {
	return {
		cwd: "/workspace/app",
		packageJsonPath: "/workspace/app/package.json",
		runtime: "react",
		strict: false,
		configPath: null,
		extensions,
		diagnostics: [],
		sources: [],
	};
}

describe("static extension composition", () => {
	it("generates static imports and typed per-extension surfaces", () => {
		const code = renderExtensionProjectModule(project([first]));

		expect(code).toContain(
			'import { components as extension0CatalogComponents } from "@acme/first/catalog";',
		);
		expect(code).toContain("export const componentsByExtension");
		expect(code).toContain("as const satisfies readonly ExtensionEntry[]");
		expect(code).not.toContain("await import(");
	});

	it("rejects undeclared collisions and accepts explicit overrides", () => {
		const second = defineExtension({
			id: "second",
			catalog: {
				components: { module: "@acme/second/catalog", export: "components", keys: ["Card"] },
			},
			runtimes: {},
		});
		expect(validateDeclaredExtensionCollisions(project([first, second]))).toEqual([
			expect.objectContaining({ code: "extension-surface-collision", extensionId: "second" }),
		]);

		const overriding = defineExtension({
			...second,
			overrides: { components: ["Card"] },
		});
		expect(validateDeclaredExtensionCollisions(project([first, overriding]))).toEqual([]);
	});
});
