import type { BaseComponentProps } from "@json-render/react";
import { Children } from "react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createResizableComponent(primitives: ShadcnPrimitiveSet) {
	const { ResizableHandle, ResizablePanel, ResizablePanelGroup } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Resizable">>) => {
		if (!ResizableHandle || !ResizablePanel || !ResizablePanelGroup) {
			return (
				<PrimitiveFallback className={props.className} name="Resizable">
					{children}
				</PrimitiveFallback>
			);
		}

		const panels = Children.toArray(children);
		return (
			<ResizablePanelGroup
				className={props.className ?? undefined}
				orientation={props.direction ?? "horizontal"}
			>
				{panels.map((panel, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: JSON Render children have a stable positional panel order.
					<span className="contents" key={index}>
						<ResizablePanel defaultSize={props.defaultSizes?.[index]}>{panel}</ResizablePanel>
						{index < panels.length - 1 ? <ResizableHandle withHandle /> : null}
					</span>
				))}
			</ResizablePanelGroup>
		);
	};
}
