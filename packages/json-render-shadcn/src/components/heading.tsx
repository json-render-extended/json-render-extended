import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { cn } from "./utils";

export function HeadingComponent({ props }: BaseComponentProps<ShadcnProps<"Heading">>) {
	const level = props.level ?? "h2";
	const Heading = level;

	return (
		<Heading
			className={cn(
				"text-left font-semibold",
				level === "h1" && "text-2xl font-bold",
				level === "h2" && "text-lg",
				level === "h3" && "text-base",
				level === "h4" && "text-sm",
			)}
		>
			{props.text}
		</Heading>
	);
}
