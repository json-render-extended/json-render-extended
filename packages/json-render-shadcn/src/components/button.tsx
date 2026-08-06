import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createButtonComponent(primitives: ShadcnPrimitiveSet) {
	const { Button } = primitives;

	return ({ props, emit }: BaseComponentProps<ShadcnProps<"Button">>) => (
		<Button
			type="button"
			variant={
				props.variant === "danger"
					? "destructive"
					: props.variant === "secondary"
						? "secondary"
						: "default"
			}
			disabled={props.disabled ?? false}
			onClick={() => emit("press")}
		>
			{props.label}
		</Button>
	);
}
