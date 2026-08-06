"use client";

import type { BaseComponentProps } from "@json-render/react";
import type { RemixiconComponentType } from "@remixicon/react";
import * as remixIcons from "@remixicon/react";

import type { RemixIconProps } from "./catalog";
import { remixExportNameForIcon } from "./names";

const iconExports = remixIcons as unknown as Record<string, RemixiconComponentType>;
const namedSizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;

export function RemixIcon({ props }: BaseComponentProps<RemixIconProps>) {
	const size = typeof props.size === "number" ? props.size : namedSizes[props.size ?? "md"];
	const decorative = props.decorative ?? !props.label;
	const exportName = remixExportNameForIcon(props.name);
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
		/>
	);
}

export const remixComponents = { Icon: RemixIcon };
export const components = remixComponents;
