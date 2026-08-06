import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TablerIcon } from "../src/tabler/react";

describe("Tabler JSON Render component", () => {
	it("server-renders common semantic icons with accessible labels", () => {
		const markup = renderToStaticMarkup(
			<TablerIcon
				props={{ name: "circle-check", label: "Completed", size: "lg" }}
				emit={() => undefined}
				on={() => undefined as never}
			/>,
		);
		expect(markup).toContain('aria-label="Completed"');
		expect(markup).toContain('width="24"');
	});

	it("maps every published name to a React component", async () => {
		const { icons } = await import("@tabler/icons-react");
		const componentNames = new Set(Object.keys(icons));
		const missing = (await import("../src/tabler/names")).tablerIconNames.filter(
			(name) =>
				!componentNames.has(
					`Icon${name
						.split("-")
						.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
						.join("")}`,
				),
		);
		expect(missing).toEqual([]);
	});
});
