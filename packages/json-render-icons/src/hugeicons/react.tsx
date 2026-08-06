"use client";

import * as coreFreeIcons from "@hugeicons/core-free-icons";
import { HugeiconsIcon as HugeiconsRenderer, type IconSvgElement } from "@hugeicons/react";
import type { BaseComponentProps } from "@json-render/react";

import type { HugeiconsIconProps } from "./catalog";
import { hugeiconsExportNameForIcon } from "./names";

const iconExports = coreFreeIcons as unknown as Record<string, IconSvgElement>;
const namedSizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;

export function HugeiconsIcon({ props }: BaseComponentProps<HugeiconsIconProps>) {
	const size = typeof props.size === "number" ? props.size : namedSizes[props.size ?? "md"];
	const decorative = props.decorative ?? !props.label;
	const exportName = hugeiconsExportNameForIcon(props.name);
	const icon = exportName ? iconExports[exportName] : undefined;
	if (!icon) {
		return <span aria-hidden style={{ display: "inline-block", height: size, width: size }} />;
	}

	return (
		<HugeiconsRenderer
			aria-hidden={decorative || undefined}
			aria-label={decorative ? undefined : props.label}
			role={decorative ? undefined : "img"}
			absoluteStrokeWidth={props.absoluteStrokeWidth}
			className={props.className}
			focusable={false}
			icon={icon}
			size={size}
			strokeWidth={props.strokeWidth}
		/>
	);
}

export const hugeiconsComponents = { Icon: HugeiconsIcon };
export const components = hugeiconsComponents;
