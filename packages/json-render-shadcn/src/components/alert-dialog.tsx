import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createAlertDialogComponent(primitives: ShadcnPrimitiveSet) {
	const {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger,
	} = primitives;

	return ({ props, emit }: BaseComponentProps<ShadcnProps<"AlertDialog">>) => {
		if (
			!AlertDialog ||
			!AlertDialogAction ||
			!AlertDialogCancel ||
			!AlertDialogContent ||
			!AlertDialogTitle ||
			!AlertDialogTrigger
		) {
			return <PrimitiveFallback name="AlertDialog">{props.triggerLabel}</PrimitiveFallback>;
		}

		const body = (
			<AlertDialogContent>
				{AlertDialogHeader ? (
					<AlertDialogHeader>
						<AlertDialogTitle>{props.title}</AlertDialogTitle>
						{AlertDialogDescription && props.description ? (
							<AlertDialogDescription>{props.description}</AlertDialogDescription>
						) : null}
					</AlertDialogHeader>
				) : (
					<AlertDialogTitle>{props.title}</AlertDialogTitle>
				)}
				{AlertDialogFooter ? (
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => emit("cancel")}>
							{props.cancelLabel ?? "Cancel"}
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => emit("confirm")}>
							{props.actionLabel ?? "Continue"}
						</AlertDialogAction>
					</AlertDialogFooter>
				) : null}
			</AlertDialogContent>
		);

		return (
			<AlertDialog>
				<AlertDialogTrigger>{props.triggerLabel}</AlertDialogTrigger>
				{body}
			</AlertDialog>
		);
	};
}
