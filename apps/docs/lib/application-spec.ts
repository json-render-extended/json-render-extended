import type { Spec } from "@json-render/core";
import type { NextAppSpec } from "@json-render/next";

import {
	actionsSpec,
	agentsOverviewSpec,
	componentsIntroSpec,
	coreAuthoringSpec,
	coreCompositionSpec,
	coreInstallationSpec,
	coreOverviewSpec,
	docsOverviewSpec,
	homeSpec,
	iconSetsSpec,
	iconsAuthoringSpec,
	iconsDiscoverySpec,
	iconsInstallationSpec,
	iconsOverviewSpec,
	installationSpec,
	playgroundAgentApiSpec,
	playgroundIntegrationsSpec,
	playgroundOverviewSpec,
	playgroundSpec,
	playgroundStorageSpec,
	registryExtensionsSpec,
	shadcnOverviewSpec,
	stylingSpec,
	synchronizationSpec,
} from "@/lib/page-specs";

const homePageSpec: Spec = {
	root: "application-home",
	elements: {
		"application-home": {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "none",
				align: "stretch",
				justify: "start",
				className: "docs-home-root",
			},
			children: [homeSpec.root, playgroundSpec.root],
		},
		...homeSpec.elements,
		...playgroundSpec.elements,
	},
};

const componentsPageSpec: Spec = {
	root: "components-page",
	elements: {
		"components-page": {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
				className: "docs-components-page",
			},
			children: [componentsIntroSpec.root, "component-explorer"],
		},
		...componentsIntroSpec.elements,
		"component-explorer": {
			type: "ComponentExplorer",
			props: {},
		},
	},
};

const docsLayout: Spec = {
	root: "docs-frame",
	elements: {
		"docs-frame": {
			type: "Stack",
			props: {
				direction: "horizontal",
				gap: "none",
				align: "stretch",
				justify: "start",
				className: "docs-layout",
			},
			children: ["docs-navigation", "docs-main"],
		},
		"docs-navigation": {
			type: "DocsNavigation",
			props: {},
		},
		"docs-main": {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "none",
				align: "stretch",
				justify: "start",
				className: "docs-main",
			},
			children: ["docs-content-slot"],
		},
		"docs-content-slot": { type: "Slot", props: {}, children: [] },
	},
};

export const applicationSpec = {
	metadata: {
		title: {
			default: "JSON Render Extended",
			template: "%s · JSON Render Extended",
		},
		description: "Extension registries and constrained vocabularies for JSON Render.",
	},
	layouts: {
		docs: docsLayout,
	},
	routes: {
		"/": {
			metadata: {
				title: { default: "JSON Render Extended", absolute: "JSON Render Extended" },
				description: "Extension registries and constrained vocabularies for JSON Render.",
			},
			page: homePageSpec,
		},
		"/docs": {
			layout: "docs",
			metadata: { title: "Documentation" },
			page: docsOverviewSpec,
		},
		"/docs/core": {
			layout: "docs",
			metadata: { title: "Core package" },
			page: coreOverviewSpec,
		},
		"/docs/core/installation": {
			layout: "docs",
			metadata: { title: "Core package installation" },
			page: coreInstallationSpec,
		},
		"/docs/core/authoring": {
			layout: "docs",
			metadata: { title: "Authoring an extension" },
			page: coreAuthoringSpec,
		},
		"/docs/core/composition": {
			layout: "docs",
			metadata: { title: "Project composition" },
			page: coreCompositionSpec,
		},
		"/docs/icons": {
			layout: "docs",
			metadata: { title: "Icon package" },
			page: iconsOverviewSpec,
		},
		"/docs/icons/installation": {
			layout: "docs",
			metadata: { title: "Icon package installation" },
			page: iconsInstallationSpec,
		},
		"/docs/icons/icon-sets": {
			layout: "docs",
			metadata: { title: "Icon sets" },
			page: iconSetsSpec,
		},
		"/docs/icons/discovery": {
			layout: "docs",
			metadata: { title: "Icon project discovery" },
			page: iconsDiscoverySpec,
		},
		"/docs/icons/authoring": {
			layout: "docs",
			metadata: { title: "Authoring an icon set" },
			page: iconsAuthoringSpec,
		},
		"/docs/agents": {
			layout: "docs",
			metadata: { title: "For AI agents" },
			page: agentsOverviewSpec,
		},
		"/docs/playground": {
			layout: "docs",
			metadata: { title: "Playground package" },
			page: playgroundOverviewSpec,
		},
		"/docs/playground/storage": {
			layout: "docs",
			metadata: { title: "Repository-backed specs" },
			page: playgroundStorageSpec,
		},
		"/docs/playground/integrations": {
			layout: "docs",
			metadata: { title: "Next.js and Svelte development links" },
			page: playgroundIntegrationsSpec,
		},
		"/docs/playground/agent-api": {
			layout: "docs",
			metadata: { title: "Playground Agent API" },
			page: playgroundAgentApiSpec,
		},
		"/docs/shadcn": {
			layout: "docs",
			metadata: { title: "shadcn package" },
			page: shadcnOverviewSpec,
		},
		"/docs/shadcn/installation": {
			layout: "docs",
			metadata: { title: "shadcn installation" },
			page: installationSpec,
		},
		"/docs/shadcn/components": {
			layout: "docs",
			metadata: { title: "shadcn components" },
			page: componentsPageSpec,
		},
		"/docs/shadcn/registry-extensions": {
			layout: "docs",
			metadata: { title: "shadcn registry extensions" },
			page: registryExtensionsSpec,
		},
		"/docs/shadcn/actions": {
			layout: "docs",
			metadata: { title: "shadcn events and actions" },
			page: actionsSpec,
		},
		"/docs/shadcn/styling": {
			layout: "docs",
			metadata: { title: "shadcn styling" },
			page: stylingSpec,
		},
		"/docs/shadcn/synchronization": {
			layout: "docs",
			metadata: { title: "shadcn synchronization" },
			page: synchronizationSpec,
		},
	},
} satisfies NextAppSpec;
