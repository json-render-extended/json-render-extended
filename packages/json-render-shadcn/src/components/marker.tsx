import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createMarkerComponent(primitives: ShadcnPrimitiveSet) {
	const { Marker, MarkerContent } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Marker">>) => {
		if (!Marker) return <PrimitiveFallback name="Marker">{props.label}</PrimitiveFallback>;

		return (
			<Marker variant={props.variant ?? "default"}>
				{MarkerContent ? <MarkerContent>{props.label}</MarkerContent> : props.label}
			</Marker>
		);
	};
}
