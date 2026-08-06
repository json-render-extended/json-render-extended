import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createFieldComponent(primitives: ShadcnPrimitiveSet) {
	const { Field, FieldContent, FieldDescription, FieldError, FieldLabel } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Field">>) => {
		if (!Field || !FieldLabel) {
			return (
				<PrimitiveFallback name="Field">
					<div className="font-medium">
						{props.label}
						{props.required ? " *" : ""}
					</div>
					{children}
					{props.description ? <small>{props.description}</small> : null}
					{props.error ? <p role="alert">{props.error}</p> : null}
				</PrimitiveFallback>
			);
		}

		return (
			<Field data-invalid={Boolean(props.error)}>
				<FieldLabel>
					{props.label}
					{props.required ? <span aria-hidden="true"> *</span> : null}
				</FieldLabel>
				{FieldContent ? <FieldContent>{children}</FieldContent> : children}
				{FieldDescription && props.description ? (
					<FieldDescription>{props.description}</FieldDescription>
				) : null}
				{FieldError && props.error ? <FieldError>{props.error}</FieldError> : null}
			</Field>
		);
	};
}
