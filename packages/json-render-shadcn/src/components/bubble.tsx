import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createBubbleComponent(primitives: ShadcnPrimitiveSet) {
	const { Bubble, BubbleContent, BubbleGroup, BubbleReactions } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Bubble">>) => {
		if (!Bubble || !BubbleContent) {
			return <PrimitiveFallback name="Bubble">{props.content}</PrimitiveFallback>;
		}

		const bubble = (
			<Bubble data-role={props.role ?? "assistant"}>
				<BubbleContent>{props.content}</BubbleContent>
				{BubbleReactions && props.reactions?.length ? (
					<BubbleReactions>{props.reactions.join(" ")}</BubbleReactions>
				) : null}
			</Bubble>
		);

		return BubbleGroup ? <BubbleGroup>{bubble}</BubbleGroup> : bubble;
	};
}
