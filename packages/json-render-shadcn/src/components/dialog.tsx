"use client";

import { type BaseComponentProps, useStateBinding } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createDialogComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } = primitives;

	return ({ props, children }: BaseComponentProps<ShadcnProps<"Dialog">>) => {
		const [open, setOpen] = useStateBinding<boolean>(props.openPath ?? "");
		const content = (
			<>
				<DialogHeader>
					<DialogTitle>{props.title}</DialogTitle>
					{props.description && <DialogDescription>{props.description}</DialogDescription>}
				</DialogHeader>
				{children}
			</>
		);

		if (options.base === "react-aria") {
			return (
				<Dialog isOpen={open ?? false} onOpenChange={setOpen}>
					{content}
				</Dialog>
			);
		}

		const Content = DialogContent;
		return (
			<Dialog open={open ?? false} onOpenChange={setOpen}>
				{Content ? <Content>{content}</Content> : content}
			</Dialog>
		);
	};
}
