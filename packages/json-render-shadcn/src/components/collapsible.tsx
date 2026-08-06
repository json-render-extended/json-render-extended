"use client";

import type { BaseComponentProps } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createCollapsibleComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Collapsible, CollapsibleContent, CollapsibleTrigger } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Collapsible">>) => {
		const [open, setOpen] = useState(props.defaultOpen ?? false);
		const rootProps =
			options.base === "react-aria"
				? { isExpanded: open, onExpandedChange: setOpen }
				: { open, onOpenChange: setOpen };

		return (
			<Collapsible className="w-full" {...rootProps}>
				<CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border px-4 py-2 font-medium text-sm transition-colors hover:bg-muted">
					{props.title}
					<svg
						aria-hidden="true"
						className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
					>
						<path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-2">{children}</CollapsibleContent>
			</Collapsible>
		);
	};
}
