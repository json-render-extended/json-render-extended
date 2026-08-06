import { describe, expect, it } from "vitest";

import { componentNameFromOutput, componentNameFromSpecId } from "../src/component-name";

describe("materialized component names", () => {
	it("normalizes the spec name for live code", () => {
		expect(componentNameFromSpecId("checkout/order-summary")).toBe("OrderSummary");
	});

	it("prefers the output filename and falls back for index files", () => {
		expect(
			componentNameFromOutput("components/generated/cart-totals.tsx", "checkout/summary"),
		).toBe("CartTotals");
		expect(componentNameFromOutput("components/checkout/index.tsx", "checkout/summary")).toBe(
			"Summary",
		);
	});
});
