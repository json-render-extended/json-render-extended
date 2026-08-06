export const exampleSpec = {
	root: "overview",
	elements: {
		overview: {
			type: "Card",
			props: {
				title: "Registry parity",
				description: "This tree is unchanged while the shadcn base switches.",
				maxWidth: "full",
				centered: false,
				className: null,
			},
			children: ["intro", "divider", "cards", "upstream", "action"],
		},
		intro: {
			type: "Text",
			props: {
				text: "Base UI, React Aria and Radix render the same catalog contract.",
				variant: "lead",
			},
		},
		divider: {
			type: "Separator",
			props: { orientation: "horizontal" },
		},
		cards: {
			type: "Grid",
			props: { columns: 3, gap: "md", className: null },
			children: ["base", "aria", "radix"],
		},
		base: {
			type: "Card",
			props: {
				title: "Base UI",
				description: "The current shadcn default.",
				maxWidth: "full",
				centered: false,
				className: null,
			},
			children: ["base-badge"],
		},
		"base-badge": {
			type: "Badge",
			props: { text: "base", variant: "default" },
		},
		aria: {
			type: "Card",
			props: {
				title: "React Aria",
				description: "Adobe's accessible collection primitives.",
				maxWidth: "full",
				centered: false,
				className: null,
			},
			children: ["aria-badge"],
		},
		"aria-badge": {
			type: "Badge",
			props: { text: "aria", variant: "secondary" },
		},
		radix: {
			type: "Card",
			props: {
				title: "Radix UI",
				description: "The original shadcn primitive base.",
				maxWidth: "full",
				centered: false,
				className: null,
			},
			children: ["radix-badge"],
		},
		"radix-badge": {
			type: "Badge",
			props: { text: "radix", variant: "outline" },
		},
		upstream: {
			type: "Card",
			props: {
				title: "Extended shadcn registry",
				description: "These components are outside the original 36-component JSON Render catalog.",
				maxWidth: "full",
				centered: false,
				className: null,
			},
			children: ["breadcrumbs", "message", "shortcut", "country"],
		},
		breadcrumbs: {
			type: "Breadcrumb",
			props: {
				items: [
					{ label: "Home", href: "/" },
					{ label: "Registry", href: "/registry", active: true },
				],
			},
		},
		message: {
			type: "Message",
			props: {
				content: "All synchronized shadcn source items now have a JSON Render key.",
				role: "assistant",
				author: "Registry",
			},
		},
		shortcut: {
			type: "Kbd",
			props: { keys: ["⌘", "K"] },
		},
		country: {
			type: "NativeSelect",
			props: {
				label: "Primitive base",
				placeholder: "Choose a base",
				options: [
					{ label: "Base UI", value: "base-ui" },
					{ label: "React Aria", value: "react-aria" },
					{ label: "Radix", value: "radix" },
				],
			},
		},
		action: {
			type: "Button",
			props: { label: "Same press event", variant: "secondary", disabled: false },
		},
	},
};
