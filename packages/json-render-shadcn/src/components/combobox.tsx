"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createComboboxComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } =
		primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Combobox">>) => {
		const [boundValue, setBoundValue] = useBoundProp<string>(
			props.value ?? undefined,
			bindings?.value,
		);
		const [localValue, setLocalValue] = useState(props.value ?? "");
		const value = bindings?.value ? (boundValue ?? "") : localValue;
		const change = (next: unknown) => {
			const nextValue = next == null ? "" : String(next);
			if (bindings?.value) setBoundValue(nextValue);
			else setLocalValue(nextValue);
			emit("change");
		};

		if (!Combobox || !ComboboxContent || !ComboboxInput || !ComboboxItem || !ComboboxList) {
			return <PrimitiveFallback name="Combobox" />;
		}

		const rootProps =
			options.base === "react-aria"
				? { selectedKey: value || null, onSelectionChange: change, isDisabled: props.disabled }
				: { value, onValueChange: change, disabled: props.disabled };

		return (
			<Combobox {...rootProps}>
				<ComboboxInput disabled={props.disabled} placeholder={props.placeholder ?? "Search…"} />
				<ComboboxContent>
					<ComboboxList>
						{props.items.map((item) => (
							<ComboboxItem
								key={item.value}
								{...(options.base === "react-aria" ? { id: item.value } : { value: item.value })}
								isDisabled={options.base === "react-aria" ? item.disabled : undefined}
								disabled={options.base === "react-aria" ? undefined : item.disabled}
							>
								{item.label}
							</ComboboxItem>
						))}
					</ComboboxList>
					{ComboboxEmpty ? <ComboboxEmpty>{props.emptyText ?? "No results."}</ComboboxEmpty> : null}
				</ComboboxContent>
			</Combobox>
		);
	};
}
