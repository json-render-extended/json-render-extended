import { describe, expect, it } from "vitest";

import { baseUiComponents } from "../src/base-ui";
import {
	allShadcnComponentNames,
	commonShadcnComponentNames,
	generatedShadcnStyle,
	shadcnRegistryCapabilities,
	shadcnStyleNames,
} from "../src/capabilities";
import { additionalShadcnComponentDefinitions, shadcnComponentDefinitions } from "../src/catalog";
import { radixComponents } from "../src/radix";
import { reactAriaComponents } from "../src/react-aria";
import {
	fallbackJsonRenderComponentNamesByBase,
	implementedJsonRenderComponentNames,
} from "../src/supported-components";

const sorted = (values: readonly string[]) => [...values].sort();

describe("JSON Render component registries", () => {
	it("exposes the complete 68-component catalog from all three base registries", () => {
		const expected = sorted(implementedJsonRenderComponentNames);
		expect(expected).toHaveLength(68);
		expect(sorted(Object.keys(shadcnComponentDefinitions))).toEqual(expected);
		expect(sorted(Object.keys(baseUiComponents))).toEqual(expected);
		expect(sorted(Object.keys(reactAriaComponents))).toEqual(expected);
		expect(sorted(Object.keys(radixComponents))).toEqual(expected);
	});

	it("provides a JSON Render key for every synchronized upstream source item", () => {
		const componentKeys = new Set<string>(implementedJsonRenderComponentNames);
		const toComponentKey = (sourceName: string) => {
			if (sourceName === "radio-group") return "Radio";
			return sourceName.replace(/(^|-)([a-z0-9])/g, (_, _separator, letter: string) =>
				letter.toUpperCase(),
			);
		};

		for (const sourceNames of Object.values(shadcnRegistryCapabilities)) {
			for (const sourceName of sourceNames) {
				expect(componentKeys.has(toComponentKey(sourceName)), sourceName).toBe(true);
			}
		}
	});

	it("declares the portable fallbacks forced by differences in the upstream matrices", () => {
		expect(fallbackJsonRenderComponentNamesByBase["base-ui"]).toEqual(["Toast"]);
		expect(fallbackJsonRenderComponentNamesByBase["react-aria"]).toEqual([
			"HoverCard",
			"Menubar",
			"NavigationMenu",
			"Toast",
		]);
		expect(fallbackJsonRenderComponentNamesByBase.radix).toEqual(["Toast"]);
	});

	it("ships a valid example for every additional component schema", () => {
		for (const [name, definition] of Object.entries(additionalShadcnComponentDefinitions)) {
			if (!definition.example) continue;
			expect(definition.props.safeParse(definition.example).success, name).toBe(true);
		}
	});
});

describe("upstream shadcn capabilities", () => {
	it("tracks availability per primitive base without flattening the differences", () => {
		expect(shadcnRegistryCapabilities["base-ui"]).toHaveLength(62);
		expect(shadcnRegistryCapabilities["react-aria"]).toHaveLength(58);
		expect(shadcnRegistryCapabilities.radix).toHaveLength(61);
		expect(commonShadcnComponentNames).toHaveLength(58);
		expect(allShadcnComponentNames).toHaveLength(62);

		expect(shadcnRegistryCapabilities["base-ui"]).toContain("toast");
		expect(shadcnRegistryCapabilities["react-aria"]).not.toContain("toast");
		expect(shadcnRegistryCapabilities.radix).not.toContain("toast");
		expect(shadcnRegistryCapabilities["react-aria"]).not.toContain("navigation-menu");
	});

	it("tracks all upstream styles and the generated prebuilt style", () => {
		expect(sorted(shadcnStyleNames)).toEqual([
			"luma",
			"lyra",
			"maia",
			"mira",
			"nova",
			"rhea",
			"sera",
			"vega",
		]);
		expect(generatedShadcnStyle).toBe("nova");
	});
});
