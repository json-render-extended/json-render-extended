import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";
import { cn } from "./utils";

export function createAlertComponent(primitives: ShadcnPrimitiveSet) {
	const { Alert, AlertDescription, AlertTitle } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Alert">>) => (
		<Alert
			variant={props.type === "error" ? "destructive" : "default"}
			className={cn(
				props.type === "success" && "border-green-600/30 text-green-900 dark:text-green-100",
				props.type === "warning" && "border-yellow-600/30 text-yellow-900 dark:text-yellow-100",
				props.type === "info" && "border-blue-600/30 text-blue-900 dark:text-blue-100",
			)}
		>
			<AlertTitle>{props.title}</AlertTitle>
			{props.message && <AlertDescription>{props.message}</AlertDescription>}
		</Alert>
	);
}
