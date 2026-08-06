import { defineRegistry } from "@json-render/react";
import { baseUiComponents } from "@json-render-extended/shadcn/base-ui";
import { radixComponents } from "@json-render-extended/shadcn/radix";
import { reactAriaComponents } from "@json-render-extended/shadcn/react-aria";

import { catalog } from "./catalog";

export const registryByBase = {
	"base-ui": defineRegistry(catalog, { components: baseUiComponents }).registry,
	"react-aria": defineRegistry(catalog, { components: reactAriaComponents }).registry,
	radix: defineRegistry(catalog, { components: radixComponents }).registry,
};
