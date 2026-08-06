import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";
import { cn } from "./utils";

export function createCardComponent(primitives: ShadcnPrimitiveSet) {
	const { Card, CardContent, CardDescription, CardHeader, CardTitle } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Card">>) => {
		const maxWidthClass =
			props.maxWidth === "sm"
				? "max-w-xs sm:min-w-70"
				: props.maxWidth === "md"
					? "max-w-sm sm:min-w-80"
					: props.maxWidth === "lg"
						? "max-w-md sm:min-w-90"
						: "w-full";

		return (
			<Card className={cn(maxWidthClass, props.centered && "mx-auto", props.className)}>
				{(props.title || props.description) && (
					<CardHeader>
						{props.title && <CardTitle>{props.title}</CardTitle>}
						{props.description && <CardDescription>{props.description}</CardDescription>}
					</CardHeader>
				)}
				<CardContent className="flex flex-col gap-3">{children}</CardContent>
			</Card>
		);
	};
}
