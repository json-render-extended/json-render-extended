import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { cn } from "./utils";

export function StackComponent({ props, children }: BaseComponentProps<ShadcnProps<"Stack">>) {
	const gap = { none: "gap-0", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" }[
		props.gap ?? "md"
	];
	const align = {
		start: "items-start",
		center: "items-center",
		end: "items-end",
		stretch: "items-stretch",
	}[props.align ?? "start"];
	const justify = {
		start: "justify-start",
		center: "justify-center",
		end: "justify-end",
		between: "justify-between",
		around: "justify-around",
	}[props.justify ?? "start"];

	return (
		<div
			className={cn(
				"flex",
				props.direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
				gap,
				align,
				justify,
				props.className,
			)}
		>
			{children}
		</div>
	);
}
