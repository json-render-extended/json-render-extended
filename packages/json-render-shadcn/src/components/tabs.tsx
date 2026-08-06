"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";
import { useState } from "react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createTabsComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Tabs, TabsList, TabsTrigger } = primitives;

	return ({ props, children, bindings, emit }: BaseComponentProps<ShadcnProps<"Tabs">>) => {
		const tabs = props.tabs ?? [];
		const [boundValue, setBoundValue] = useBoundProp<string>(
			props.value as string | undefined,
			bindings?.value,
		);
		const [localValue, setLocalValue] = useState(props.defaultValue ?? tabs[0]?.value ?? "");
		const isBound = Boolean(bindings?.value);
		const value = isBound ? (boundValue ?? tabs[0]?.value ?? "") : localValue;
		const setValue = isBound ? setBoundValue : setLocalValue;
		const handleChange = (nextValue: unknown) => {
			setValue(String(nextValue));
			emit("change");
		};

		const rootProps =
			options.base === "react-aria"
				? { selectedKey: value, onSelectionChange: handleChange }
				: { value, onValueChange: handleChange };

		return (
			<Tabs {...rootProps}>
				<TabsList>
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							{...(options.base === "react-aria" ? { id: tab.value } : { value: tab.value })}
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
				{children}
			</Tabs>
		);
	};
}
