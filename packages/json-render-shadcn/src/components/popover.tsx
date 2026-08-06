import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createPopoverComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Popover, PopoverContent, PopoverTrigger } = primitives;
	const triggerClassName =
		"inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 font-medium text-sm hover:bg-muted";

	return ({ props }: BaseComponentProps<ShadcnProps<"Popover">>) => {
		if (options.base === "react-aria") {
			return (
				<PopoverTrigger>
					<button className={triggerClassName} type="button">
						{props.trigger}
					</button>
					<Popover className="w-64">
						<p className="text-sm">{props.content}</p>
					</Popover>
				</PopoverTrigger>
			);
		}

		const Content = PopoverContent;
		return (
			<Popover>
				<PopoverTrigger className={triggerClassName}>{props.trigger}</PopoverTrigger>
				{Content && (
					<Content className="w-64">
						<p className="text-sm">{props.content}</p>
					</Content>
				)}
			</Popover>
		);
	};
}
