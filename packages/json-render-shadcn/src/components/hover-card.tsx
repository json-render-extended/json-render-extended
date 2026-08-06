import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createHoverCardComponent(primitives: ShadcnPrimitiveSet) {
	const { HoverCard, HoverCardContent, HoverCardTrigger } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"HoverCard">>) => {
		if (!HoverCard || !HoverCardContent || !HoverCardTrigger) {
			return (
				<details data-shadcn-fallback="HoverCard">
					<summary>{props.triggerLabel}</summary>
					<PrimitiveFallback name="HoverCardContent">
						<strong>{props.title}</strong>
						{props.description ? <p>{props.description}</p> : null}
					</PrimitiveFallback>
				</details>
			);
		}

		return (
			<HoverCard>
				<HoverCardTrigger>{props.triggerLabel}</HoverCardTrigger>
				<HoverCardContent>
					<strong>{props.title}</strong>
					{props.description ? <p>{props.description}</p> : null}
				</HoverCardContent>
			</HoverCard>
		);
	};
}
