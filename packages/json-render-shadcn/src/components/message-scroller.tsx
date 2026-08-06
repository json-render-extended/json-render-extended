import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createMessageScrollerComponent(primitives: ShadcnPrimitiveSet) {
	const {
		MessageScroller,
		MessageScrollerContent,
		MessageScrollerProvider,
		MessageScrollerViewport,
	} = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"MessageScroller">>) => {
		if (
			!MessageScroller ||
			!MessageScrollerContent ||
			!MessageScrollerProvider ||
			!MessageScrollerViewport
		) {
			return (
				<PrimitiveFallback className={props.className} name="MessageScroller">
					{children}
				</PrimitiveFallback>
			);
		}

		return (
			<MessageScrollerProvider>
				<MessageScroller
					className={props.className ?? undefined}
					style={{ height: props.height ?? 360 }}
				>
					<MessageScrollerViewport>
						<MessageScrollerContent>{children}</MessageScrollerContent>
					</MessageScrollerViewport>
				</MessageScroller>
			</MessageScrollerProvider>
		);
	};
}
