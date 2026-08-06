import { describe, expect, it } from "vitest";
import { z } from "zod";

import { extendShadcnComponentDefinitions, extendShadcnComponents } from "../src/extend";

describe("local extension helpers", () => {
	it("adds local definitions and lets the last extension override an existing key", () => {
		const first = {
			Map: {
				props: z.object({ center: z.string() }),
				description: "Map supplied by an ecosystem package.",
			},
		};
		const local = {
			Map: {
				props: z.object({ center: z.string(), zoom: z.number().optional() }),
				description: "Locally customized map.",
			},
		};
		const definitions = extendShadcnComponentDefinitions(first, local);

		expect(definitions.Button).toBeDefined();
		expect(definitions.Map.description).toBe("Locally customized map.");
		expect(definitions.Map.props.safeParse({ center: "Rome", zoom: 12 }).success).toBe(true);
	});

	it("merges runtime component maps in the same deterministic order", () => {
		const builtIn = { Button: "built-in", Card: "built-in" };
		const ecosystem = { Map: "ecosystem" };
		const local = { Button: "local" };

		expect(extendShadcnComponents(builtIn, ecosystem, local)).toEqual({
			Button: "local",
			Card: "built-in",
			Map: "ecosystem",
		});
	});
});
