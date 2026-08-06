"use client";

import { type BaseComponentProps, useBoundProp, useFieldValidation } from "@json-render/react";
import { type ChangeEvent, useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createTextareaComponent(primitives: ShadcnPrimitiveSet) {
	const { Label, Textarea } = primitives;

	return ({ props, bindings }: BaseComponentProps<ShadcnProps<"Textarea">>) => {
		const [boundValue, setBoundValue] = useBoundProp<string>(
			props.value as string | undefined,
			bindings?.value,
		);
		const [localValue, setLocalValue] = useState("");
		const isBound = Boolean(bindings?.value);
		const value = isBound ? (boundValue ?? "") : localValue;
		const setValue = isBound ? setBoundValue : setLocalValue;
		const validateOn = props.validateOn ?? "blur";
		const hasValidation = Boolean(bindings?.value && props.checks?.length);
		const { errors, validate } = useFieldValidation(
			bindings?.value ?? "",
			hasValidation ? { checks: props.checks ?? [], validateOn } : undefined,
		);

		return (
			<div className="space-y-2">
				{props.label && <Label htmlFor={props.name ?? undefined}>{props.label}</Label>}
				<Textarea
					id={props.name ?? undefined}
					name={props.name ?? undefined}
					placeholder={props.placeholder ?? ""}
					rows={props.rows ?? 3}
					value={value}
					onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
						setValue(event.target.value);
						if (hasValidation && validateOn === "change") validate();
					}}
					onBlur={() => {
						if (hasValidation && validateOn === "blur") validate();
					}}
				/>
				{errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
			</div>
		);
	};
}
