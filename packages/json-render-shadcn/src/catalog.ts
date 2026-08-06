import {
	type ComponentDefinition,
	shadcnComponentDefinitions as officialShadcnComponentDefinitions,
} from "@json-render/shadcn/catalog";
import { z } from "zod";

const nullableString = z.string().nullable().optional();
const className = z.string().nullable().optional();
const menuItem = z.object({
	label: z.string(),
	value: z.string(),
	disabled: z.boolean().optional(),
	shortcut: z.string().optional(),
});
const navigationItem = z.object({
	label: z.string(),
	href: z.string(),
	description: z.string().optional(),
	active: z.boolean().optional(),
});
const selectOption = z.object({
	label: z.string(),
	value: z.string(),
	disabled: z.boolean().optional(),
});

export const additionalShadcnComponentDefinitions = {
	AlertDialog: {
		props: z.object({
			triggerLabel: z.string(),
			title: z.string(),
			description: nullableString,
			actionLabel: z.string().optional(),
			cancelLabel: z.string().optional(),
		}),
		events: ["confirm", "cancel"],
		description: "Confirmation dialog that requires an explicit confirm or cancel choice.",
		example: { triggerLabel: "Delete", title: "Delete this item?", actionLabel: "Delete" },
	},
	AspectRatio: {
		props: z.object({ ratio: z.number().positive().optional(), className }),
		description: "Container that preserves a width-to-height ratio for its children.",
		example: { ratio: 1.7778 },
	},
	Attachment: {
		props: z.object({
			title: z.string(),
			description: nullableString,
			mediaUrl: nullableString,
			mediaAlt: nullableString,
		}),
		description: "File or media attachment with optional preview and description.",
		example: { title: "report.pdf", description: "Quarterly report" },
	},
	Breadcrumb: {
		props: z.object({ items: z.array(navigationItem).min(1) }),
		description: "Hierarchical navigation path. Mark the current item with active=true.",
		example: {
			items: [
				{ label: "Home", href: "/" },
				{ label: "Settings", href: "/settings", active: true },
			],
		},
	},
	Bubble: {
		props: z.object({
			content: z.string(),
			role: z.enum(["assistant", "user", "system"]).optional(),
			reactions: z.array(z.string()).optional(),
		}),
		description: "Compact conversational bubble with optional reactions.",
		example: { content: "How can I help?", role: "assistant" },
	},
	Calendar: {
		props: z.object({
			ariaLabel: z.string().optional(),
			numberOfMonths: z.number().int().min(1).max(3).optional(),
			showOutsideDays: z.boolean().optional(),
			showWeekNumber: z.boolean().optional(),
			captionLayout: z.enum(["label", "dropdown"]).optional(),
		}),
		description: "Interactive shadcn calendar using the primitive native to the selected base.",
		example: { ariaLabel: "Choose a date", numberOfMonths: 1 },
	},
	Chart: {
		props: z.object({
			config: z.record(z.string(), z.unknown()).optional(),
			className,
			minHeight: z.number().positive().optional(),
		}),
		description: "shadcn chart container. Render chart primitives as JSON Render children.",
		example: { minHeight: 240, config: {} },
	},
	Combobox: {
		props: z.object({
			items: z.array(selectOption),
			value: nullableString,
			placeholder: nullableString,
			emptyText: z.string().optional(),
			disabled: z.boolean().optional(),
		}),
		events: ["change"],
		description: "Searchable option picker normalized across Base UI, React Aria and Radix.",
		example: { items: [{ label: "TypeScript", value: "ts" }], placeholder: "Choose" },
	},
	Command: {
		props: z.object({
			items: z.array(menuItem),
			value: nullableString,
			placeholder: nullableString,
			emptyText: z.string().optional(),
		}),
		events: ["select"],
		description:
			"Filterable command list. Emits select with the selected value available to bindings.",
		example: { items: [{ label: "Open settings", value: "settings", shortcut: "⌘," }] },
	},
	ContextMenu: {
		props: z.object({ triggerLabel: z.string(), items: z.array(menuItem), value: nullableString }),
		events: ["select"],
		description: "Context menu opened from its trigger area.",
		example: { triggerLabel: "Right click here", items: [{ label: "Copy", value: "copy" }] },
	},
	Direction: {
		props: z.object({ direction: z.enum(["ltr", "rtl"]) }),
		description: "Direction provider for left-to-right or right-to-left descendants.",
		example: { direction: "rtl" },
	},
	Empty: {
		props: z.object({
			title: z.string(),
			description: nullableString,
			media: nullableString,
			actionLabel: nullableString,
		}),
		events: ["action"],
		description: "Empty-state panel with optional media, content and action.",
		example: { title: "No results", description: "Try changing the filters." },
	},
	Field: {
		props: z.object({
			label: z.string(),
			description: nullableString,
			error: nullableString,
			required: z.boolean().optional(),
		}),
		description: "Form-field layout for a label, control children, help text and validation error.",
		example: { label: "Email", required: true },
	},
	Form: {
		props: z.object({ className }),
		events: ["submit"],
		description: "Form container that emits submit and renders JSON Render controls as children.",
		example: {},
	},
	HoverCard: {
		props: z.object({ triggerLabel: z.string(), title: z.string(), description: nullableString }),
		description: "Preview card revealed from a hover or focus trigger.",
		example: { triggerLabel: "@shadcn", title: "shadcn/ui" },
	},
	InputGroup: {
		props: z.object({
			value: nullableString,
			placeholder: nullableString,
			prefix: nullableString,
			suffix: nullableString,
			type: z.enum(["text", "email", "password", "search", "url", "tel"]).optional(),
			disabled: z.boolean().optional(),
		}),
		events: ["change"],
		description: "Text input with optional leading and trailing addons.",
		example: { prefix: "https://", placeholder: "example.com" },
	},
	InputOtp: {
		props: z.object({
			value: nullableString,
			length: z.number().int().min(1).max(12).optional(),
			disabled: z.boolean().optional(),
		}),
		events: ["change", "complete"],
		description: "One-time-password input split into individual character slots.",
		example: { length: 6 },
	},
	Item: {
		props: z.object({
			title: z.string(),
			description: nullableString,
			href: nullableString,
			variant: z.enum(["default", "outline", "muted"]).optional(),
		}),
		events: ["press"],
		description: "Structured list item with optional description, content and action.",
		example: { title: "Account", description: "Manage profile settings" },
	},
	Kbd: {
		props: z.object({ keys: z.array(z.string()).min(1) }),
		description: "Keyboard shortcut rendered as one or more key caps.",
		example: { keys: ["⌘", "K"] },
	},
	Label: {
		props: z.object({
			text: z.string(),
			htmlFor: nullableString,
			required: z.boolean().optional(),
		}),
		description: "Accessible label for a form control.",
		example: { text: "Email", htmlFor: "email" },
	},
	Marker: {
		props: z.object({
			label: z.string(),
			variant: z.enum(["default", "secondary", "outline"]).optional(),
		}),
		description: "Small visual marker for statuses, locations or annotations.",
		example: { label: "New", variant: "secondary" },
	},
	Menubar: {
		props: z.object({
			menus: z.array(z.object({ label: z.string(), items: z.array(menuItem) })),
			value: nullableString,
		}),
		events: ["select"],
		description: "Horizontal application menu bar containing grouped commands.",
		example: { menus: [{ label: "File", items: [{ label: "New", value: "new" }] }] },
	},
	Message: {
		props: z.object({
			content: z.string(),
			role: z.enum(["assistant", "user", "system"]).optional(),
			author: nullableString,
			avatarSrc: nullableString,
			time: nullableString,
		}),
		description: "Conversation message with optional author, avatar and timestamp.",
		example: { content: "Your report is ready.", role: "assistant" },
	},
	MessageScroller: {
		props: z.object({ height: z.number().positive().optional(), className }),
		description: "Auto-scrolling conversation viewport for Message children.",
		example: { height: 360 },
	},
	NativeSelect: {
		props: z.object({
			label: nullableString,
			options: z.array(selectOption),
			value: nullableString,
			placeholder: nullableString,
			disabled: z.boolean().optional(),
		}),
		events: ["change"],
		description: "Native HTML select styled by shadcn.",
		example: { options: [{ label: "Italy", value: "it" }], placeholder: "Country" },
	},
	NavigationMenu: {
		props: z.object({ items: z.array(navigationItem) }),
		description: "Primary navigation menu with optional descriptions and active items.",
		example: { items: [{ label: "Docs", href: "/docs", description: "Read the documentation" }] },
	},
	Resizable: {
		props: z.object({
			direction: z.enum(["horizontal", "vertical"]).optional(),
			defaultSizes: z.array(z.number().positive()).optional(),
			className,
		}),
		description: "Resizable panel group. Each JSON Render child becomes a panel.",
		example: { direction: "horizontal", defaultSizes: [50, 50] },
	},
	ScrollArea: {
		props: z.object({
			height: z.number().positive().optional(),
			orientation: z.enum(["vertical", "horizontal", "both"]).optional(),
			className,
		}),
		description: "Styled scrollable viewport for overflowing children.",
		example: { height: 320, orientation: "vertical" },
	},
	Sheet: {
		props: z.object({
			triggerLabel: z.string(),
			title: z.string(),
			description: nullableString,
			side: z.enum(["top", "right", "bottom", "left"]).optional(),
		}),
		events: ["open", "close"],
		description: "Overlay panel that slides in from one side of the viewport.",
		example: { triggerLabel: "Open settings", title: "Settings", side: "right" },
	},
	Sidebar: {
		props: z.object({
			title: nullableString,
			items: z.array(navigationItem),
			value: nullableString,
			collapsible: z.boolean().optional(),
		}),
		events: ["select"],
		description: "Application sidebar with navigation items.",
		example: { title: "Workspace", items: [{ label: "Overview", href: "/", active: true }] },
	},
	Sonner: {
		props: z.object({
			position: z
				.enum([
					"top-left",
					"top-center",
					"top-right",
					"bottom-left",
					"bottom-center",
					"bottom-right",
				])
				.optional(),
			theme: z.enum(["light", "dark", "system"]).optional(),
			richColors: z.boolean().optional(),
		}),
		description: "Sonner toast viewport. Mount once near the renderer root.",
		example: { position: "bottom-right", richColors: true },
	},
	Toast: {
		props: z.object({
			title: z.string(),
			description: nullableString,
			variant: z.enum(["default", "destructive"]).optional(),
			actionLabel: nullableString,
			duration: z.number().nonnegative().optional(),
		}),
		events: ["action", "dismiss"],
		description:
			"Visible toast notification. Uses an explicit fallback where upstream has no Toast primitive.",
		example: { title: "Saved", description: "Your changes were saved." },
	},
} satisfies Record<string, ComponentDefinition>;

export const shadcnComponentDefinitions = {
	...officialShadcnComponentDefinitions,
	...additionalShadcnComponentDefinitions,
};

export type ShadcnComponentName = keyof typeof shadcnComponentDefinitions;

export type ShadcnProps<K extends ShadcnComponentName> = z.output<
	(typeof shadcnComponentDefinitions)[K]["props"]
>;

export type { ComponentDefinition };
