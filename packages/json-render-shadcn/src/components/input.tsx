"use client";

import { type BaseComponentProps, useBoundProp, useFieldValidation } from "@json-render/react";
import { type ChangeEvent, type KeyboardEvent, useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createInputComponent(primitives: ShadcnPrimitiveSet) {
	const { Input, Label } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Input">>) => {
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
				<Input
					id={props.name ?? undefined}
					name={props.name ?? undefined}
					type={props.type ?? "text"}
					placeholder={props.placeholder ?? ""}
					value={value}
					onChange={(event: ChangeEvent<HTMLInputElement>) => {
						setValue(event.target.value);
						if (hasValidation && validateOn === "change") validate();
					}}
					onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
						if (event.key === "Enter") emit("submit");
					}}
					onFocus={() => emit("focus")}
					onBlur={() => {
						if (hasValidation && validateOn === "blur") validate();
						emit("blur");
					}}
				/>
				{errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
			</div>
		);
	};
}
