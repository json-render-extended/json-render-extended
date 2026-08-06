"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import type { ChangeEvent } from "react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createInputGroupComponent(primitives: ShadcnPrimitiveSet) {
	const { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"InputGroup">>) => {
		const [value, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
		if (!InputGroup || !InputGroupInput) return <PrimitiveFallback name="InputGroup" />;

		return (
			<InputGroup>
				{InputGroupAddon && props.prefix ? (
					<InputGroupAddon align="inline-start">
						{InputGroupText ? <InputGroupText>{props.prefix}</InputGroupText> : props.prefix}
					</InputGroupAddon>
				) : null}
				<InputGroupInput
					disabled={props.disabled}
					onChange={(event: ChangeEvent<HTMLInputElement>) => {
						setValue(event.target.value);
						emit("change");
					}}
					placeholder={props.placeholder ?? undefined}
					type={props.type ?? "text"}
					value={value ?? ""}
				/>
				{InputGroupAddon && props.suffix ? (
					<InputGroupAddon align="inline-end">
						{InputGroupText ? <InputGroupText>{props.suffix}</InputGroupText> : props.suffix}
					</InputGroupAddon>
				) : null}
			</InputGroup>
		);
	};
}
