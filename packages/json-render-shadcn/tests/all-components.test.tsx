import { defineCatalog, type Spec } from "@json-render/core";
import { defineRegistry, JSONUIProvider, Renderer } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { baseUiComponents } from "../src/base-ui";
import { additionalShadcnComponentDefinitions, shadcnComponentDefinitions } from "../src/catalog";
import { radixComponents } from "../src/radix";
import { reactAriaComponents } from "../src/react-aria";

const catalog = defineCatalog(schema, {
	components: shadcnComponentDefinitions,
	actions: {},
});

const registries = {
	"base-ui": defineRegistry(catalog, { components: baseUiComponents }).registry,
	"react-aria": defineRegistry(catalog, { components: reactAriaComponents }).registry,
	radix: defineRegistry(catalog, { components: radixComponents }).registry,
};

describe.each(Object.entries(registries))("%s complete registry", (_base, registry) => {
	for (const [name, definition] of Object.entries(additionalShadcnComponentDefinitions)) {
		it(`server-renders ${name}`, () => {
			const spec = {
				root: "subject",
				elements: {
					subject: {
						type: name,
						props: definition.example ?? {},
					},
				},
			} as Spec;

			expect(() =>
				renderToStaticMarkup(
					<JSONUIProvider registry={registry} initialState={{}}>
						<Renderer registry={registry} spec={spec} />
					</JSONUIProvider>,
				),
			).not.toThrow();
		});
	}
});
