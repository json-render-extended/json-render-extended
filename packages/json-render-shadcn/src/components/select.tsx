"use client";

import { type BaseComponentProps, useBoundProp, useFieldValidation } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createSelectComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Select">>) => {
		const [boundValue, setBoundValue] = useBoundProp<string>(
			props.value as string | undefined,
			bindings?.value,
		);
		const [localValue, setLocalValue] = useState("");
		const isBound = Boolean(bindings?.value);
		const value = isBound ? (boundValue ?? "") : localValue;
		const setValue = isBound ? setBoundValue : setLocalValue;
		const validateOn = props.validateOn ?? "change";
		const hasValidation = Boolean(bindings?.value && props.checks?.length);
		const { errors, validate } = useFieldValidation(
			bindings?.value ?? "",
			hasValidation ? { checks: props.checks ?? [], validateOn } : undefined,
		);
		const handleChange = (nextValue: unknown) => {
			setValue(String(nextValue));
			if (hasValidation && validateOn === "change") validate();
			emit("change");
		};
		const rootProps =
			options.base === "react-aria"
				? {
						selectedKey: value || null,
						onSelectionChange: handleChange,
						placeholder: props.placeholder ?? "Select…",
					}
				: { value, onValueChange: handleChange };

		return (
			<div className="space-y-2">
				<Label>{props.label}</Label>
				<Select {...rootProps}>
					<SelectTrigger className="w-full">
						<SelectValue
							{...(options.base === "react-aria"
								? {}
								: { placeholder: props.placeholder ?? "Select…" })}
						/>
					</SelectTrigger>
					<SelectContent>
						{(props.options ?? []).map((option) => (
							<SelectItem
								key={option}
								{...(options.base === "react-aria" ? { id: option } : { value: option })}
							>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.length > 0 && <p className="text-destructive text-sm">{errors[0]}</p>}
			</div>
		);
	};
}
