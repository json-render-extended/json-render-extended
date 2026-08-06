"use client";

import { type BaseComponentProps, useBoundProp, useFieldValidation } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createSwitchComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Label, Switch } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Switch">>) => {
		const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
			props.checked as boolean | undefined,
			bindings?.checked,
		);
		const [localChecked, setLocalChecked] = useState(Boolean(props.checked));
		const isBound = Boolean(bindings?.checked);
		const checked = isBound ? (boundChecked ?? false) : localChecked;
		const setChecked = isBound ? setBoundChecked : setLocalChecked;
		const validateOn = props.validateOn ?? "change";
		const hasValidation = Boolean(bindings?.checked && props.checks?.length);
		const { errors, validate } = useFieldValidation(
			bindings?.checked ?? "",
			hasValidation ? { checks: props.checks ?? [], validateOn } : undefined,
		);
		const handleChange = (nextValue: boolean) => {
			setChecked(nextValue);
			if (hasValidation && validateOn === "change") validate();
			emit("change");
		};
		const switchProps =
			options.base === "react-aria"
				? { isSelected: checked, onChange: handleChange }
				: { checked, onCheckedChange: handleChange };

		return (
			<div className="space-y-1">
				<div className="flex items-center justify-between space-x-2">
					<Label className="cursor-pointer" htmlFor={props.name ?? undefined}>
						{props.label}
					</Label>
					<Switch id={props.name ?? undefined} {...switchProps} />
				</div>
				{errors.length > 0 && <p className="text-destructive text-sm">{errors[0]}</p>}
			</div>
		);
	};
}
