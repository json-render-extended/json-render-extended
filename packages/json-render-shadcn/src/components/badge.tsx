import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createBadgeComponent(primitives: ShadcnPrimitiveSet) {
	const { Badge } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Badge">>) => (
		<Badge variant={props.variant ?? "default"}>{props.text}</Badge>
	);
}
