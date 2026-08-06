import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { cn } from "./utils";

export function TextComponent({ props }: BaseComponentProps<ShadcnProps<"Text">>) {
	const className = cn(
		"text-left",
		props.variant === "caption" && "text-xs",
		props.variant === "muted" && "text-sm text-muted-foreground",
		props.variant === "lead" && "text-xl text-muted-foreground",
		props.variant === "code" && "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
		(!props.variant || props.variant === "body") && "text-sm",
	);

	return props.variant === "code" ? (
		<code className={className}>{props.text}</code>
	) : (
		<p className={className}>{props.text}</p>
	);
}
