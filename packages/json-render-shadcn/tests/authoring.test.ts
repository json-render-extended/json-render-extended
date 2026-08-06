import { describe, expect, it } from "vitest";

import { generateShadcnCode } from "../src/authoring";

describe("shadcn authoring code generation", () => {
	it("turns public state props into typed component props with defaults", () => {
		const generated = generateShadcnCode(
			{
				root: "title",
				state: { props: { title: "Default title" } },
				elements: {
					title: {
						type: "Heading",
						props: { level: "h2", text: { $state: "/props/title" } },
					},
				},
			},
			{
				componentName: "AccountSummary",
				componentProps: [{ name: "title", type: "string", defaultValue: "Default title" }],
			},
		);

		expect(generated.code).toContain("export interface AccountSummaryProps");
		expect(generated.code).toContain('"title"?: string;');
		expect(generated.code).toContain("AccountSummary(props: AccountSummaryProps)");
		expect(generated.code).toContain('props.title ?? "Default title"');
	});
});
