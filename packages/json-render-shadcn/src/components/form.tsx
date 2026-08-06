import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";

export function FormComponent({ props, children, emit }: BaseComponentProps<ShadcnProps<"Form">>) {
	return (
		<form
			className={props.className ?? undefined}
			onSubmit={(event) => {
				event.preventDefault();
				emit("submit");
			}}
		>
			{children}
		</form>
	);
}
