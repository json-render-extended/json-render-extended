import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createScrollAreaComponent(primitives: ShadcnPrimitiveSet) {
	const { ScrollArea, ScrollBar } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"ScrollArea">>) => {
		if (!ScrollArea) {
			return (
				<PrimitiveFallback className={props.className} name="ScrollArea">
					{children}
				</PrimitiveFallback>
			);
		}

		return (
			<ScrollArea className={props.className ?? undefined} style={{ height: props.height ?? 320 }}>
				{children}
				{ScrollBar && props.orientation !== "horizontal" ? (
					<ScrollBar orientation="vertical" />
				) : null}
				{ScrollBar && props.orientation !== "vertical" ? (
					<ScrollBar orientation="horizontal" />
				) : null}
			</ScrollArea>
		);
	};
}
