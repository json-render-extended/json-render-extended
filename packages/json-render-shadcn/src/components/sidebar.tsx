"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createSidebarComponent(primitives: ShadcnPrimitiveSet) {
	const {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarProvider,
	} = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Sidebar">>) => {
		const [, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
		if (
			!Sidebar ||
			!SidebarContent ||
			!SidebarMenu ||
			!SidebarMenuButton ||
			!SidebarMenuItem ||
			!SidebarProvider
		) {
			return <PrimitiveFallback name="Sidebar" />;
		}

		const menu = (
			<SidebarMenu>
				{props.items.map((item) => (
					<SidebarMenuItem key={`${item.href}-${item.label}`}>
						<SidebarMenuButton
							data-href={item.href}
							isActive={item.active}
							onClick={() => {
								setValue(item.href);
								emit("select");
							}}
						>
							{item.label}
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		);

		return (
			<SidebarProvider defaultOpen={props.collapsible ?? true}>
				<Sidebar collapsible={props.collapsible === false ? "none" : "offcanvas"}>
					{SidebarHeader && props.title ? <SidebarHeader>{props.title}</SidebarHeader> : null}
					<SidebarContent>
						{SidebarGroup && SidebarGroupContent ? (
							<SidebarGroup>
								{SidebarGroupLabel && props.title ? (
									<SidebarGroupLabel>{props.title}</SidebarGroupLabel>
								) : null}
								<SidebarGroupContent>{menu}</SidebarGroupContent>
							</SidebarGroup>
						) : (
							menu
						)}
					</SidebarContent>
				</Sidebar>
			</SidebarProvider>
		);
	};
}
