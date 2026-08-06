"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createSliderComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Label, Slider } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Slider">>) => {
		const [boundValue, setBoundValue] = useBoundProp<number>(
			props.value as number | undefined,
			bindings?.value,
		);
		const [localValue, setLocalValue] = useState(props.min ?? 0);
		const isBound = Boolean(bindings?.value);
		const value = isBound ? (boundValue ?? props.min ?? 0) : localValue;
		const setValue = isBound ? setBoundValue : setLocalValue;
		const handleChange = (nextValue: number | number[]) => {
			setValue(Array.isArray(nextValue) ? (nextValue[0] ?? 0) : nextValue);
			emit("change");
		};
		const sliderProps =
			options.base === "react-aria"
				? { value, onChange: handleChange }
				: { value: [value], onValueChange: handleChange };

		return (
			<div className="space-y-2">
				{props.label && (
					<div className="flex justify-between">
						<Label className="text-sm">{props.label}</Label>
						<span className="text-muted-foreground text-sm">{value}</span>
					</div>
				)}
				<Slider
					maxValue={options.base === "react-aria" ? (props.max ?? 100) : undefined}
					minValue={options.base === "react-aria" ? (props.min ?? 0) : undefined}
					step={props.step ?? 1}
					{...(options.base === "react-aria"
						? sliderProps
						: { ...sliderProps, min: props.min ?? 0, max: props.max ?? 100 })}
				/>
			</div>
		);
	};
}
