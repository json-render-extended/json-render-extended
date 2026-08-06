import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createProgressComponent(primitives: ShadcnPrimitiveSet) {
	const { Label, Progress } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Progress">>) => (
		<div className="space-y-2">
			{props.label && <Label className="text-sm text-muted-foreground">{props.label}</Label>}
			<Progress value={Math.min(100, Math.max(0, props.value || 0))} />
		</div>
	);
}
