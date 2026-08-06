import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createSeparatorComponent(primitives: ShadcnPrimitiveSet) {
	const { Separator } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Separator">>) => (
		<Separator
			orientation={props.orientation ?? "horizontal"}
			className={props.orientation === "vertical" ? "mx-2 h-full" : "my-3"}
		/>
	);
}
