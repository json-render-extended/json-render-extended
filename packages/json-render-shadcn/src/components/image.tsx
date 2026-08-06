import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";

export function ImageComponent({ props }: BaseComponentProps<ShadcnProps<"Image">>) {
	return props.src ? (
		<img
			src={props.src}
			alt={props.alt}
			width={props.width ?? undefined}
			height={props.height ?? undefined}
			className="max-w-full rounded"
		/>
	) : (
		<div
			className="flex items-center justify-center rounded border border-border bg-muted text-xs text-muted-foreground"
			style={{ width: props.width ?? 80, height: props.height ?? 60 }}
		>
			{props.alt || "img"}
		</div>
	);
}
