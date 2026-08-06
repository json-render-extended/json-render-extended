import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createAspectRatioComponent(primitives: ShadcnPrimitiveSet) {
	const { AspectRatio } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"AspectRatio">>) => {
		if (AspectRatio) {
			return (
				<AspectRatio className={props.className ?? undefined} ratio={props.ratio ?? 16 / 9}>
					{children}
				</AspectRatio>
			);
		}

		return (
			<div className={props.className ?? undefined} style={{ aspectRatio: props.ratio ?? 16 / 9 }}>
				{children}
			</div>
		);
	};
}
