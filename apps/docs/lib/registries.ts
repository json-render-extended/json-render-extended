import { defineRegistry } from "@json-render/react";
import { radixComponents } from "@json-render-extended/shadcn/radix";
import { reactAriaComponents } from "@json-render-extended/shadcn/react-aria";

import { ComponentExplorer } from "@/components/component-explorer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { PackageShowcase } from "@/components/package-showcase";
import { SpecReferenceDemo } from "@/components/spec-reference-demo";

import { docsCatalog } from "./catalog";
import {
	componentsByExtension,
	components as projectComponents,
} from "./json-render-extended.generated";

const sharedProjectComponents = Object.assign(
	{},
	...Object.entries(componentsByExtension)
		.filter(([extensionId]) => extensionId !== "@json-render-extended/shadcn")
		.map(([, extensionComponents]) => extensionComponents),
);

export const registryByBase = {
	"base-ui": defineRegistry(docsCatalog, {
		components: {
			...projectComponents,
			ComponentExplorer,
			DocsNavigation: DocsSidebar,
			PackageShowcase,
			SpecReferenceDemo,
		},
	}).registry,
	"react-aria": defineRegistry(docsCatalog, {
		components: {
			...reactAriaComponents,
			...sharedProjectComponents,
			ComponentExplorer,
			DocsNavigation: DocsSidebar,
			PackageShowcase,
			SpecReferenceDemo,
		},
	}).registry,
	radix: defineRegistry(docsCatalog, {
		components: {
			...radixComponents,
			...sharedProjectComponents,
			ComponentExplorer,
			DocsNavigation: DocsSidebar,
			PackageShowcase,
			SpecReferenceDemo,
		},
	}).registry,
};
