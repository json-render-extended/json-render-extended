import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createTooltipComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } = primitives;
	const triggerClassName = "cursor-help text-sm underline decoration-dotted";

	return ({ props }: BaseComponentProps<ShadcnProps<"Tooltip">>) => {
		if (options.base === "react-aria") {
			return (
				<TooltipTrigger>
					<span className={triggerClassName}>{props.text}</span>
					<Tooltip>
						<p>{props.content}</p>
					</Tooltip>
				</TooltipTrigger>
			);
		}

		const Content = TooltipContent;
		const Provider = TooltipProvider;
		const tooltip = (
			<Tooltip>
				<TooltipTrigger className={triggerClassName}>{props.text}</TooltipTrigger>
				{Content && (
					<Content>
						<p>{props.content}</p>
					</Content>
				)}
			</Tooltip>
		);

		return Provider ? <Provider>{tooltip}</Provider> : tooltip;
	};
}
