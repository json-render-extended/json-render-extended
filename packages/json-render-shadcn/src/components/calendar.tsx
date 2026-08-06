import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createCalendarComponent(primitives: ShadcnPrimitiveSet) {
	const { Calendar } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Calendar">>) => {
		if (!Calendar) return <PrimitiveFallback name="Calendar" />;

		return (
			<Calendar
				aria-label={props.ariaLabel ?? "Calendar"}
				captionLayout={props.captionLayout ?? "label"}
				numberOfMonths={props.numberOfMonths ?? 1}
				showOutsideDays={props.showOutsideDays ?? true}
				showWeekNumber={props.showWeekNumber ?? false}
			/>
		);
	};
}
