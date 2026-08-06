import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createChartComponent(primitives: ShadcnPrimitiveSet) {
	const { ChartContainer } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Chart">>) => {
		if (!ChartContainer) {
			return (
				<PrimitiveFallback className={props.className} name="Chart">
					{children}
				</PrimitiveFallback>
			);
		}

		return (
			<ChartContainer
				className={props.className ?? undefined}
				config={props.config ?? {}}
				style={{ minHeight: props.minHeight ?? 240 }}
			>
				{children}
			</ChartContainer>
		);
	};
}
