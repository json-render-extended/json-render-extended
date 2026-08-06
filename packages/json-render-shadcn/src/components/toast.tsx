import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createToastComponent(primitives: ShadcnPrimitiveSet) {
	const { Alert, AlertDescription, AlertTitle, Button } = primitives;

	return ({ props, emit }: BaseComponentProps<ShadcnProps<"Toast">>) => (
		<Alert
			aria-live="polite"
			data-shadcn-fallback={primitives.Toast ? undefined : "Toast"}
			role="status"
			variant={props.variant}
		>
			<AlertTitle>{props.title}</AlertTitle>
			{props.description ? <AlertDescription>{props.description}</AlertDescription> : null}
			<div className="mt-2 flex gap-2">
				{props.actionLabel ? (
					<Button onClick={() => emit("action")} size="sm" variant="outline">
						{props.actionLabel}
					</Button>
				) : null}
				<Button onClick={() => emit("dismiss")} size="sm" variant="ghost">
					Dismiss
				</Button>
			</div>
		</Alert>
	);
}
