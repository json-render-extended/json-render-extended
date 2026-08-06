"use client";

import type { BaseComponentProps } from "@json-render/react";
import {
	ArrowLeft,
	ArrowRight,
	Bell,
	Calendar,
	ChartNoAxesColumn,
	CircleAlert,
	CircleCheck,
	CircleHelp,
	CircleX,
	CreditCard,
	Download,
	File,
	FileText,
	Heart,
	House,
	Info,
	Loader,
	type LucideIcon as LucideReactIcon,
	Mail,
	Menu,
	Plus,
	Search,
	Settings,
	Trash,
	Upload,
	User,
	X,
} from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic.mjs";

import type { LucideIconProps } from "./catalog";
import type { LucideIconName } from "./names";

const staticIcons: Partial<Record<LucideIconName, LucideReactIcon>> = {
	"arrow-left": ArrowLeft,
	"arrow-right": ArrowRight,
	bell: Bell,
	calendar: Calendar,
	"chart-no-axes-column": ChartNoAxesColumn,
	"circle-alert": CircleAlert,
	"circle-check": CircleCheck,
	"circle-help": CircleHelp,
	"circle-x": CircleX,
	"credit-card": CreditCard,
	download: Download,
	file: File,
	"file-text": FileText,
	heart: Heart,
	house: House,
	info: Info,
	loader: Loader,
	mail: Mail,
	menu: Menu,
	plus: Plus,
	search: Search,
	settings: Settings,
	trash: Trash,
	upload: Upload,
	user: User,
	x: X,
};

const namedSizes = {
	xs: 12,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
} as const;

export function LucideIcon({ props }: BaseComponentProps<LucideIconProps>) {
	const size = typeof props.size === "number" ? props.size : namedSizes[props.size ?? "md"];
	const decorative = props.decorative ?? !props.label;
	const accessibilityProps = decorative
		? ({ "aria-hidden": true } as const)
		: ({ "aria-label": props.label, role: "img" } as const);
	const iconProps = {
		...accessibilityProps,
		absoluteStrokeWidth: props.absoluteStrokeWidth,
		className: props.className,
		focusable: false,
		size,
		strokeWidth: props.strokeWidth,
	};
	const StaticIcon = staticIcons[props.name as LucideIconName];
	if (StaticIcon) return <StaticIcon {...iconProps} />;

	return (
		<DynamicIcon
			{...iconProps}
			name={props.name as IconName}
			fallback={() => (
				<span aria-hidden style={{ display: "inline-block", height: size, width: size }} />
			)}
		/>
	);
}

export const lucideComponents = {
	Icon: LucideIcon,
};

export const components = lucideComponents;
