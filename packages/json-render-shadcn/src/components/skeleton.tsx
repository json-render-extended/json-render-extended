import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createSkeletonComponent(primitives: ShadcnPrimitiveSet) {
	const { Skeleton } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Skeleton">>) => (
		<Skeleton
			className={props.rounded ? "rounded-full" : "rounded-md"}
			style={{ width: props.width ?? "100%", height: props.height ?? "1.25rem" }}
		/>
	);
}
