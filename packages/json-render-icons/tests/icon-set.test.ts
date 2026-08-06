import { describe, expect, it } from "vitest";

import { defineIconSet } from "../src";

const exampleIcons = defineIconSet({
	id: "example",
	version: "1.0.0",
	names: ["circle-check", "circle-x", "credit-card"] as const,
	exampleName: "circle-check",
	semantics: {
		"circle-check": { aliases: ["completed", "success"], intents: ["confirm"] },
		"credit-card": { aliases: ["billing", "payment"], intents: ["pay"] },
	},
	tokenAliases: { x: ["close", "error"] },
	categoryTokens: { status: ["check", "x"], commerce: ["credit-card"] },
});

describe("generic icon-set contract", () => {
	it("builds a compact validating Icon definition", () => {
		expect(
			exampleIcons.componentDefinitions.Icon.props.safeParse({ name: "circle-check" }).success,
		).toBe(true);
		expect(
			exampleIcons.componentDefinitions.Icon.props.safeParse({ name: "unknown" }).success,
		).toBe(false);
	});

	it("builds semantic metadata and retrieval", () => {
		expect(exampleIcons.search("payment", { limit: 1 })[0]?.name).toBe("credit-card");
		expect(exampleIcons.getMetadata("circle-check").categories).toContain("status");
	});

	it("creates an enum-scoped definition for an AI request", () => {
		const scoped = exampleIcons.createComponentDefinitions(["circle-check", "circle-x"]);
		expect(scoped.Icon.props.safeParse({ name: "credit-card" }).success).toBe(false);
	});

	it("keeps the scoped catalog example inside the retrieved names", () => {
		const scoped = exampleIcons.createComponentDefinitions(["credit-card"]);
		expect(scoped.Icon.example.name).toBe("credit-card");
	});
});
