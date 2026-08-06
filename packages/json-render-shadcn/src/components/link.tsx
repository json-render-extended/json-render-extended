import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";

export function LinkComponent({ props, on }: BaseComponentProps<ShadcnProps<"Link">>) {
	return (
		<a
			href={props.href ?? "#"}
			className="text-sm font-medium text-primary underline-offset-4 hover:underline"
			onClick={(event) => {
				const press = on("press");
				if (press.shouldPreventDefault) event.preventDefault();
				press.emit();
			}}
		>
			{props.label}
		</a>
	);
}
