import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createItemComponent(primitives: ShadcnPrimitiveSet) {
	const { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } = primitives;

	return ({ props, children, emit }: BaseComponentProps<ShadcnProps<"Item">>) => {
		if (!Item || !ItemContent || !ItemTitle) {
			return (
				<PrimitiveFallback name="Item">
					<strong>{props.title}</strong>
					{props.description ? <p>{props.description}</p> : null}
					{children}
				</PrimitiveFallback>
			);
		}

		return (
			<Item
				data-href={props.href ?? undefined}
				onClick={() => emit("press")}
				variant={props.variant}
			>
				<ItemContent>
					<ItemTitle>{props.title}</ItemTitle>
					{ItemDescription && props.description ? (
						<ItemDescription>{props.description}</ItemDescription>
					) : null}
				</ItemContent>
				{ItemActions ? <ItemActions>{children}</ItemActions> : children}
			</Item>
		);
	};
}
