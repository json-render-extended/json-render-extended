import type { ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createShadcnComponents } from "../src/components";
import type { ShadcnPrimitiveSet } from "../src/components/types";

function LocalButton({
	children,
	variant,
	...props
}: ComponentProps<"button"> & { variant?: string }) {
	return (
		<button data-local-style="preserved" data-variant={variant} {...props}>
			{children}
		</button>
	);
}

describe("style-neutral registry factory", () => {
	it("renders the application's local shadcn primitive without replacing its styles", () => {
		const components = createShadcnComponents(
			{ Button: LocalButton } as unknown as ShadcnPrimitiveSet,
			{ base: "base-ui" },
		);

		const markup = renderToStaticMarkup(
			components.Button({
				props: { label: "Local component", variant: "secondary", disabled: false },
				emit: () => undefined,
				on: () => undefined as never,
			}),
		);

		expect(markup).toContain('data-local-style="preserved"');
		expect(markup).toContain('data-variant="secondary"');
		expect(markup).toContain("Local component");
	});
});
