import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

import { componentDefinitions } from "./json-render-extended.generated";
import { packageShowcasePropsSchema } from "./package-showcase-schema";

export const docsCatalog = defineCatalog(schema, {
	components: {
		...componentDefinitions,
		ComponentExplorer: {
			props: z.object({}),
			description: "The searchable component capability explorer for this documentation app.",
		},
		DocsNavigation: {
			props: z.object({}),
			description: "The documentation navigation used in the JSON-defined docs layout.",
		},
		PackageShowcase: {
			props: packageShowcasePropsSchema,
			description:
				"An editable JSON Render playground with package presets, live rendering, and static code generation.",
		},
		SpecReferenceDemo: {
			props: z.object({
				message: z.string().optional(),
				spec: z.string(),
				title: z.string().optional(),
			}),
			description:
				"A project spec reference that resolves to runtime JSON Render or a materialized component.",
		},
	},
	actions: {},
});
