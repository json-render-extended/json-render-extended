import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createAvatarComponent(primitives: ShadcnPrimitiveSet) {
	const { Avatar, AvatarFallback, AvatarImage } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Avatar">>) => {
		const initials = (props.name || "?")
			.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();

		return (
			<Avatar data-size={props.size ?? "md"}>
				{props.src && <AvatarImage src={props.src} alt={props.name} />}
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
		);
	};
}
