import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LucideIcon } from "../src/lucide/react";

describe("Lucide JSON Render component", () => {
	it("server-renders common semantic icons with accessible labels", () => {
		const markup = renderToStaticMarkup(
			<LucideIcon
				props={{ name: "circle-check", label: "Completed", size: "lg" }}
				emit={() => undefined}
				on={() => undefined as never}
			/>,
		);
		expect(markup).toContain('aria-label="Completed"');
		expect(markup).toContain('width="24"');
	});

	it("hides decorative icons from assistive technology", () => {
		const markup = renderToStaticMarkup(
			<LucideIcon
				props={{ name: "x", decorative: true }}
				emit={() => undefined}
				on={() => undefined as never}
			/>,
		);
		expect(markup).toContain('aria-hidden="true"');
		expect(markup).not.toContain("aria-label");
	});
});
