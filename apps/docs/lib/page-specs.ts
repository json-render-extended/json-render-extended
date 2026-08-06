import type { Spec } from "@json-render/core";

import { publicRegistryUrlTemplate, publicSkillsSource, withBasePath } from "@/lib/site-config";

const packageName = "@json-render-extended/shadcn";
const corePackageName = "@json-render-extended/core";
const iconCorePackageName = "@json-render-extended/icons";
const playgroundPackageName = "@json-render-extended/playground";
const lucideIconPackageName = "@json-render-extended/icons/lucide";
const tablerIconPackageName = "@json-render-extended/icons/tabler";
const hugeiconsIconPackageName = "@json-render-extended/icons/hugeicons";
const phosphorIconPackageName = "@json-render-extended/icons/phosphor";
const remixIconPackageName = "@json-render-extended/icons/remix";

const shadcnPlaygroundSpec = {
	root: "surface",
	elements: {
		surface: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
			},
			children: ["badge", "title", "lead", "features", "status"],
		},
		badge: { type: "Badge", props: { text: "SHADCN REGISTRY", variant: "secondary" } },
		title: { type: "Heading", props: { text: "One spec, three primitive bases", level: "h2" } },
		lead: {
			type: "Text",
			props: {
				text: "The active header switch changes the renderer without changing this JSON.",
				variant: "muted",
			},
		},
		features: {
			type: "Grid",
			props: { columns: 2, gap: "sm" },
			children: ["components", "styles"],
		},
		components: {
			type: "Card",
			props: {
				title: "68 component keys",
				description: "Base UI, React Aria, and Radix adapters.",
				maxWidth: "full",
				centered: false,
			},
		},
		styles: {
			type: "Card",
			props: {
				title: "Application-owned styles",
				description: "Local shadcn components keep tokens and CSS in your app.",
				maxWidth: "full",
				centered: false,
			},
		},
		status: {
			type: "Alert",
			props: {
				title: "Registry ready",
				message: "Edit this spec or switch the primitive registry above.",
				type: "success",
			},
		},
	},
};

const iconsPlaygroundSpec = {
	root: "surface",
	elements: {
		surface: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
			},
			children: ["badge", "title", "lead", "icons", "note"],
		},
		badge: { type: "Badge", props: { text: "SEMANTIC ICONS", variant: "outline" } },
		title: { type: "Heading", props: { text: "One Icon contract", level: "h2" } },
		lead: {
			type: "Text",
			props: {
				text: "Every name is validated against the icon set selected by the project.",
				variant: "muted",
			},
		},
		icons: {
			type: "Stack",
			props: {
				direction: "horizontal",
				gap: "lg",
				align: "center",
				justify: "center",
			},
			children: ["success", "payment", "search", "settings", "alert", "user"],
		},
		success: { type: "Icon", props: { name: "circle-check", label: "Success", size: "xl" } },
		payment: { type: "Icon", props: { name: "credit-card", label: "Payment", size: "xl" } },
		search: { type: "Icon", props: { name: "search", label: "Search", size: "xl" } },
		settings: { type: "Icon", props: { name: "settings", label: "Settings", size: "xl" } },
		alert: { type: "Icon", props: { name: "alert-circle", label: "Alert", size: "xl" } },
		user: { type: "Icon", props: { name: "user", label: "Account", size: "xl" } },
		note: {
			type: "Alert",
			props: {
				title: "Tabler selected in this project",
				message: "Lucide, Hugeicons, Phosphor, and Remix can implement the same JSON contract.",
				type: "info",
			},
		},
	},
};

export const homeSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-json-page docs-home",
			},
			children: ["hero", "packages", "features", "workflow", "cta"],
		},
		hero: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "start",
				justify: "center",
				className: "docs-hero",
			},
			children: ["hero-badge", "hero-title", "hero-lead", "hero-actions", "hero-note"],
		},
		"hero-badge": {
			type: "Badge",
			props: { text: "THE EXTENSION REGISTRY ECOSYSTEM", variant: "outline" },
		},
		"hero-title": {
			type: "Heading",
			props: { text: "JSON Render → extensions → UI", level: "h1" },
		},
		"hero-lead": {
			type: "Text",
			props: {
				text: "A home for focused catalogs and registries that give AI new, constrained building blocks without weakening the JSON Render contract.",
				variant: "lead",
			},
		},
		"hero-actions": {
			type: "Stack",
			props: {
				direction: "horizontal",
				gap: "md",
				align: "center",
				justify: "start",
				className: "docs-hero-actions",
			},
			children: ["hero-docs", "hero-components"],
		},
		"hero-docs": {
			type: "Link",
			props: { label: "Read the documentation →", href: withBasePath("/docs") },
		},
		"hero-components": {
			type: "Link",
			props: {
				label: "Explore extension packages",
				href: withBasePath("/docs/shadcn"),
			},
		},
		"hero-note": {
			type: "Text",
			props: {
				text: "Routes, layouts, metadata, and page UI are themselves rendered from JSON specifications.",
				variant: "caption",
			},
		},
		packages: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
				className: "docs-section docs-packages-section",
			},
			children: ["packages-heading", "packages-lead", "package-showcase"],
		},
		"packages-heading": {
			type: "Heading",
			props: { text: "Production packages, one extension protocol", level: "h2" },
		},
		"packages-lead": {
			type: "Text",
			props: {
				text: "Edit a prefilled JSON Render spec, inspect the live result, or switch to the generated static component code.",
				variant: "lead",
			},
		},
		"package-showcase": {
			type: "PackageShowcase",
			props: {
				packages: [
					{
						id: "shadcn",
						label: "shadcn",
						name: packageName,
						href: withBasePath("/docs/shadcn"),
						extensions: [packageName],
						source: JSON.stringify(shadcnPlaygroundSpec, null, 2),
					},
					{
						id: "icons",
						label: "icons",
						name: iconCorePackageName,
						href: withBasePath("/docs/icons"),
						extensions: [packageName, tablerIconPackageName],
						source: JSON.stringify(iconsPlaygroundSpec, null, 2),
					},
				],
			},
		},
		features: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
				className: "docs-section",
			},
			children: ["features-heading", "features-lead", "feature-grid"],
		},
		"features-heading": {
			type: "Heading",
			props: { text: "An ecosystem of constrained vocabularies", level: "h2" },
		},
		"features-lead": {
			type: "Text",
			props: {
				text: "Each extension adds a bounded capability to JSON Render while remaining independently versioned, testable, and replaceable.",
				variant: "lead",
			},
		},
		"feature-grid": {
			type: "Grid",
			props: { columns: 3, gap: "md", className: "docs-feature-grid" },
			children: ["feature-parity", "feature-local", "feature-sync"],
		},
		"feature-parity": {
			type: "Card",
			props: {
				title: "UI component registries",
				description:
					"Stable semantic keys can target different primitive systems without changing an AI-generated specification.",
				maxWidth: "full",
				centered: false,
				className: "docs-feature-card",
			},
		},
		"feature-local": {
			type: "Card",
			props: {
				title: "Semantic icon registries",
				description:
					"Icon names, intent tags, aliases, and accessibility metadata create a safer selection layer for AI.",
				maxWidth: "full",
				centered: false,
				className: "docs-feature-card",
			},
		},
		"feature-sync": {
			type: "Card",
			props: {
				title: "AI-ready contracts",
				description:
					"Catalog descriptions, schemas, capabilities, and shortlists tell a model exactly what it may generate.",
				maxWidth: "full",
				centered: false,
				className: "docs-feature-card",
			},
		},
		workflow: {
			type: "Card",
			props: {
				title: "From intent to a safe rendering vocabulary.",
				description: "JSON Render core → extension catalog → constrained JSON → target renderer",
				maxWidth: "full",
				centered: false,
				className: "docs-workflow-card",
			},
			children: ["workflow-steps"],
		},
		"workflow-steps": {
			type: "Grid",
			props: { columns: 4, gap: "sm", className: "docs-workflow-grid" },
			children: ["step-one", "step-two", "step-three", "step-four"],
		},
		"step-one": { type: "Badge", props: { text: "01 · Core", variant: "outline" } },
		"step-two": { type: "Badge", props: { text: "02 · Extension", variant: "outline" } },
		"step-three": {
			type: "Badge",
			props: { text: "03 · JSON spec", variant: "outline" },
		},
		"step-four": { type: "Badge", props: { text: "04 · Renderer", variant: "default" } },
		cta: {
			type: "Card",
			props: {
				title: "Explore the available extension packages.",
				description:
					"The shadcn and icon packages demonstrate components, assets, semantic retrieval, and AI-safe catalogs.",
				maxWidth: "full",
				centered: false,
				className: "docs-cta-card",
			},
			children: ["cta-link"],
		},
		"cta-link": {
			type: "Link",
			props: {
				label: "Open the package documentation →",
				href: withBasePath("/docs"),
			},
		},
	},
} satisfies Spec;

export const playgroundSpec = {
	root: "playground",
	elements: {
		playground: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
				className: "docs-json-page docs-playground",
			},
			children: ["eyebrow", "title", "intro", "panel"],
		},
		eyebrow: {
			type: "Badge",
			props: { text: "FIRST EXTENSION · SHADCN", variant: "secondary" },
		},
		title: {
			type: "Heading",
			props: { text: "One shadcn spec, three primitive systems", level: "h2" },
		},
		intro: {
			type: "Text",
			props: {
				text: "Use the selector in the header. This package-level example is re-rendered through Base UI, React Aria, or Radix while its JSON remains unchanged.",
				variant: "lead",
			},
		},
		panel: {
			type: "Card",
			props: {
				title: "Release readiness",
				description: "A small cross-base interface composed entirely from registry components.",
				maxWidth: "full",
				centered: false,
				className: "docs-live-card",
			},
			children: ["crumbs", "status-grid", "separator", "message", "progress"],
		},
		crumbs: {
			type: "Breadcrumb",
			props: {
				items: [
					{ label: "Workspace", href: "#playground" },
					{ label: "Release", href: "#playground", active: true },
				],
			},
		},
		"status-grid": {
			type: "Grid",
			props: { columns: 3, gap: "md", className: "docs-live-grid" },
			children: ["status-catalog", "status-tests", "status-style"],
		},
		"status-catalog": {
			type: "Badge",
			props: { text: "68 keys", variant: "default" },
		},
		"status-tests": {
			type: "Badge",
			props: { text: "103 tests", variant: "secondary" },
		},
		"status-style": {
			type: "Kbd",
			props: { keys: ["Nova", "⌘", "K"] },
		},
		separator: { type: "Separator", props: { orientation: "horizontal" } },
		message: {
			type: "Message",
			props: {
				content: "The registry contract is ready across Base UI, React Aria, and Radix.",
				role: "assistant",
				author: "Registry check",
				avatarSrc: null,
				time: "now",
			},
		},
		progress: {
			type: "Progress",
			props: { value: 100, max: 100, label: "Cross-base coverage" },
		},
	},
} satisfies Spec;

export const docsOverviewSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: ["badge", "title", "lead", "path", "next"],
		},
		badge: { type: "Badge", props: { text: "OVERVIEW", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Documentation", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "json-render-extended is a monorepo for independently published packages that add constrained component, asset, and semantic vocabularies to JSON Render.",
				variant: "lead",
			},
		},
		path: {
			type: "Grid",
			props: { columns: 2, gap: "md", className: "docs-guide-grid" },
			children: ["core", "install", "catalog", "agents", "styling", "sync"],
		},
		core: {
			type: "Card",
			props: {
				title: "Extension SDK and composer",
				description:
					"The shared protocol that lets packages self-describe and applications compose installed plus local extensions.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["core-link"],
		},
		"core-link": {
			type: "Link",
			props: { label: "Open the core package docs →", href: withBasePath("/docs/core") },
		},
		install: {
			type: "Card",
			props: {
				title: "shadcn registry",
				description:
					"Available now: 68 UI component keys with interchangeable Base UI, React Aria, and Radix implementations.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["install-link"],
		},
		"install-link": {
			type: "Link",
			props: { label: "Open package docs →", href: withBasePath("/docs/shadcn") },
		},
		catalog: {
			type: "Card",
			props: {
				title: "Extensible icon registries",
				description:
					"A generic Icon contract plus five optional adapters with package.json discovery, semantic metadata, and compact AI shortlists.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["catalog-link"],
		},
		"catalog-link": {
			type: "Link",
			props: {
				label: "Open the icon package docs →",
				href: withBasePath("/docs/icons"),
			},
		},
		agents: {
			type: "Card",
			props: {
				title: "Agent-ready distribution",
				description:
					"Install focused Agent Skills or discover them from the deployed documentation endpoint.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["agents-link"],
		},
		"agents-link": {
			type: "Link",
			props: { label: "Configure an AI agent →", href: withBasePath("/docs/agents") },
		},
		styling: {
			type: "Card",
			props: {
				title: "Package-scoped examples",
				description:
					"Each published family owns focused static and AI examples instead of sharing an ambiguous demo surface.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["styling-link"],
		},
		"styling-link": {
			type: "Link",
			props: {
				label: "See the shadcn examples →",
				href: withBasePath("/docs/shadcn"),
			},
		},
		sync: {
			type: "Card",
			props: {
				title: "Shared quality contract",
				description:
					"Every extension is formatted with Biome tabs, typechecked, tested, built, and audited against its upstream source.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["sync-link"],
		},
		"sync-link": {
			type: "Link",
			props: {
				label: "See the current sync model →",
				href: withBasePath("/docs/shadcn/synchronization"),
			},
		},
		next: {
			type: "Card",
			props: {
				title: "What belongs in an extension",
				description:
					"An extension supplies a constrained schema, runtime registry, capability metadata, provenance, documentation, and examples. Product-specific business actions remain in consuming applications.",
				maxWidth: "full",
				centered: false,
				className: "docs-concept-card",
			},
		},
	},
} satisfies Spec;

export const coreOverviewSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: ["badge", "title", "lead", "layers", "automatic-title", "automatic", "output"],
		},
		badge: { type: "Badge", props: { text: "CORE PACKAGE · PROTOCOL", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Extension SDK and composer", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: `${corePackageName} gives every extension family one versioned way to describe catalogs, runtime registries, styles, capabilities, provenance, and explicit overrides.`,
				variant: "lead",
			},
		},
		layers: {
			type: "Table",
			props: {
				caption: "Core responsibilities",
				columns: ["Layer", "Purpose"],
				rows: [
					[
						"Protocol",
						"A shared descriptor for components, actions, runtimes, styles, and provenance",
					],
					["Discovery", "Read opt-in metadata from direct dependencies in package.json"],
					[
						"Adapters",
						"Derive extensions from project state such as components.json or installed icon libraries",
					],
					[
						"Composition",
						"Generate deterministic static imports with collision checks and explicit overrides",
					],
				],
			},
		},
		"automatic-title": {
			type: "Heading",
			props: { text: "Packages extend the project automatically", level: "h2" },
		},
		automatic: {
			type: "CodeBlock",
			props: {
				label: "package.json",
				language: "json",
				code: `{
	"dependencies": {
		"@json-render-extended/core": "^0.1.0",
		"@json-render-extended/shadcn": "^0.1.0",
		"@json-render-extended/icons": "^0.1.0"
	}
}`,
			},
		},
		output: {
			type: "Alert",
			props: {
				title: "Discovery produces source, not a hidden runtime",
				message:
					"The generator writes ordinary static imports. Applications review, typecheck, bundle, and cache the result with their existing toolchain.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const coreInstallationSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"install-title",
				"install",
				"script-title",
				"script",
				"usage-title",
				"usage",
			],
		},
		badge: {
			type: "Badge",
			props: { text: "CORE PACKAGE · GETTING STARTED", variant: "secondary" },
		},
		title: { type: "Heading", props: { text: "Installation", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "Install the core next to whichever extension packages the application needs. Direct dependencies opt in through their package manifests.",
				variant: "lead",
			},
		},
		"install-title": { type: "Heading", props: { text: "Add the composer", level: "h2" } },
		install: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm add ${corePackageName}`,
			},
		},
		"script-title": {
			type: "Heading",
			props: { text: "Generate before development and builds", level: "h2" },
		},
		script: {
			type: "CodeBlock",
			props: {
				label: "package.json",
				language: "json",
				code: `{
	"scripts": {
		"extensions:generate": "json-render-extended generate --output lib/json-render-extended.generated.ts",
		"predev": "pnpm extensions:generate",
		"prebuild": "pnpm extensions:generate"
	}
}`,
			},
		},
		"usage-title": {
			type: "Heading",
			props: { text: "Import the composed surfaces", level: "h2" },
		},
		usage: {
			type: "CodeBlock",
			props: {
				label: "lib/json-render.ts",
				language: "ts",
				code: `import { defineCatalog } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import {
	actionDefinitions,
	actions,
	componentDefinitions,
	components,
} from "./json-render-extended.generated";

export const catalog = defineCatalog(schema, {
	components: componentDefinitions,
	actions: actionDefinitions,
});

export const { registry } = defineRegistry(catalog, {
	components,
	actions,
});`,
			},
		},
	},
} satisfies Spec;

export const coreAuthoringSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"descriptor-title",
				"descriptor",
				"manifest-title",
				"manifest",
				"adapter",
			],
		},
		badge: { type: "Badge", props: { text: "CORE PACKAGE · ECOSYSTEM", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Authoring an extension", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "Any package can join the ecosystem without being added to this monorepo. It publishes resolvable catalog and runtime exports plus one versioned descriptor.",
				variant: "lead",
			},
		},
		"descriptor-title": {
			type: "Heading",
			props: { text: "Describe the public surfaces", level: "h2" },
		},
		descriptor: {
			type: "CodeBlock",
			props: {
				label: "src/extension.ts",
				language: "ts",
				code: `import { defineExtension } from "${corePackageName}";

export const extension = defineExtension({
	id: "@acme/json-render-charts",
	catalog: {
		components: {
			module: "@acme/json-render-charts/catalog",
			export: "componentDefinitions",
			keys: ["LineChart"],
		},
	},
	runtimes: {
		react: {
			components: {
				module: "@acme/json-render-charts/react",
				export: "components",
				keys: ["LineChart"],
			},
		},
	},
	capabilities: { tags: ["charts", "analytics"] },
});`,
			},
		},
		"manifest-title": {
			type: "Heading",
			props: { text: "Make the package self-describing", level: "h2" },
		},
		manifest: {
			type: "CodeBlock",
			props: {
				label: "package.json",
				language: "json",
				code: `{
	"json-render-extended": {
		"protocol": "json-render-extended/v1",
		"extension": {
			"module": "@acme/json-render-charts/extension",
			"export": "extension"
		}
	}
}`,
			},
		},
		adapter: {
			type: "Alert",
			props: {
				title: "Use an adapter for project-aware behavior",
				message:
					"An adapter may inspect local configuration and installed dependencies, then return one or more descriptors. It must not install dependencies, mutate the project, or execute fetched source.",
				type: "info",
			},
		},
	},
} satisfies Spec;

export const coreCompositionSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"order",
				"config-title",
				"config",
				"commands-title",
				"commands",
				"trust",
			],
		},
		badge: { type: "Badge", props: { text: "CORE PACKAGE · COMPOSITION", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Project composition", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "The composer resolves opt-in direct dependencies first, then local configuration. A later extension may replace a key only by declaring that override explicitly.",
				variant: "lead",
			},
		},
		order: {
			type: "Table",
			props: {
				caption: "Deterministic resolution order",
				columns: ["Order", "Source", "Behavior"],
				rows: [
					["1", "Direct dependencies", "Load versioned package descriptors or project adapters"],
					[
						"2",
						"Local configuration",
						"Add application-owned extensions or exclude discovered IDs",
					],
					["3", "Validation", "Reject duplicate IDs and undeclared component or action collisions"],
					["4", "Generation", "Write static imports and typed aggregate plus per-extension maps"],
				],
			},
		},
		"config-title": { type: "Heading", props: { text: "Add local capabilities", level: "h2" } },
		config: {
			type: "CodeBlock",
			props: {
				label: "json-render-extended.config.ts",
				language: "ts",
				code: `import { defineConfig } from "${corePackageName}";
import { productExtension } from "./lib/product-extension";

export default defineConfig({
	runtime: "react",
	extensions: [productExtension],
	exclude: ["@acme/unused-extension"],
	strict: true,
});`,
			},
		},
		"commands-title": {
			type: "Heading",
			props: { text: "Inspect and validate the resolved project", level: "h2" },
		},
		commands: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-extended inspect
pnpm exec json-render-extended validate
pnpm exec json-render-extended generate --output lib/json-render-extended.generated.ts`,
			},
		},
		trust: {
			type: "Alert",
			props: {
				title: "Installed code is the trust boundary",
				message:
					"Discovery reads package manifests and known local receipts. Registry metadata may describe installed files, but the core never evaluates remote JavaScript or silently changes dependencies.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const agentsOverviewSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"layers-title",
				"layers",
				"skills-title",
				"skills-install",
				"skills",
				"live-knowledge",
				"trust",
			],
		},
		badge: { type: "Badge", props: { text: "AGENT SKILLS · AVAILABLE", variant: "secondary" } },
		title: { type: "Heading", props: { text: "For AI agents", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "Registry files distribute code, JSON Render catalogs constrain generated UI, and portable Agent Skills teach an agent how to inspect and extend a project safely.",
				variant: "lead",
			},
		},
		"layers-title": {
			type: "Heading",
			props: { text: "One ecosystem, separate responsibilities", level: "h2" },
		},
		layers: {
			type: "Table",
			props: {
				caption: "Distribution layers",
				columns: ["Layer", "Purpose", "Source of truth"],
				rows: [
					["shadcn registry", "Install component and adapter files", "Registry JSON"],
					[
						"JSON Render catalog",
						"Constrain valid component props and events",
						"Package or receipt",
					],
					[
						"Agent Skill",
						"Teach project inspection and authoring workflows",
						"Versioned skill source",
					],
					["CLI", "Resolve current project and dependency state", "Local files and manifests"],
				],
			},
		},
		"skills-title": {
			type: "Heading",
			props: { text: "Install from the source repository", level: "h2" },
		},
		"skills-install": {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `npx skills add ${publicSkillsSource} --skill json-render-extensions
npx skills add ${publicSkillsSource} --skill json-render-shadcn
npx skills add ${publicSkillsSource} --skill json-render-icons
npx skills add ${publicSkillsSource} --skill json-render-registry-authoring`,
			},
		},
		skills: {
			type: "Table",
			props: {
				caption: "Available Agent Skills",
				columns: ["Skill", "Use it for"],
				rows: [
					[
						"json-render-extensions",
						"Core discovery, local composition, validation, and extension authoring",
					],
					[
						"json-render-shadcn",
						"Multi-base setup, components.json discovery, and local overrides",
					],
					["json-render-icons", "Installed icon-set detection and semantic icon catalogs"],
					[
						"json-render-registry-authoring",
						"Publishing compatible shadcn registry providers and receipts",
					],
				],
			},
		},
		"live-knowledge": {
			type: "Card",
			props: {
				title: "Skills teach the workflow; CLIs read live state",
				description:
					"Component matrices and icon names stay out of static prompts. Agents inspect package.json, components.json, installed receipts, and generated modules through the package CLIs.",
				maxWidth: "full",
				centered: false,
				className: "docs-concept-card",
			},
		},
		trust: {
			type: "Alert",
			props: {
				title: "Installation remains explicit",
				message:
					"Skills may inspect project configuration and recommend commands, but they do not silently install dependencies, add registries, execute fetched source, or expose registry credentials.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const shadcnOverviewSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec docs-package-overview",
			},
			children: ["badge", "title", "lead", "status", "install", "areas", "contract"],
		},
		badge: { type: "Badge", props: { text: "PACKAGE · AVAILABLE", variant: "secondary" } },
		title: { type: "Heading", props: { text: packageName, level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "A synchronized shadcn component catalog for JSON Render with Base UI, React Aria, and Radix registry entry points.",
				variant: "lead",
			},
		},
		status: {
			type: "Alert",
			props: {
				title: "The first json-render-extended package",
				message:
					"All three React registries expose the same 68 semantic keys. Upstream gaps are represented by explicit portable fallbacks instead of disappearing from the contract.",
				type: "success",
			},
		},
		install: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm add ${packageName} @json-render/core @json-render/react zod`,
			},
		},
		areas: {
			type: "Grid",
			props: { columns: 2, gap: "md", className: "docs-guide-grid" },
			children: ["registry-extensions", "components", "actions", "styling", "sync"],
		},
		"registry-extensions": {
			type: "Card",
			props: {
				title: "components.json discovery",
				description:
					"Configured shadcn namespaces can publish a matching JSON Render catalog and runtime registry.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["registry-extensions-link"],
		},
		"registry-extensions-link": {
			type: "Link",
			props: {
				label: "Registry extension protocol →",
				href: withBasePath("/docs/shadcn/registry-extensions"),
			},
		},
		components: {
			type: "Card",
			props: {
				title: "68 component keys",
				description:
					"Search the complete catalog and inspect native, portable, and JSON Render support per base.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["components-link"],
		},
		"components-link": {
			type: "Link",
			props: {
				label: "Explore components →",
				href: withBasePath("/docs/shadcn/components"),
			},
		},
		actions: {
			type: "Card",
			props: {
				title: "Events, not domain actions",
				description:
					"The catalog declares valid component events; consuming applications own business actions and handlers.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["actions-link"],
		},
		"actions-link": {
			type: "Link",
			props: {
				label: "Events and actions →",
				href: withBasePath("/docs/shadcn/actions"),
			},
		},
		styling: {
			type: "Card",
			props: {
				title: "Application-owned styling",
				description:
					"Use prebuilt Nova components or map adapters to the shadcn files already owned by an application.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["styling-link"],
		},
		"styling-link": {
			type: "Link",
			props: {
				label: "Styling modes →",
				href: withBasePath("/docs/shadcn/styling"),
			},
		},
		sync: {
			type: "Card",
			props: {
				title: "Auditable upstream sync",
				description:
					"Pinned provenance and content hashes track components, primitive bases, and eight styles.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
			children: ["sync-link"],
		},
		"sync-link": {
			type: "Link",
			props: {
				label: "Synchronization →",
				href: withBasePath("/docs/shadcn/synchronization"),
			},
		},
		contract: {
			type: "Card",
			props: {
				title: "One specification, selectable implementation",
				description:
					"The registry selector in the site header changes the primitive implementation used to render every JSON-driven page without changing its specification.",
				maxWidth: "full",
				centered: false,
				className: "docs-concept-card",
			},
		},
	},
} satisfies Spec;

export const registryExtensionsSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"live",
				"flow",
				"components-title",
				"components-code",
				"author-title",
				"author-copy",
				"author-code",
				"generate-title",
				"generate-code",
				"consume-code",
				"local-title",
				"local-copy",
				"local-code",
				"trust",
			],
		},
		badge: { type: "Badge", props: { text: "EXTENSION PROTOCOL · V1", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Registry extensions", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "components.json is the project source of truth. The resolver derives its primitive base and style, then discovers compatible JSON Render extensions from the shadcn namespaces already trusted by the application.",
				variant: "lead",
			},
		},
		live: {
			type: "Alert",
			props: {
				title: "This page is the integration test",
				message:
					"Every code block on this page comes from @jr-ext/code-block-composition-1. That local bridge installs the public @shadcnblocks composition without an Authorization header, then adds its JSON Render catalog and runtime adapter automatically.",
				type: "success",
			},
		},
		flow: {
			type: "Table",
			props: {
				caption: "Resolution order",
				columns: ["Layer", "Source", "Precedence"],
				rows: [
					["Packages", `${corePackageName} direct dependencies`, "Dependency order"],
					["Providers", "Configured shadcn registries", "components.json order"],
					["Installed items", "Local extension receipts", "Filename order"],
					["Application", "Local extension configuration", "Last; explicit overrides only"],
				],
			},
		},
		"components-title": {
			type: "Heading",
			props: { text: "Use the existing shadcn configuration", level: "h2" },
		},
		"components-code": {
			type: "CodeBlock",
			props: {
				label: "components.json",
				language: "json",
				code: `{
	"$schema": "https://ui.shadcn.com/schema.json",
	"style": "base-nova",
	"registries": {
		"@jr-ext": "${publicRegistryUrlTemplate}",
		"@shadcnblocks": "https://www.shadcnblocks.com/r/{name}.json"
	}
}`,
			},
		},
		"author-title": {
			type: "Heading",
			props: { text: "Publish a discovery provider", level: "h2" },
		},
		"author-copy": {
			type: "Text",
			props: {
				text: "A registry opts in by serving json-render-extended.json. The installed-items mode tells the generator to inspect only receipts left by components the user actually installed, so configuring a large registry never floods the AI catalog.",
				variant: "body",
			},
		},
		"author-code": {
			type: "CodeBlock",
			props: {
				label: "public/r/json-render-extended.json",
				language: "json",
				code: `{
	"$schema": "https://ui.shadcn.com/schema/registry-item.json",
	"name": "json-render-extended",
	"type": "registry:item",
	"meta": {
		"json-render-extended": {
			"protocol": "json-render-extended/v1",
			"mode": "installed-items"
		}
	}
}`,
			},
		},
		"generate-title": {
			type: "Heading",
			props: { text: "Generate a bundler-safe project module", level: "h2" },
		},
		"generate-code": {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-extended validate
pnpm exec json-render-extended generate --output lib/json-render-extended.generated.ts`,
			},
		},
		"consume-code": {
			type: "CodeBlock",
			props: {
				label: "lib/json-render.ts",
				language: "tsx",
				code: `import { defineCatalog } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import {
	actionDefinitions,
	actions,
	componentDefinitions,
	components,
} from "./json-render-extended.generated";

export const catalog = defineCatalog(schema, {
	components: componentDefinitions,
	actions: actionDefinitions,
});

export const { registry } = defineRegistry(catalog, { components, actions });`,
			},
		},
		"local-title": {
			type: "Heading",
			props: { text: "Install the local @jr-ext bridge", level: "h2" },
		},
		"local-copy": {
			type: "Text",
			props: {
				text: "Shadcnblocks does not publish JSON Render metadata, so @jr-ext composes its public item with an internal adapter. The adapter installs a catalog module, renderer, and receipt under lib/json-render-extended/manifests. Generation discovers that receipt without manual catalog flags.",
				variant: "body",
			},
		},
		"local-code": {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm --filter @json-render-extended/registry dev
pnpm exec shadcn add @jr-ext/code-block-composition-1 --cwd apps/docs
pnpm --filter @json-render-extended/docs registry:generate`,
			},
		},
		trust: {
			type: "Alert",
			props: {
				title: "Explicit trust, static execution",
				message:
					"Discovery only probes namespaces already configured in components.json and reads receipts from a fixed project-local directory. It never adds a registry, logs authentication values, or executes fetched code. The generated file contains static imports visible to TypeScript and the bundler.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const iconsOverviewSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"status",
				"architecture-title",
				"architecture",
				"discovery-title",
				"discovery",
				"direct-title",
				"direct",
				"preview-title",
				"preview",
				"shape-title",
				"shape",
				"metadata-title",
				"metadata",
				"retrieval-title",
				"retrieval",
				"manifest-title",
				"manifest",
				"packages",
			],
		},
		badge: { type: "Badge", props: { text: "PACKAGE FAMILY · AVAILABLE", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Icon registries", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: `${iconCorePackageName} defines one stable JSON Render Icon vocabulary. Icon-set adapters extend it with valid names, semantics, and renderers instead of asking AI to guess library-specific exports.`,
				variant: "lead",
			},
		},
		status: {
			type: "Alert",
			props: {
				title: "Five sets detected; Tabler selected",
				message:
					"The docs install Lucide, Tabler, Hugeicons, Phosphor, and Remix to exercise multi-set discovery. json-render-extended.config.ts explicitly selects Tabler; components.json remains an optional fallback.",
				type: "success",
			},
		},
		"architecture-title": {
			type: "Heading",
			props: { text: "A core contract, many icon-set adapters", level: "h2" },
		},
		architecture: {
			type: "CodeBlock",
			props: {
				label: "packages/json-render-icons-acme/src/index.ts",
				language: "ts",
				code: `import { defineIconSet } from "${iconCorePackageName}";

export const acmeIconSet = defineIconSet({
	id: "acme",
	version: "1.0.0",
	names: ["check", "close", "warning"] as const,
	exampleName: "check",
	semantics: {
		check: { aliases: ["done", "success"], intents: ["confirm"] },
	},
});

export const componentDefinitions = acmeIconSet.componentDefinitions;
export const searchIcons = acmeIconSet.search;`,
			},
		},
		"discovery-title": {
			type: "Heading",
			props: { text: "Reuse the icon library already installed", level: "h2" },
		},
		discovery: {
			type: "CodeBlock",
			props: {
				label: "package.json",
				language: "json",
				code: `{
	"dependencies": {
		"@json-render-extended/icons": "^0.1.0",
		"@hugeicons/core-free-icons": "^4.2.3",
		"@hugeicons/react": "^1.1.9",
		"@phosphor-icons/react": "^2.1.10",
		"@remixicon/react": "^4.9.0",
		"@tabler/icons-react": "^3.46.0",
		"lucide-react": "^1.28.0"
	}
}`,
			},
		},
		"direct-title": {
			type: "Heading",
			props: { text: "No components.json is required", level: "h2" },
		},
		direct: {
			type: "CodeBlock",
			props: {
				label: "lib/icons.ts",
				language: "ts",
				code: `import { defineCatalog } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import { tablerComponentDefinitions } from "${tablerIconPackageName}/catalog";
import { tablerComponents } from "${tablerIconPackageName}/react";

export const catalog = defineCatalog(schema, {
	components: tablerComponentDefinitions,
	actions: {},
});

export const { registry } = defineRegistry(catalog, {
	components: tablerComponents,
});`,
			},
		},
		"preview-title": {
			type: "Heading",
			props: { text: "Rendered through JSON Render", level: "h2" },
		},
		preview: {
			type: "Stack",
			props: {
				direction: "horizontal",
				gap: "lg",
				align: "center",
				justify: "center",
				className: "docs-icon-preview",
			},
			children: [
				"preview-success",
				"preview-payment",
				"preview-search",
				"preview-settings",
				"preview-alert",
				"preview-user",
			],
		},
		"preview-success": {
			type: "Icon",
			props: { name: "circle-check", label: "Completed", size: "xl" },
		},
		"preview-payment": {
			type: "Icon",
			props: { name: "credit-card", label: "Payment", size: "xl" },
		},
		"preview-search": {
			type: "Icon",
			props: { name: "search", label: "Search", size: "xl" },
		},
		"preview-settings": {
			type: "Icon",
			props: { name: "settings", label: "Settings", size: "xl" },
		},
		"preview-alert": {
			type: "Icon",
			props: { name: "alert-circle", label: "Warning", size: "xl" },
		},
		"preview-user": {
			type: "Icon",
			props: { name: "user", label: "User", size: "xl" },
		},
		"shape-title": { type: "Heading", props: { text: "One Icon component", level: "h2" } },
		shape: {
			type: "CodeBlock",
			props: {
				label: "spec.json",
				language: "json",
				code: `{
\t"type": "Icon",
\t"props": {
\t\t"name": "circle-check",
\t\t"label": "Completed",
\t\t"size": "md",
\t\t"decorative": false
\t}
}`,
			},
		},
		"metadata-title": {
			type: "Heading",
			props: { text: "Metadata makes selection useful to AI", level: "h2" },
		},
		metadata: {
			type: "Table",
			props: {
				caption: "Generated metadata for the selected Tabler set",
				columns: ["Field", "Purpose"],
				rows: [
					["name", "A valid identifier exported by the selected icon set"],
					["intents", "Semantic tags such as success, billing, navigation, or warning"],
					["aliases", "Natural-language alternatives used during retrieval"],
					["categories", "A browsable, filterable grouping"],
					["accessibility", "Decorative defaults and meaningful-label guidance"],
				],
			},
		},
		"retrieval-title": {
			type: "Heading",
			props: { text: "Give AI a shortlist, not every export", level: "h2" },
		},
		retrieval: {
			type: "CodeBlock",
			props: {
				label: "lib/icon-catalog.ts",
				language: "ts",
				code: `import {
	createTablerComponentDefinitions,
	searchTablerIcons,
} from "${tablerIconPackageName}";

const matches = searchTablerIcons("payment completed", { limit: 12 });

export const iconDefinitions = createTablerComponentDefinitions(
	matches.map((match) => match.name),
);`,
			},
		},
		"manifest-title": {
			type: "Heading",
			props: { text: "Icon-set packages can opt in themselves", level: "h2" },
		},
		manifest: {
			type: "CodeBlock",
			props: {
				label: "@acme/icons/package.json",
				language: "json",
				code: `{
	"name": "@acme/icons",
	"json-render-extended": {
		"iconSet": {
			"protocol": "json-render-icons/v1",
			"name": "acme",
			"catalog": {
				"module": "@acme/icons/json-render/catalog",
				"export": "componentDefinitions"
			},
			"registries": {
				"react": {
					"module": "@acme/icons/json-render/react",
					"export": "components"
				}
			}
		}
	}
}`,
			},
		},
		packages: {
			type: "Card",
			props: {
				title: `${iconCorePackageName} → five built-ins or an ecosystem package`,
				description:
					"The root entry owns the lightweight shared contract and detector. Built-in adapters are isolated behind subpath exports; external icon packages can self-describe the same catalog and renderer protocol.",
				maxWidth: "full",
				centered: false,
				className: "docs-concept-card",
			},
		},
	},
} satisfies Spec;

export const iconsInstallationSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"core-title",
				"core-install",
				"library-title",
				"library-install",
				"setup-title",
				"setup",
				"ownership",
			],
		},
		badge: {
			type: "Badge",
			props: { text: "ICON PACKAGE · GETTING STARTED", variant: "secondary" },
		},
		title: { type: "Heading", props: { text: "Installation", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: `${iconCorePackageName} supplies the JSON Render contract and discovery tooling. The visual icon library remains an application dependency, so existing projects do not receive a duplicate copy.`,
				variant: "lead",
			},
		},
		"core-title": { type: "Heading", props: { text: "Add the JSON Render layer", level: "h2" } },
		"core-install": {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm add ${iconCorePackageName} @json-render/core @json-render/react zod`,
			},
		},
		"library-title": {
			type: "Heading",
			props: { text: "Keep or choose the visual library", level: "h2" },
		},
		"library-install": {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `# Install only the visual library the application uses
pnpm add lucide-react
pnpm add @tabler/icons-react
pnpm add @hugeicons/react @hugeicons/core-free-icons
pnpm add @phosphor-icons/react
pnpm add @remixicon/react`,
			},
		},
		"setup-title": {
			type: "Heading",
			props: { text: "Create the catalog and registry", level: "h2" },
		},
		setup: {
			type: "CodeBlock",
			props: {
				label: "lib/icons.ts",
				language: "ts",
				code: `import { defineCatalog } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import { tablerComponentDefinitions } from "${tablerIconPackageName}/catalog";
import { tablerComponents } from "${tablerIconPackageName}/react";

export const iconCatalog = defineCatalog(schema, {
	components: tablerComponentDefinitions,
	actions: {},
});

export const { registry: iconRegistry } = defineRegistry(iconCatalog, {
	components: tablerComponents,
});`,
			},
		},
		ownership: {
			type: "Alert",
			props: {
				title: "The core package does not install an icon library",
				message:
					"Lucide, Tabler, Hugeicons, Phosphor, and Remix are optional peers with built-in adapters. Other libraries can publish the same protocol without becoming dependencies of the core.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const iconSetsSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"layers",
				"lucide-title",
				"lucide",
				"config-title",
				"config",
				"selection-title",
				"selection",
				"contract",
			],
		},
		badge: { type: "Badge", props: { text: "ICON PACKAGE · ADAPTERS", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Icon sets", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "Every adapter shares one Icon component contract while keeping its own valid names, renderer, licensing, versioning, and semantic metadata.",
				variant: "lead",
			},
		},
		layers: {
			type: "Table",
			props: {
				caption: "Package layers",
				columns: ["Layer", "Responsibility", "Availability"],
				rows: [
					[
						iconCorePackageName,
						"Stable Icon schema, metadata, retrieval, and discovery",
						"Available",
					],
					[
						`${lucideIconPackageName}/*`,
						"Lucide names, catalog, metadata, and React renderer",
						"Available",
					],
					[
						`${tablerIconPackageName}/*`,
						"Tabler catalog, metadata, and React renderer",
						"Available",
					],
					[
						`${hugeiconsIconPackageName}/*`,
						"Hugeicons free catalog, metadata, and React renderer",
						"Available",
					],
					[
						`${phosphorIconPackageName}/*`,
						"Phosphor catalog, metadata, and React renderer",
						"Available",
					],
					[`${remixIconPackageName}/*`, "Remix catalog, metadata, and React renderer", "Available"],
					[
						"Ecosystem packages",
						"Self-described third-party catalogs and renderers",
						"Open protocol",
					],
				],
			},
		},
		"lucide-title": { type: "Heading", props: { text: "Built-in adapters", level: "h2" } },
		lucide: {
			type: "Table",
			props: {
				caption: "Detection names and application packages",
				columns: ["Selection", "Detected dependency"],
				rows: [
					["lucide", "lucide-react"],
					["tabler", "@tabler/icons-react"],
					["hugeicons", "@hugeicons/react + @hugeicons/core-free-icons"],
					["phosphor", "@phosphor-icons/react"],
					["remix", "@remixicon/react"],
				],
			},
		},
		"config-title": {
			type: "Heading",
			props: { text: "Select one when more than one is installed", level: "h2" },
		},
		config: {
			type: "CodeBlock",
			props: {
				label: "json-render-extended.config.ts",
				language: "ts",
				code: `import { defineConfig } from "${corePackageName}";

export default defineConfig({
	adapterOptions: {
		"${iconCorePackageName}": {
			iconSet: "tabler",
		},
	},
});`,
			},
		},
		"selection-title": {
			type: "Heading",
			props: { text: "Give AI an intent-scoped vocabulary", level: "h2" },
		},
		selection: {
			type: "Table",
			props: {
				caption: "Semantic selection inputs",
				columns: ["Field", "Use"],
				rows: [
					["intents", "Product meaning such as confirm, billing, navigation, or warning"],
					["aliases", "Natural-language alternatives used during retrieval"],
					["categories", "Browsable groupings supplied by the icon set"],
					["name", "A validated export from the installed library version"],
				],
			},
		},
		contract: {
			type: "Alert",
			props: {
				title: "Interchangeable at the JSON boundary",
				message:
					"Applications render the same Icon props. Set-specific names remain deliberately distinct because different libraries do not expose an identical visual vocabulary.",
				type: "info",
			},
		},
	},
} satisfies Spec;

export const iconsDiscoverySpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"source-title",
				"source",
				"preference-title",
				"preference",
				"detect-title",
				"detect",
				"results",
				"components-json",
			],
		},
		badge: { type: "Badge", props: { text: "ICON PACKAGE · DISCOVERY", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Project discovery", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "The detector reads the nearest package.json and selects a built-in or self-describing icon-set adapter from dependencies already chosen by the application.",
				variant: "lead",
			},
		},
		"source-title": {
			type: "Heading",
			props: { text: "The package manifest is the source", level: "h2" },
		},
		source: {
			type: "CodeBlock",
			props: {
				label: "package.json",
				language: "json",
				code: `{
	"dependencies": {
		"${iconCorePackageName}": "^0.1.0",
		"@phosphor-icons/react": "^2.1.10",
		"@tabler/icons-react": "^3.46.0",
		"lucide-react": "^1.28.0"
	}
}`,
			},
		},
		"preference-title": {
			type: "Heading",
			props: { text: "Resolve multiple installed sets explicitly", level: "h2" },
		},
		preference: {
			type: "CodeBlock",
			props: {
				label: "json-render-extended.config.ts",
				language: "ts",
				code: `import { defineConfig } from "${corePackageName}";

export default defineConfig({
	adapterOptions: {
		"${iconCorePackageName}": { iconSet: "tabler" },
	},
});`,
			},
		},
		"detect-title": {
			type: "Heading",
			props: { text: "Inspect without modifying the project", level: "h2" },
		},
		detect: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-icons detect
pnpm exec json-render-icons detect --json
pnpm exec json-render-icons detect --icon-set tabler`,
			},
		},
		results: {
			type: "Table",
			props: {
				caption: "Discovery outcomes",
				columns: ["Status", "Meaning"],
				rows: [
					["detected", "One matching adapter, or the explicitly selected adapter, is ready"],
					["ambiguous", "More than one supported set is installed; select one by name"],
					["not-found", "No built-in or self-described dependency is available"],
					["missing-package-json", "The starting directory has no package manifest above it"],
				],
			},
		},
		"components-json": {
			type: "Alert",
			props: {
				title: "components.json is intentionally optional",
				message:
					"That file describes shadcn and can provide iconLibrary as a fallback. Generic adapterOptions win; otherwise one detected package is automatic, while multiple candidates require an explicit choice. Discovery never changes dependencies.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const iconsAuthoringSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"definition-title",
				"definition",
				"manifest-title",
				"manifest",
				"requirements",
				"ecosystem",
			],
		},
		badge: { type: "Badge", props: { text: "ICON PACKAGE · ECOSYSTEM", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Authoring an icon set", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "An icon library can publish its own JSON Render catalog and renderer. The core discovers it through a small versioned manifest, without requiring a release of JSON Render Extended.",
				variant: "lead",
			},
		},
		"definition-title": {
			type: "Heading",
			props: { text: "Define names and semantics", level: "h2" },
		},
		definition: {
			type: "CodeBlock",
			props: {
				label: "src/json-render/icon-set.ts",
				language: "ts",
				code: `import { defineIconSet } from "${iconCorePackageName}";

export const acmeIconSet = defineIconSet({
	id: "acme",
	version: "1.0.0",
	names: ["check", "close", "warning"] as const,
	exampleName: "check",
	semantics: {
		check: { aliases: ["done", "success"], intents: ["confirm"] },
	},
});

export const componentDefinitions = acmeIconSet.componentDefinitions;
export const searchIcons = acmeIconSet.search;`,
			},
		},
		"manifest-title": {
			type: "Heading",
			props: { text: "Publish the adapter manifest", level: "h2" },
		},
		manifest: {
			type: "CodeBlock",
			props: {
				label: "package.json",
				language: "json",
				code: `{
	"json-render-extended": {
		"iconSet": {
			"protocol": "json-render-icons/v1",
			"name": "acme",
			"catalog": {
				"module": "@acme/icons/json-render/catalog",
				"export": "componentDefinitions"
			},
			"registries": {
				"react": {
					"module": "@acme/icons/json-render/react",
					"export": "components"
				}
			}
		}
	}
}`,
			},
		},
		requirements: {
			type: "Table",
			props: {
				caption: "Adapter publishing contract",
				columns: ["Surface", "Requirement"],
				rows: [
					["Catalog", "Export JSON Render Icon component definitions with validated names"],
					["React registry", "Export the matching component renderer map"],
					["Manifest", "Declare protocol json-render-icons/v1 and resolvable module exports"],
					["Metadata", "Provide aliases and intents that improve semantic retrieval"],
				],
			},
		},
		ecosystem: {
			type: "Alert",
			props: {
				title: "The icon library can own the integration",
				message:
					"A separate adapter package is still valid, but an icon library may expose these subpaths and metadata itself so installation and version alignment stay with its maintainers.",
				type: "info",
			},
		},
	},
} satisfies Spec;

export const installationSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"install-title",
				"install-code",
				"catalog-title",
				"catalog-code",
				"render-title",
				"render-code",
				"styles",
			],
		},
		badge: { type: "Badge", props: { text: "GETTING STARTED", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Installation", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "Install the registry package with JSON Render and the React peers required by your application.",
				variant: "lead",
			},
		},
		"install-title": { type: "Heading", props: { text: "Add dependencies", level: "h2" } },
		"install-code": {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm add ${packageName} @json-render/core @json-render/react zod`,
			},
		},
		"catalog-title": { type: "Heading", props: { text: "Define one catalog", level: "h2" } },
		"catalog-code": {
			type: "CodeBlock",
			props: {
				label: "lib/catalog.ts",
				language: "tsx",
				code: `import { shadcnComponentDefinitions } from "${packageName}/catalog";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

export const catalog = defineCatalog(schema, {
\tcomponents: shadcnComponentDefinitions,
\tactions: {},
});`,
			},
		},
		"render-title": {
			type: "Heading",
			props: { text: "Select a registry at runtime", level: "h2" },
		},
		"render-code": {
			type: "CodeBlock",
			props: {
				label: "components/json-view.tsx",
				language: "tsx",
				code: `"use client";

import { baseUiComponents } from "${packageName}/base-ui";
import { radixComponents } from "${packageName}/radix";
import { reactAriaComponents } from "${packageName}/react-aria";
import { JSONUIProvider, Renderer, defineRegistry } from "@json-render/react";

const components = {
\t"base-ui": baseUiComponents,
\t"react-aria": reactAriaComponents,
\tradix: radixComponents,
};

export function JsonView({ base, spec }) {
\tconst registry = defineRegistry(catalog, { components: components[base] }).registry;
\treturn (
\t\t<JSONUIProvider registry={registry} initialState={{}}>
\t\t\t<Renderer spec={spec} registry={registry} />
\t\t</JSONUIProvider>
\t);
}`,
			},
		},
		styles: {
			type: "Alert",
			props: {
				title: "Import the Tailwind integration",
				message:
					"The package Tailwind entry point registers its compiled component output without exposing monorepo or node_modules paths to the application.",
				type: "warning",
			},
		},
	},
} satisfies Spec;

export const stylingSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"modes",
				"local-title",
				"local-copy",
				"local-code",
				"css-title",
				"css-code",
				"principle",
			],
		},
		badge: { type: "Badge", props: { text: "THEMING", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Styling and local components", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "Use the synchronized prebuilt output for a fast start, or keep the exact styles already owned by your application.",
				variant: "lead",
			},
		},
		modes: {
			type: "Grid",
			props: { columns: 2, gap: "md", className: "docs-guide-grid" },
			children: ["prebuilt", "local"],
		},
		prebuilt: {
			type: "Card",
			props: {
				title: "Prebuilt Nova",
				description:
					"Import a ready registry. No global stylesheet is injected, so your token layer remains in control.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
		},
		local: {
			type: "Card",
			props: {
				title: "Local primitives",
				description:
					"Map the adapters to component files generated in your own project. Variants, tokens, and edits stay local.",
				maxWidth: "full",
				centered: false,
				className: "docs-guide-card",
			},
		},
		"local-title": {
			type: "Heading",
			props: { text: "Create a registry from local primitives", level: "h2" },
		},
		"local-copy": {
			type: "Text",
			props: {
				text: "Each primitive remains in its own component file. The factory only maps those exports to JSON Render semantic adapters.",
				variant: "body",
			},
		},
		"local-code": {
			type: "CodeBlock",
			props: {
				label: "lib/registry.ts",
				language: "tsx",
				code: `import { createShadcnComponents } from "${packageName}/create-registry";
import * as accordion from "@/components/ui/accordion";
import * as button from "@/components/ui/button";
import * as card from "@/components/ui/card";

export const localComponents = createShadcnComponents(
\t{ accordion, button, card },
\t{ base: "base-ui" },
);`,
			},
		},
		"css-title": { type: "Heading", props: { text: "Tailwind setup", level: "h2" } },
		"css-code": {
			type: "CodeBlock",
			props: {
				label: "app/globals.css",
				language: "css",
				code: `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "${packageName}/tailwind.css";`,
			},
		},
		principle: {
			type: "Alert",
			props: {
				title: "Style ownership stays with the application",
				message:
					"The package supplies adapters and synchronized source knowledge. CSS variables, fonts, tokens, and local primitive files remain application concerns.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const synchronizationSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"scope",
				"commands-title",
				"commands",
				"fallback-title",
				"fallbacks",
				"quality",
			],
		},
		badge: { type: "Badge", props: { text: "MAINTENANCE", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Synchronization", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "The repository treats shadcn as an upstream source with explicit provenance, generated capabilities, and drift checks.",
				variant: "lead",
			},
		},
		scope: {
			type: "Table",
			props: {
				caption: "Synchronized upstream surface",
				columns: ["Surface", "Tracked data", "Purpose"],
				rows: [
					["Components", "Source item names and hashes", "Detect additions and source drift"],
					["Bases", "Base UI, React Aria, Radix", "Expose the real support matrix"],
					["Styles", "Eight shadcn style names", "Keep generation options aligned"],
					["Provenance", "Pinned upstream commit", "Make updates reproducible"],
				],
			},
		},
		"commands-title": { type: "Heading", props: { text: "Check or update", level: "h2" } },
		commands: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm sync:check -- --source /path/to/shadcn
pnpm sync:shadcn -- --source /path/to/shadcn`,
			},
		},
		"fallback-title": {
			type: "Heading",
			props: { text: "Fallbacks are part of the contract", level: "h2" },
		},
		fallbacks: {
			type: "Table",
			props: {
				caption: "Portable adapters used when the upstream base has no source item",
				columns: ["Base", "Fallback keys"],
				rows: [
					["Base UI", "Toast"],
					["React Aria", "HoverCard, Menubar, NavigationMenu, Toast"],
					["Radix", "Toast"],
				],
			},
		},
		quality: {
			type: "Alert",
			props: {
				title: "Drift fails visibly",
				message:
					"Biome, type checks, package tests, application builds, and the upstream sync check are all part of the repository validation path.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const componentsIntroSpec = {
	root: "intro",
	elements: {
		intro: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec docs-components-intro",
			},
			children: ["badge", "title", "lead", "legend"],
		},
		badge: { type: "Badge", props: { text: "CATALOG", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Components", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "All 68 semantic keys are callable from every React registry. Search the catalog and inspect how each key is supplied for every primitive base.",
				variant: "lead",
			},
		},
		legend: {
			type: "Alert",
			props: {
				title: "Native, portable, or JSON Render",
				message:
					"Native means a synchronized shadcn source exists for that base. Portable marks an explicit cross-base fallback. JSON Render identifies layout and content semantics supplied by the extension.",
				type: "info",
			},
		},
	},
} satisfies Spec;

export const actionsSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"boundary",
				"events-title",
				"events",
				"actions-title",
				"actions-copy",
				"actions-code",
				"binding-title",
				"binding-code",
				"note",
			],
		},
		badge: { type: "Badge", props: { text: "INTERACTIONS", variant: "secondary" } },
		title: { type: "Heading", props: { text: "Events and actions", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "The shadcn extension defines what a component can emit. Your application defines what should happen next.",
				variant: "lead",
			},
		},
		boundary: {
			type: "Table",
			props: {
				caption: "Responsibility boundary",
				columns: ["Concept", "Owned by", "Examples"],
				rows: [
					["Events", "Component catalog", "press, change, submit, confirm"],
					["Actions", "Consuming application", "saveDocument, deleteUser, generateReport"],
					["Built-ins", "JSON Render / Next adapter", "setState, validateForm, navigate"],
				],
			},
		},
		"events-title": { type: "Heading", props: { text: "Component events", level: "h2" } },
		events: {
			type: "Text",
			props: {
				text: "Definitions such as Button.press, Select.change, Form.submit, and AlertDialog.confirm are included in shadcnComponentDefinitions. They give AI a constrained list of valid interaction points.",
				variant: "body",
			},
		},
		"actions-title": { type: "Heading", props: { text: "Application actions", level: "h2" } },
		"actions-copy": {
			type: "Text",
			props: {
				text: "Extend the catalog with domain actions. Keeping them outside the UI package avoids coupling a portable registry to one product workflow.",
				variant: "body",
			},
		},
		"actions-code": {
			type: "CodeBlock",
			props: {
				label: "lib/catalog.ts",
				language: "tsx",
				code: `export const catalog = defineCatalog(schema, {
\tcomponents: shadcnComponentDefinitions,
\tactions: {
\t\tsaveDocument: {
\t\t\tdescription: "Persist the current document",
\t\t},
\t},
});`,
			},
		},
		"binding-title": { type: "Heading", props: { text: "Bind an event", level: "h2" } },
		"binding-code": {
			type: "CodeBlock",
			props: {
				label: "spec.json",
				language: "json",
				code: `{
\t"type": "Button",
\t"props": { "label": "Save", "variant": "primary", "disabled": false },
\t"on": {
\t\t"press": [{ "action": "saveDocument" }]
\t}
}`,
			},
		},
		note: {
			type: "Alert",
			props: {
				title: "No hidden domain behavior",
				message:
					"The published shadcn package ships no product-specific actions. Consumers register handlers through defineRegistry; @json-render/next additionally supplies client navigation.",
				type: "info",
			},
		},
	},
} satisfies Spec;

export const playgroundOverviewSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"roles",
				"start-title",
				"start",
				"materialize-title",
				"materialize",
				"verify",
				"resolve-title",
				"resolve",
				"boundary",
			],
		},
		badge: {
			type: "Badge",
			props: { text: "PLAYGROUND PACKAGE · AUTHORING", variant: "secondary" },
		},
		title: { type: "Heading", props: { text: "A shared UI authoring loop", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: `${playgroundPackageName} gives an agent and a user one revisioned session over versioned JSON specs. Installed extensions contribute presets, live registries, and consumer-owned code generation.`,
				variant: "lead",
			},
		},
		roles: {
			type: "Table",
			props: {
				caption: "Authoring responsibilities",
				columns: ["Layer", "Responsibility"],
				rows: [
					["Repository", "Own valid specs inside the target application or package"],
					["Extension", "Provide presets, a package runtime, and target-aware code generation"],
					["Playground", "Coordinate sessions, revisions, persistence, preview, and API access"],
					["Agent", "Iterate through the API and use a browser only for visual verification"],
				],
			},
		},
		"start-title": { type: "Heading", props: { text: "Start a package target", level: "h2" } },
		start: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-playground \\
	--project apps/web \\
	--spec checkout/summary`,
			},
		},
		"materialize-title": {
			type: "Heading",
			props: { text: "Keep generated components linked", level: "h2" },
		},
		materialize: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-playground materialize \\
	--project apps/web \\
	--spec checkout/summary \\
	--output components/generated/checkout-summary.tsx`,
			},
		},
		verify: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-playground check --project apps/web`,
			},
		},
		"resolve-title": {
			type: "Heading",
			props: { text: "Resolve each spec for production", level: "h2" },
		},
		resolve: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-playground build \
	--project apps/web \
	--output json-render/specs.ts`,
			},
		},
		boundary: {
			type: "Alert",
			props: {
				title: "A narrow production runtime",
				message:
					"The authoring server and editor stay outside production bundles. Only the runtime spec resolver is imported; its optional launcher renders nothing outside development. Generated shadcn code still targets the consuming application's aliases and installed icon library.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const playgroundStorageSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: ["badge", "title", "lead", "tree", "rules", "publish"],
		},
		badge: {
			type: "Badge",
			props: { text: "PLAYGROUND PACKAGE · STORAGE", variant: "secondary" },
		},
		title: { type: "Heading", props: { text: "Specs stay with their owner", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "A single application stores specs at its root. A monorepo stores them inside each selected app or package, so ownership, review, tests, and release boundaries remain clear.",
				variant: "lead",
			},
		},
		tree: {
			type: "CodeBlock",
			props: {
				label: "Repository",
				language: "text",
				code: `apps/
	web/
		json-render/specs/
			checkout/summary.json
packages/
	account-ui/
		json-render/specs/
			profile/card.json`,
			},
		},
		rules: {
			type: "Table",
			props: {
				caption: "Persistence rules",
				columns: ["State", "Repository behavior", "Preview behavior"],
				rows: [
					[
						"Valid JSON",
						"Atomically writes the target .json file",
						"Renders and regenerates TypeScript",
					],
					["Invalid JSON", "Does not touch the file", "Keeps the last valid render and code"],
					[
						"Revision conflict",
						"Does not overwrite newer work",
						"Returns the current session state",
					],
				],
			},
		},
		publish: {
			type: "Alert",
			props: {
				title: "Publishing remains explicit",
				message:
					"A publishable extension may keep demo and test specs in its package. They enter the npm tarball only when that package includes them in its files field.",
				type: "info",
			},
		},
	},
} satisfies Spec;

export const playgroundIntegrationsSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: [
				"badge",
				"title",
				"lead",
				"modes",
				"dynamic-title",
				"dynamic",
				"runtime-title",
				"runtime-demo",
				"next-title",
				"next",
				"svelte-title",
				"svelte",
				"safe",
			],
		},
		badge: {
			type: "Badge",
			props: { text: "PLAYGROUND PACKAGE · FRAMEWORKS", variant: "secondary" },
		},
		title: { type: "Heading", props: { text: "Point an application at one spec", level: "h1" } },
		lead: {
			type: "Text",
			props: {
				text: "One stable component reference can render repository JSON at runtime or import a build-time materialization. A matching receipt selects the static component; specs without one remain interpreted by JSON Render.",
				variant: "lead",
			},
		},
		modes: {
			type: "Table",
			props: {
				caption: "Per-spec production resolution",
				columns: ["Spec state", "Production behavior"],
				rows: [
					["No receipt", "Embed the JSON spec and render it through the application registry"],
					["Current receipt", "Import and render the materialized application component"],
					["Stale or missing output", "Fall back to runtime JSON and report a build diagnostic"],
				],
			},
		},
		"dynamic-title": {
			type: "Heading",
			props: { text: "Declare public props in the spec", level: "h2" },
		},
		dynamic: {
			type: "CodeBlock",
			props: {
				label: "json-render/specs/checkout/summary.json",
				language: "json",
				code: `{
	"state": {
		"props": { "title": "Order summary" }
	},
	"elements": {
		"title": {
			"type": "Heading",
			"props": { "text": { "$state": "/props/title" }, "level": "h2" }
		}
	}
}`,
			},
		},
		"runtime-title": {
			type: "Heading",
			props: { text: "Runtime mode uses the same props", level: "h2" },
		},
		"runtime-demo": {
			type: "SpecReferenceDemo",
			props: {
				spec: "docs/runtime-notice",
				title: "Props override a runtime spec",
				message:
					"The same call site will pass these values to a materialized component after this spec is opted into materialization.",
			},
		},
		"next-title": { type: "Heading", props: { text: "Next.js or React", level: "h2" } },
		next: {
			type: "CodeBlock",
			props: {
				label: "components/checkout-summary.tsx",
				language: "tsx",
				code: `import { JsonRenderSpec } from "${playgroundPackageName}/runtime";
import { jsonRenderSpecs } from "@/json-render/specs";
import { registry } from "@/lib/json-render";

export function CheckoutSummary({ title }: { title: string }) {
	return (
		<JsonRenderSpec
			entries={jsonRenderSpecs}
			registry={registry}
			spec="checkout/summary"
			props={{ title }}
			playground={{
				href: process.env.NEXT_PUBLIC_JSON_RENDER_PLAYGROUND_URL,
				position: "bottom-right",
			}}
		/>
	);
}`,
			},
		},
		"svelte-title": { type: "Heading", props: { text: "Svelte", level: "h2" } },
		svelte: {
			type: "CodeBlock",
			props: {
				label: "+layout.svelte",
				language: "svelte",
				code: `<script lang="ts">
	import JsonRenderPlaygroundLink from "${playgroundPackageName}/svelte";
</script>

<JsonRenderPlaygroundLink
	href={PUBLIC_JSON_RENDER_PLAYGROUND_URL}
	position="bottom-right"
	spec="checkout/summary"
/>`,
			},
		},
		safe: {
			type: "Alert",
			props: {
				title: "Only the launcher is development-only",
				message:
					"JsonRenderSpec remains in production and selects runtime or materialized mode. Its optional playground launcher disappears outside development. Never commit an ephemeral session token.",
				type: "success",
			},
		},
	},
} satisfies Spec;

export const playgroundAgentApiSpec = {
	root: "page",
	elements: {
		page: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "xl",
				align: "stretch",
				justify: "start",
				className: "docs-content-spec",
			},
			children: ["badge", "title", "lead", "start", "api", "update-title", "update", "workflow"],
		},
		badge: {
			type: "Badge",
			props: { text: "PLAYGROUND PACKAGE · AGENT API", variant: "secondary" },
		},
		title: {
			type: "Heading",
			props: { text: "Agents edit state, browsers show results", level: "h1" },
		},
		lead: {
			type: "Text",
			props: {
				text: "The CLI emits a machine-readable ready event. An agent updates the revisioned session through HTTP and opens the same local URL for user feedback in an available or requested browser.",
				variant: "lead",
			},
		},
		start: {
			type: "CodeBlock",
			props: {
				label: "Terminal",
				language: "shell",
				code: `pnpm exec json-render-playground \\
	--project apps/web \\
	--spec checkout/summary \\
	--json`,
			},
		},
		api: {
			type: "Table",
			props: {
				caption: "Local session endpoints",
				columns: ["Method", "Path", "Purpose"],
				rows: [
					["GET", "/api/session", "Read source, revision, render spec, and generated code"],
					["PUT", "/api/session", "Submit full source with the expected revision"],
					["POST", "/api/session/open", "Switch to an existing repository spec"],
					["POST", "/api/session/specs", "Create a repository spec from a provider preset"],
					["GET", "/api/session/events", "Receive user and agent changes over server-sent events"],
				],
			},
		},
		"update-title": {
			type: "Heading",
			props: { text: "Update with optimistic concurrency", level: "h2" },
		},
		update: {
			type: "CodeBlock",
			props: {
				label: "request.json",
				language: "json",
				code: `{
	"source": "{\\n\\t\\"root\\": \\"surface\\",\\n\\t\\"elements\\": {}\\n}\\n",
	"revision": 3
}`,
			},
		},
		workflow: {
			type: "Alert",
			props: {
				title: "The API is the editing surface",
				message:
					"Agents should not drive the textarea when the API is available. A 409 response returns the latest state so changes can be reconciled instead of overwritten.",
				type: "info",
			},
		},
	},
} satisfies Spec;
