import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createEmptyComponent(primitives: ShadcnPrimitiveSet) {
	const { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } =
		primitives;

	return ({ props, children, emit }: BaseComponentProps<ShadcnProps<"Empty">>) => {
		if (!Empty || !EmptyHeader || !EmptyTitle) {
			return (
				<PrimitiveFallback name="Empty">
					<strong>{props.title}</strong>
					{props.description ? <p>{props.description}</p> : null}
					{children}
				</PrimitiveFallback>
			);
		}

		return (
			<Empty>
				<EmptyHeader>
					{EmptyMedia && props.media ? <EmptyMedia>{props.media}</EmptyMedia> : null}
					<EmptyTitle>{props.title}</EmptyTitle>
					{EmptyDescription && props.description ? (
						<EmptyDescription>{props.description}</EmptyDescription>
					) : null}
				</EmptyHeader>
				{EmptyContent ? <EmptyContent>{children}</EmptyContent> : children}
				{props.actionLabel ? (
					<Button onClick={() => emit("action")}>{props.actionLabel}</Button>
				) : null}
			</Empty>
		);
	};
}
