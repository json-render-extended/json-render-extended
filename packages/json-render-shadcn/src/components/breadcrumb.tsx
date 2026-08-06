import type { BaseComponentProps } from "@json-render/react";
import { Fragment } from "react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createBreadcrumbComponent(primitives: ShadcnPrimitiveSet) {
	const {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator,
	} = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Breadcrumb">>) => {
		if (!Breadcrumb || !BreadcrumbItem || !BreadcrumbLink || !BreadcrumbList || !BreadcrumbPage) {
			return (
				<nav aria-label="Breadcrumb" data-shadcn-fallback="Breadcrumb">
					{props.items.map((item, index) => (
						<span key={`${item.href}-${item.label}`}>
							{index > 0 ? " / " : null}
							{item.active ? item.label : <a href={item.href}>{item.label}</a>}
						</span>
					))}
				</nav>
			);
		}

		return (
			<Breadcrumb>
				<BreadcrumbList>
					{props.items.map((item, index) => (
						<Fragment key={`${item.href}-${item.label}`}>
							{index > 0 && BreadcrumbSeparator ? <BreadcrumbSeparator /> : null}
							<BreadcrumbItem>
								{item.active ? (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		);
	};
}
