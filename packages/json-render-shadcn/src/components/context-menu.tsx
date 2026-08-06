"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createContextMenuComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"ContextMenu">>) => {
		const [, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
		const select = (value: string) => {
			setValue(value);
			emit("select");
		};

		if (!ContextMenu || !ContextMenuItem || !ContextMenuTrigger) {
			return <PrimitiveFallback name="ContextMenu">{props.triggerLabel}</PrimitiveFallback>;
		}

		if (options.base === "react-aria") {
			return (
				<ContextMenuTrigger>
					<div className="rounded-md border border-dashed p-4">{props.triggerLabel}</div>
					<ContextMenu onAction={(key: unknown) => select(String(key))}>
						{props.items.map((item) => (
							<ContextMenuItem id={item.value} isDisabled={item.disabled} key={item.value}>
								{item.label}
							</ContextMenuItem>
						))}
					</ContextMenu>
				</ContextMenuTrigger>
			);
		}

		return (
			<ContextMenu>
				<ContextMenuTrigger>
					<div className="rounded-md border border-dashed p-4">{props.triggerLabel}</div>
				</ContextMenuTrigger>
				{ContextMenuContent ? (
					<ContextMenuContent>
						{props.items.map((item) => (
							<ContextMenuItem
								disabled={item.disabled}
								key={item.value}
								onSelect={() => select(item.value)}
							>
								{item.label}
							</ContextMenuItem>
						))}
					</ContextMenuContent>
				) : null}
			</ContextMenu>
		);
	};
}
