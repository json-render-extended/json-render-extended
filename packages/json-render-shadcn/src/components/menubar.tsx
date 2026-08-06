"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createMenubarComponent(primitives: ShadcnPrimitiveSet) {
	const { Button, Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Menubar">>) => {
		const [, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
		const select = (value: string) => {
			setValue(value);
			emit("select");
		};

		if (!Menubar || !MenubarContent || !MenubarItem || !MenubarMenu || !MenubarTrigger) {
			return (
				<nav aria-label="Application menu" className="flex gap-1" data-shadcn-fallback="Menubar">
					{props.menus.flatMap((menu) =>
						menu.items.map((item) => (
							<Button
								disabled={item.disabled}
								key={`${menu.label}-${item.value}`}
								onClick={() => select(item.value)}
								variant="ghost"
							>
								{menu.label}: {item.label}
							</Button>
						)),
					)}
				</nav>
			);
		}

		return (
			<Menubar>
				{props.menus.map((menu) => (
					<MenubarMenu key={menu.label}>
						<MenubarTrigger>{menu.label}</MenubarTrigger>
						<MenubarContent>
							{menu.items.map((item) => (
								<MenubarItem
									disabled={item.disabled}
									key={item.value}
									onSelect={() => select(item.value)}
								>
									{item.label}
								</MenubarItem>
							))}
						</MenubarContent>
					</MenubarMenu>
				))}
			</Menubar>
		);
	};
}
