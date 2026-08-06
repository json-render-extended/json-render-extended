import type { Spec } from "@json-render/core";

export const exampleSpec = {
	root: "overview",
	elements: {
		overview: {
			type: "Card",
			props: {
				title: "Svelte registry",
				description: "The same JSON Render contract with native Svelte components.",
				maxWidth: "full",
				centered: false,
				className: null,
			},
			children: ["intro", "divider", "cards", "action"],
		},
		intro: {
			type: "Text",
			props: {
				text: "Specs stay portable even when renderer implementations differ.",
				variant: "lead",
			},
		},
		divider: { type: "Separator", props: { orientation: "horizontal" } },
		cards: {
			type: "Grid",
			props: { columns: 2, gap: "md", className: null },
			children: ["contract", "renderer"],
		},
		contract: {
			type: "Alert",
			props: { title: "Shared catalog", message: "The schemas are aligned.", type: "success" },
		},
		renderer: {
			type: "Alert",
			props: { title: "Native runtime", message: "No React bridge is involved.", type: "info" },
		},
		action: {
			type: "Button",
			props: { label: "Svelte action", variant: "secondary", disabled: false },
		},
	},
} satisfies Spec;
