"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

function normalizeSelection(selection: unknown): string[] {
	if (selection instanceof Set) return [...selection].map(String);
	if (Array.isArray(selection)) return selection.map(String);
	return selection ? [String(selection)] : [];
}

export function createToggleGroupComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { ToggleGroup, ToggleGroupItem } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"ToggleGroup">>) => {
		const multiple = props.type === "multiple";
		const items = props.items ?? [];
		const [boundValue, setBoundValue] = useBoundProp<string>(
			props.value as string | undefined,
			bindings?.value,
		);
		const [localValue, setLocalValue] = useState(items[0]?.value ?? "");
		const isBound = Boolean(bindings?.value);
		const value = isBound ? (boundValue ?? "") : localValue;
		const setValue = isBound ? setBoundValue : setLocalValue;
		const selected = multiple ? value.split(",").filter(Boolean) : value ? [value] : [];
		const handleChange = (selection: unknown) => {
			const values = normalizeSelection(selection);
			const nextValue = multiple ? values.join(",") : (values[0] ?? "");
			if (!multiple && !nextValue) return;
			setValue(nextValue);
			emit("change");
		};

		const groupProps =
			options.base === "react-aria"
				? {
						selectionMode: multiple ? "multiple" : "single",
						selectedKeys: new Set(selected),
						onSelectionChange: handleChange,
					}
				: options.base === "base-ui"
					? { multiple, value: selected, onValueChange: handleChange }
					: {
							type: multiple ? "multiple" : "single",
							value: multiple ? selected : (selected[0] ?? ""),
							onValueChange: handleChange,
						};

		return (
			<ToggleGroup {...groupProps}>
				{items.map((item) => (
					<ToggleGroupItem
						key={item.value}
						{...(options.base === "react-aria" ? { id: item.value } : { value: item.value })}
					>
						{item.label}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		);
	};
}
