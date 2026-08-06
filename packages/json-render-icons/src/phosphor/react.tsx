"use client";

import type { BaseComponentProps } from "@json-render/react";
import type { IconWeight, Icon as PhosphorReactIcon } from "@phosphor-icons/react";
import * as phosphorIcons from "@phosphor-icons/react";

import type { PhosphorIconProps } from "./catalog";
import { phosphorExportNameForIcon } from "./names";

const iconExports = phosphorIcons as unknown as Record<string, PhosphorReactIcon>;
const namedSizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;

function weightForStrokeWidth(strokeWidth = 2): IconWeight {
	if (strokeWidth <= 1) return "thin";
	if (strokeWidth <= 1.5) return "light";
	if (strokeWidth >= 3) return "bold";
	return "regular";
}

export function PhosphorIcon({ props }: BaseComponentProps<PhosphorIconProps>) {
	const size = typeof props.size === "number" ? props.size : namedSizes[props.size ?? "md"];
	const decorative = props.decorative ?? !props.label;
	const exportName = phosphorExportNameForIcon(props.name);
	const Icon = exportName ? iconExports[exportName] : undefined;
	if (!Icon) {
		return <span aria-hidden style={{ display: "inline-block", height: size, width: size }} />;
	}

	return (
		<Icon
			aria-hidden={decorative || undefined}
			aria-label={decorative ? undefined : props.label}
			className={props.className}
			focusable={false}
			role={decorative ? undefined : "img"}
			size={size}
			weight={weightForStrokeWidth(props.strokeWidth)}
		/>
	);
}

export const phosphorComponents = { Icon: PhosphorIcon };
export const components = phosphorComponents;
