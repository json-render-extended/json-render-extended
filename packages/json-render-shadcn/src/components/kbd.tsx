import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createKbdComponent(primitives: ShadcnPrimitiveSet) {
	const { Kbd, KbdGroup } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Kbd">>) => {
		const keys = props.keys.map((key) =>
			Kbd ? <Kbd key={key}>{key}</Kbd> : <kbd key={key}>{key}</kbd>,
		);

		return KbdGroup ? (
			<KbdGroup>{keys}</KbdGroup>
		) : (
			<span className="inline-flex gap-1">{keys}</span>
		);
	};
}
