"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createToggleComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Toggle } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Toggle">>) => {
		const [boundPressed, setBoundPressed] = useBoundProp<boolean>(
			props.pressed as boolean | undefined,
			bindings?.pressed,
		);
		const [localPressed, setLocalPressed] = useState(props.pressed ?? false);
		const isBound = Boolean(bindings?.pressed);
		const pressed = isBound ? (boundPressed ?? false) : localPressed;
		const setPressed = isBound ? setBoundPressed : setLocalPressed;
		const handleChange = (nextValue: boolean) => {
			setPressed(nextValue);
			emit("change");
		};
		const toggleProps =
			options.base === "react-aria"
				? { isSelected: pressed, onChange: handleChange }
				: { pressed, onPressedChange: handleChange };

		return (
			<Toggle variant={props.variant ?? "default"} {...toggleProps}>
				{props.label}
			</Toggle>
		);
	};
}
