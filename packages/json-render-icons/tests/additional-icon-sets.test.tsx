import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
	getHugeiconsIconMetadata,
	hugeiconsIconDefinition,
	hugeiconsIconNames,
} from "../src/hugeicons";
import { HugeiconsIcon } from "../src/hugeicons/react";
import {
	getPhosphorIconMetadata,
	phosphorIconDefinition,
	phosphorIconNames,
} from "../src/phosphor";
import { PhosphorIcon } from "../src/phosphor/react";
import { getRemixIconMetadata, remixIconDefinition, remixIconNames } from "../src/remix";
import { RemixIcon } from "../src/remix/react";

describe.each([
	{
		name: "Hugeicons",
		count: () => hugeiconsIconNames.length,
		definition: hugeiconsIconDefinition,
		example: "checkmark-circle-02",
		metadata: () => getHugeiconsIconMetadata("checkmark-circle-02"),
		render: () =>
			renderToStaticMarkup(
				<HugeiconsIcon
					props={{ name: "checkmark-circle-02", label: "Completed", size: "lg" }}
					emit={() => undefined}
					on={() => undefined as never}
				/>,
			),
	},
	{
		name: "Phosphor",
		count: () => phosphorIconNames.length,
		definition: phosphorIconDefinition,
		example: "check-circle",
		metadata: () => getPhosphorIconMetadata("check-circle"),
		render: () =>
			renderToStaticMarkup(
				<PhosphorIcon
					props={{ name: "check-circle", label: "Completed", size: "lg" }}
					emit={() => undefined}
					on={() => undefined as never}
				/>,
			),
	},
	{
		name: "Remix",
		count: () => remixIconNames.length,
		definition: remixIconDefinition,
		example: "checkbox-circle-line",
		metadata: () => getRemixIconMetadata("checkbox-circle-line"),
		render: () =>
			renderToStaticMarkup(
				<RemixIcon
					props={{ name: "checkbox-circle-line", label: "Completed", size: "lg" }}
					emit={() => undefined}
					on={() => undefined as never}
				/>,
			),
	},
])("$name adapter", ({ count, definition, example, metadata, render }) => {
	it("derives and validates every installed icon name", () => {
		expect(count()).toBeGreaterThan(1_000);
		expect(metadata()).toMatchObject({
			name: example,
			aliases: expect.arrayContaining(["completed", "success"]),
		});
		expect(definition.props.safeParse({ name: example }).success).toBe(true);
		expect(definition.props.safeParse({ name: "not-an-icon" }).success).toBe(false);
	});

	it("server-renders an accessible icon", () => {
		const markup = render();
		expect(markup).toContain('aria-label="Completed"');
		expect(markup).toContain('width="24"');
	});
});
