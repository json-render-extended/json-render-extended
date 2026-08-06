import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createNavigationMenuComponent(primitives: ShadcnPrimitiveSet) {
	const { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"NavigationMenu">>) => {
		if (!NavigationMenu || !NavigationMenuItem || !NavigationMenuLink || !NavigationMenuList) {
			return (
				<nav aria-label="Primary" data-shadcn-fallback="NavigationMenu">
					<ul className="flex flex-wrap gap-2">
						{props.items.map((item) => (
							<li key={`${item.href}-${item.label}`}>
								<a aria-current={item.active ? "page" : undefined} href={item.href}>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
			);
		}

		return (
			<NavigationMenu>
				<NavigationMenuList>
					{props.items.map((item) => (
						<NavigationMenuItem key={`${item.href}-${item.label}`}>
							<NavigationMenuLink aria-current={item.active ? "page" : undefined} href={item.href}>
								<span>{item.label}</span>
								{item.description ? <small>{item.description}</small> : null}
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		);
	};
}
