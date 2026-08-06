import {
	fallbackJsonRenderComponentNamesByBase,
	implementedJsonRenderComponentNames,
	type ShadcnBase,
} from "@json-render-extended/shadcn";
import { shadcnRegistryCapabilities } from "@json-render-extended/shadcn/capabilities";
import { shadcnComponentDefinitions } from "@json-render-extended/shadcn/catalog";

export type ComponentSupport = "native" | "portable" | "json-render";

export type CatalogComponent = {
	name: string;
	description: string;
	category: string;
	support: Record<ShadcnBase, ComponentSupport>;
};

const jsonRenderSemantics = new Set(["Grid", "Heading", "Image", "Link", "Stack", "Text"]);

const categories: Record<string, string> = {
	Accordion: "Layout",
	AspectRatio: "Layout",
	Card: "Layout",
	Carousel: "Layout",
	Collapsible: "Layout",
	Direction: "Layout",
	Grid: "Layout",
	Resizable: "Layout",
	ScrollArea: "Layout",
	Separator: "Layout",
	Sidebar: "Layout",
	Stack: "Layout",
	Tabs: "Layout",
	Alert: "Feedback",
	AlertDialog: "Feedback",
	Empty: "Feedback",
	Progress: "Feedback",
	Skeleton: "Feedback",
	Sonner: "Feedback",
	Spinner: "Feedback",
	Toast: "Feedback",
	Avatar: "Content",
	Badge: "Content",
	Breadcrumb: "Content",
	Bubble: "Content",
	Chart: "Content",
	Heading: "Content",
	Image: "Content",
	Item: "Content",
	Kbd: "Content",
	Marker: "Content",
	Message: "Content",
	MessageScroller: "Content",
	Table: "Content",
	Text: "Content",
	Attachment: "AI",
	Button: "Actions",
	ButtonGroup: "Actions",
	Command: "Actions",
	ContextMenu: "Actions",
	DropdownMenu: "Actions",
	HoverCard: "Actions",
	Link: "Actions",
	Menubar: "Actions",
	NavigationMenu: "Actions",
	Pagination: "Actions",
	Popover: "Actions",
	Toggle: "Actions",
	ToggleGroup: "Actions",
	Tooltip: "Actions",
};

const bases = ["base-ui", "react-aria", "radix"] as const;

function sourceName(name: string) {
	if (name === "Radio") {
		return "radio-group";
	}

	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.toLowerCase();
}

function supportFor(name: string, base: ShadcnBase): ComponentSupport {
	if (jsonRenderSemantics.has(name)) {
		return "json-render";
	}

	if ((fallbackJsonRenderComponentNamesByBase[base] as readonly string[]).includes(name)) {
		return "portable";
	}

	return (shadcnRegistryCapabilities[base] as readonly string[]).includes(sourceName(name))
		? "native"
		: "portable";
}

export const componentCatalog: CatalogComponent[] = implementedJsonRenderComponentNames.map(
	(name) => ({
		name,
		description: shadcnComponentDefinitions[name].description,
		category: categories[name] ?? "Forms",
		support: Object.fromEntries(bases.map((base) => [base, supportFor(name, base)])) as Record<
			ShadcnBase,
			ComponentSupport
		>,
	}),
);

export const componentCategories = [
	"All",
	...Array.from(new Set(componentCatalog.map((component) => component.category))).sort(),
];
