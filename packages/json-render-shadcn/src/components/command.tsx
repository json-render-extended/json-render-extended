"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createCommandComponent(primitives: ShadcnPrimitiveSet) {
	const {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandShortcut,
	} = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Command">>) => {
		const [, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
		if (!Command || !CommandGroup || !CommandInput || !CommandItem || !CommandList) {
			return <PrimitiveFallback name="Command" />;
		}

		return (
			<Command>
				<CommandInput placeholder={props.placeholder ?? "Type a command…"} />
				<CommandList>
					{CommandEmpty ? <CommandEmpty>{props.emptyText ?? "No results."}</CommandEmpty> : null}
					<CommandGroup>
						{props.items.map((item) => (
							<CommandItem
								disabled={item.disabled}
								key={item.value}
								onSelect={() => {
									setValue(item.value);
									emit("select");
								}}
								value={item.value}
							>
								{item.label}
								{CommandShortcut && item.shortcut ? (
									<CommandShortcut>{item.shortcut}</CommandShortcut>
								) : null}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		);
	};
}
