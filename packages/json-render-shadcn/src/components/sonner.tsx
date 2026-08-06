import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createSonnerComponent(primitives: ShadcnPrimitiveSet) {
	const { Toaster } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Sonner">>) => {
		if (!Toaster) return <PrimitiveFallback name="Sonner" />;

		return (
			<Toaster
				position={props.position ?? "bottom-right"}
				richColors={props.richColors ?? false}
				theme={props.theme ?? "system"}
			/>
		);
	};
}
