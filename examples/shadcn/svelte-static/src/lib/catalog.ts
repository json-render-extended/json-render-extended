import { defineCatalog } from "@json-render/core";
import { shadcnComponentDefinitions } from "@json-render/shadcn-svelte/catalog";
import { schema } from "@json-render/svelte/schema";

export const catalog = defineCatalog(schema, {
	components: shadcnComponentDefinitions,
	actions: {},
});
