import { describe, expect, it } from "vitest";

import {
	createLucideIconDefinition,
	getLucideIconMetadata,
	lucideIconDefinition,
	lucideIconNames,
	searchLucideIcons,
} from "../src/lucide";

describe("Lucide semantic metadata", () => {
	it("tracks every icon exported by the pinned Lucide version", () => {
		expect(lucideIconNames.length).toBeGreaterThan(1_500);
		expect(getLucideIconMetadata("circle-check")).toMatchObject({
			name: "circle-check",
			aliases: expect.arrayContaining(["completed", "success"]),
		});
		expect(lucideIconDefinition.props.safeParse({ name: "not-a-lucide-icon" }).success).toBe(false);
	});

	it("retrieves a compact shortlist by user intent", () => {
		const names = searchLucideIcons("completed successfully", { limit: 5 }).map(
			(result) => result.name,
		);
		expect(names).toContain("circle-check");
		expect(names.length).toBeGreaterThan(0);
		expect(names.length).toBeLessThanOrEqual(5);
	});

	it("creates a catalog definition constrained to a retrieved shortlist", () => {
		const definition = createLucideIconDefinition(["circle-check", "circle-x"]);
		expect(definition.props.safeParse({ name: "circle-check", label: "Completed" }).success).toBe(
			true,
		);
		expect(definition.props.safeParse({ name: "airplay" }).success).toBe(false);
	});
});
