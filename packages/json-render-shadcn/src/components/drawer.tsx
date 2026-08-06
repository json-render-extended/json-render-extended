"use client";

import { type BaseComponentProps, useStateBinding } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createDrawerComponent(primitives: ShadcnPrimitiveSet) {
	const { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Drawer">>) => {
		const [open, setOpen] = useStateBinding<boolean>(props.openPath ?? "");

		return (
			<Drawer open={open ?? false} onOpenChange={setOpen}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{props.title}</DrawerTitle>
						{props.description && <DrawerDescription>{props.description}</DrawerDescription>}
					</DrawerHeader>
					<div className="p-4">{children}</div>
				</DrawerContent>
			</Drawer>
		);
	};
}
