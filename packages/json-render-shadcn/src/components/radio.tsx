"use client";

import { type BaseComponentProps, useBoundProp, useFieldValidation } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createRadioComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Label, RadioGroup, RadioGroupItem } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Radio">>) => {
		const values = props.options ?? [];
		const [boundValue, setBoundValue] = useBoundProp<string>(
			props.value as string | undefined,
			bindings?.value,
		);
		const [localValue, setLocalValue] = useState(values[0] ?? "");
		const isBound = Boolean(bindings?.value);
		const value = isBound ? (boundValue ?? "") : localValue;
		const setValue = isBound ? setBoundValue : setLocalValue;
		const validateOn = props.validateOn ?? "change";
		const hasValidation = Boolean(bindings?.value && props.checks?.length);
		const { errors, validate } = useFieldValidation(
			bindings?.value ?? "",
			hasValidation ? { checks: props.checks ?? [], validateOn } : undefined,
		);
		const handleChange = (nextValue: string) => {
			setValue(nextValue);
			if (hasValidation && validateOn === "change") validate();
			emit("change");
		};
		const groupProps =
			options.base === "react-aria"
				? { value, onChange: handleChange }
				: { value, onValueChange: handleChange };

		return (
			<div className="space-y-2">
				{props.label && <Label>{props.label}</Label>}
				<RadioGroup {...groupProps}>
					{values.map((option) => {
						const id = `${props.name}-${option}`;
						return (
							<div className="flex items-center space-x-2" key={option}>
								<RadioGroupItem id={id} value={option} />
								<Label className="cursor-pointer" htmlFor={id}>
									{option}
								</Label>
							</div>
						);
					})}
				</RadioGroup>
				{errors.length > 0 && <p className="text-destructive text-sm">{errors[0]}</p>}
			</div>
		);
	};
}
