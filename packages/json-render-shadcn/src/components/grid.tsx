import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { cn } from "./utils";

export function GridComponent({ props, children }: BaseComponentProps<ShadcnProps<"Grid">>) {
	const columns = Math.max(1, Math.min(6, props.columns ?? 1));
	const columnClass =
		(
			[
				"grid-cols-1",
				"grid-cols-2",
				"grid-cols-3",
				"grid-cols-4",
				"grid-cols-5",
				"grid-cols-6",
			] as const
		)[columns - 1] ?? "grid-cols-1";
	const gap = { sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" }[props.gap ?? "md"];

	return <div className={cn("grid", columnClass, gap, props.className)}>{children}</div>;
}
