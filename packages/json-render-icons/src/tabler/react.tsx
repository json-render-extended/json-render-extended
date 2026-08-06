"use client";

import type { BaseComponentProps } from "@json-render/react";
import { icons, type TablerIcon as TablerReactIcon } from "@tabler/icons-react";

import type { TablerIconProps } from "./catalog";

const tablerIcons = icons as unknown as Record<string, TablerReactIcon>;

const namedSizes = {
	xs: 12,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
} as const;

function componentNameForIcon(name: string): string {
	return `Icon${name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("")}`;
}

export function TablerIcon({ props }: BaseComponentProps<TablerIconProps>) {
	const size = typeof props.size === "number" ? props.size : namedSizes[props.size ?? "md"];
	const decorative = props.decorative ?? !props.label;
	const accessibilityProps = decorative
		? ({ "aria-hidden": true } as const)
		: ({ "aria-label": props.label, role: "img" } as const);
	const Icon = tablerIcons[componentNameForIcon(props.name)];
	if (!Icon) {
		return <span aria-hidden style={{ display: "inline-block", height: size, width: size }} />;
	}

	return (
		<Icon
			{...accessibilityProps}
			className={props.className}
			focusable={false}
			size={size}
			stroke={props.strokeWidth}
		/>
	);
}

export const tablerComponents = {
	Icon: TablerIcon,
};

export const components = tablerComponents;
