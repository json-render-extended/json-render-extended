import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { cn } from "./utils";

export function SpinnerComponent({ props }: BaseComponentProps<ShadcnProps<"Spinner">>) {
	return (
		<div className="flex items-center gap-2">
			<svg
				aria-hidden="true"
				className={cn(
					"animate-spin text-muted-foreground",
					props.size === "sm" && "size-4",
					(!props.size || props.size === "md") && "size-6",
					props.size === "lg" && "size-8",
				)}
				viewBox="0 0 24 24"
				fill="none"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 0 1 8-8V0A12 12 0 0 0 0 12h4Z"
				/>
			</svg>
			{props.label && <span className="text-sm text-muted-foreground">{props.label}</span>}
		</div>
	);
}
