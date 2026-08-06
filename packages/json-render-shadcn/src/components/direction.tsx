import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createDirectionComponent(primitives: ShadcnPrimitiveSet) {
	const { DirectionProvider } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Direction">>) => {
		if (DirectionProvider) {
			return <DirectionProvider direction={props.direction}>{children}</DirectionProvider>;
		}

		return <div dir={props.direction}>{children}</div>;
	};
}
