"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createDropdownMenuComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } =
		primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"DropdownMenu">>) => {
		const [, setBoundValue] = useBoundProp<string>(
			props.value as string | undefined,
			bindings?.value,
		);
		const select = (value: string) => {
			setBoundValue(value);
			emit("select");
		};

		if (options.base === "react-aria") {
			return (
				<DropdownMenuTrigger>
					<Button variant="outline">{props.label}</Button>
					<DropdownMenu onAction={(key: unknown) => select(String(key))}>
						{(props.items ?? []).map((item) => (
							<DropdownMenuItem id={item.value} key={item.value}>
								{item.label}
							</DropdownMenuItem>
						))}
					</DropdownMenu>
				</DropdownMenuTrigger>
			);
		}

		const Content = DropdownMenuContent;
		return (
			<DropdownMenu>
				<DropdownMenuTrigger>{props.label}</DropdownMenuTrigger>
				{Content && (
					<Content>
						{(props.items ?? []).map((item) => (
							<DropdownMenuItem key={item.value} onSelect={() => select(item.value)}>
								{item.label}
							</DropdownMenuItem>
						))}
					</Content>
				)}
			</DropdownMenu>
		);
	};
}
