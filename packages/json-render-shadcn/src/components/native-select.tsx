"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import type { ChangeEvent } from "react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createNativeSelectComponent(primitives: ShadcnPrimitiveSet) {
	const { Label, NativeSelect, NativeSelectOption } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"NativeSelect">>) => {
		const [value, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
		if (!NativeSelect || !NativeSelectOption) return <PrimitiveFallback name="NativeSelect" />;

		return (
			<div className="space-y-2">
				{props.label ? <Label>{props.label}</Label> : null}
				<NativeSelect
					disabled={props.disabled}
					onChange={(event: ChangeEvent<HTMLSelectElement>) => {
						setValue(event.target.value);
						emit("change");
					}}
					value={value ?? ""}
				>
					{props.placeholder ? (
						<NativeSelectOption disabled value="">
							{props.placeholder}
						</NativeSelectOption>
					) : null}
					{props.options.map((option) => (
						<NativeSelectOption disabled={option.disabled} key={option.value} value={option.value}>
							{option.label}
						</NativeSelectOption>
					))}
				</NativeSelect>
			</div>
		);
	};
}
