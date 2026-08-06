import { shadcnComponents } from "@json-render/shadcn-svelte";
import { defineRegistry } from "@json-render/svelte";

import { catalog } from "./catalog";

export const { registry } = defineRegistry(catalog, {
	components: shadcnComponents,
});
