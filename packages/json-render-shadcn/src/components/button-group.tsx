"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createButtonGroupComponent(primitives: ShadcnPrimitiveSet) {
	const { Button, ButtonGroup } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"ButtonGroup">>) => {
		const buttons = props.buttons ?? [];
		const [boundSelected, setBoundSelected] = useBoundProp<string>(
			props.selected as string | undefined,
			bindings?.selected,
		);
		const [localValue, setLocalValue] = useState(buttons[0]?.value ?? "");
		const isBound = Boolean(bindings?.selected);
		const value = isBound ? (boundSelected ?? "") : localValue;
		const setValue = isBound ? setBoundSelected : setLocalValue;

		return (
			<ButtonGroup>
				{buttons.map((button) => (
					<Button
						aria-pressed={value === button.value}
						key={button.value}
						onClick={() => {
							setValue(button.value);
							emit("change");
						}}
						variant={value === button.value ? "default" : "outline"}
					>
						{button.label}
					</Button>
				))}
			</ButtonGroup>
		);
	};
}
