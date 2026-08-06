import { defineCatalog } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import { tablerComponentDefinitions } from "@json-render-extended/icons/tabler/catalog";
import { tablerComponents } from "@json-render-extended/icons/tabler/react";
import type { ShadcnBase } from "@json-render-extended/shadcn";
import { baseUiComponents } from "@json-render-extended/shadcn/base-ui";
import { shadcnComponentDefinitions } from "@json-render-extended/shadcn/catalog";
import { radixComponents } from "@json-render-extended/shadcn/radix";
import { reactAriaComponents } from "@json-render-extended/shadcn/react-aria";

import type { PackageShowcaseProps } from "./package-showcase-schema";

type ShowcaseExtensions = PackageShowcaseProps["packages"][number]["extensions"];

const shadcnCatalog = defineCatalog(schema, {
	components: shadcnComponentDefinitions,
	actions: {},
});

const iconsCatalog = defineCatalog(schema, {
	components: {
		...shadcnComponentDefinitions,
		...tablerComponentDefinitions,
	},
	actions: {},
});

const shadcnRegistryByBase = {
	"base-ui": defineRegistry(shadcnCatalog, { components: baseUiComponents }).registry,
	"react-aria": defineRegistry(shadcnCatalog, { components: reactAriaComponents }).registry,
	radix: defineRegistry(shadcnCatalog, { components: radixComponents }).registry,
};

const iconsRegistryByBase = {
	"base-ui": defineRegistry(iconsCatalog, {
		components: { ...baseUiComponents, ...tablerComponents },
	}).registry,
	"react-aria": defineRegistry(iconsCatalog, {
		components: { ...reactAriaComponents, ...tablerComponents },
	}).registry,
	radix: defineRegistry(iconsCatalog, {
		components: { ...radixComponents, ...tablerComponents },
	}).registry,
};

export function getPackageShowcaseRegistry(extensions: ShowcaseExtensions, base: ShadcnBase) {
	return extensions.includes("@json-render-extended/icons/tabler")
		? iconsRegistryByBase[base]
		: shadcnRegistryByBase[base];
}
