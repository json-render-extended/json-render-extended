import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createSheetComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } =
		primitives;

	return ({ props, children, emit }: BaseComponentProps<ShadcnProps<"Sheet">>) => {
		if (!Sheet || !SheetContent || !SheetTitle || !SheetTrigger) {
			return <PrimitiveFallback name="Sheet">{children}</PrimitiveFallback>;
		}

		const content = (
			<SheetContent side={props.side ?? "right"}>
				{SheetHeader ? (
					<SheetHeader>
						<SheetTitle>{props.title}</SheetTitle>
						{SheetDescription && props.description ? (
							<SheetDescription>{props.description}</SheetDescription>
						) : null}
					</SheetHeader>
				) : (
					<SheetTitle>{props.title}</SheetTitle>
				)}
				<div className="p-4">{children}</div>
			</SheetContent>
		);

		if (options.base === "react-aria") {
			return (
				<SheetTrigger onOpenChange={(open: boolean) => emit(open ? "open" : "close")}>
					<Button>{props.triggerLabel}</Button>
					{content}
				</SheetTrigger>
			);
		}

		return (
			<Sheet onOpenChange={(open: boolean) => emit(open ? "open" : "close")}>
				<SheetTrigger>{props.triggerLabel}</SheetTrigger>
				{content}
			</Sheet>
		);
	};
}
