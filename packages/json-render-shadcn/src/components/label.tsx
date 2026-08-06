import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createLabelComponent(primitives: ShadcnPrimitiveSet) {
	const { Label } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Label">>) => (
		<Label htmlFor={props.htmlFor ?? undefined}>
			{props.text}
			{props.required ? <span aria-hidden="true"> *</span> : null}
		</Label>
	);
}
