import { describe, expect, it } from "vitest";

import {
	createTablerIconDefinition,
	getTablerIconMetadata,
	searchTablerIcons,
	tablerIconDefinition,
	tablerIconNames,
} from "../src/tabler";

describe("Tabler semantic metadata", () => {
	it("tracks every icon exported by the pinned Tabler version", () => {
		expect(tablerIconNames.length).toBeGreaterThan(6_000);
		expect(getTablerIconMetadata("circle-check")).toMatchObject({
			name: "circle-check",
			aliases: expect.arrayContaining(["completed", "success"]),
		});
		expect(tablerIconDefinition.props.safeParse({ name: "not-a-tabler-icon" }).success).toBe(false);
	});

	it("retrieves a compact shortlist by user intent", () => {
		const names = searchTablerIcons("completed successfully", { limit: 5 }).map(
			(result) => result.name,
		);
		expect(names).toContain("circle-check");
		expect(names.length).toBeGreaterThan(0);
		expect(names.length).toBeLessThanOrEqual(5);
	});

	it("creates a catalog definition constrained to a retrieved shortlist", () => {
		const definition = createTablerIconDefinition(["circle-check", "circle-x"]);
		expect(definition.props.safeParse({ name: "circle-check", label: "Completed" }).success).toBe(
			true,
		);
		expect(definition.props.safeParse({ name: "airplay" }).success).toBe(false);
	});
});
