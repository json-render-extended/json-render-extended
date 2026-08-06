"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useRef } from "react";

import { DocsIcon } from "@/components/docs-icon";

const ecosystemSections = [
	{ href: "/docs", label: "Overview" },
	{ href: "/docs/agents", label: "For AI agents" },
];

const coreSections = [
	{ href: "/docs/core", label: "Package overview" },
	{ href: "/docs/core/installation", label: "Installation" },
	{ href: "/docs/core/authoring", label: "Authoring an extension" },
	{ href: "/docs/core/composition", label: "Project composition" },
];

const iconSections = [
	{ href: "/docs/icons", label: "Package overview" },
	{ href: "/docs/icons/installation", label: "Installation" },
	{ href: "/docs/icons/icon-sets", label: "Icon sets" },
	{ href: "/docs/icons/discovery", label: "Project discovery" },
	{ href: "/docs/icons/authoring", label: "Authoring an icon set" },
];

const playgroundSections = [
	{ href: "/docs/playground", label: "Package overview" },
	{ href: "/docs/playground/storage", label: "Repository specs" },
	{ href: "/docs/playground/integrations", label: "Next.js and Svelte" },
	{ href: "/docs/playground/agent-api", label: "Agent API" },
];

const shadcnSections = [
	{ href: "/docs/shadcn", label: "Package overview" },
	{ href: "/docs/shadcn/installation", label: "Installation" },
	{ href: "/docs/shadcn/registry-extensions", label: "Registry extensions" },
	{ href: "/docs/shadcn/components", label: "Components" },
	{ href: "/docs/shadcn/actions", label: "Events and actions" },
	{ href: "/docs/shadcn/styling", label: "Styling" },
	{ href: "/docs/shadcn/synchronization", label: "Synchronization" },
];

const navigationGroups = [
	{
		label: "Extended",
		ariaLabel: "Documentation",
		sections: ecosystemSections,
	},
	{
		label: "Core package",
		ariaLabel: "Core package documentation",
		sections: coreSections,
	},
	{
		label: "Icon package",
		ariaLabel: "Icon package documentation",
		sections: iconSections,
	},
	{
		label: "Playground package",
		ariaLabel: "Playground package documentation",
		sections: playgroundSections,
	},
	{
		label: "shadcn package",
		ariaLabel: "shadcn package documentation",
		sections: shadcnSections,
	},
] as const;

function isCurrentPath(pathname: string, href: string) {
	const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
	const normalizedHref = href.replace(/\/+$/, "") || "/";

	return normalizedPathname === normalizedHref || normalizedPathname.endsWith(normalizedHref);
}

function DocsNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
	return (
		<>
			{navigationGroups.map((group, index) => (
				<Fragment key={group.label}>
					<p className={index === 0 ? undefined : "docs-sidebar-group"}>{group.label}</p>
					<nav aria-label={group.ariaLabel}>
						{group.sections.map((section) => {
							const isCurrent = isCurrentPath(pathname, section.href);

							return (
								<Link
									key={section.href}
									href={section.href}
									aria-current={isCurrent ? "page" : undefined}
									onClick={onNavigate}
								>
									{section.label}
								</Link>
							);
						})}
					</nav>
				</Fragment>
			))}
		</>
	);
}

export function DocsSidebar() {
	const pathname = usePathname();
	const mobileMenuRef = useRef<HTMLDetailsElement>(null);
	const currentPage = navigationGroups
		.flatMap((group) => group.sections.map((section) => ({ ...section, group: group.label })))
		.find((section) => isCurrentPath(pathname, section.href)) ?? {
		label: "Documentation",
		group: "All sections",
	};

	return (
		<aside className="docs-sidebar">
			<div className="docs-sidebar-navigation">
				<DocsNavigation pathname={pathname} />
			</div>
			<details className="docs-mobile-menu" ref={mobileMenuRef}>
				<summary
					aria-label={`Browse documentation. Current page: ${currentPage.group} / ${currentPage.label}`}
				>
					<span>Documentation</span>
					<small>
						{currentPage.group} / {currentPage.label}
					</small>
					<DocsIcon
						className="docs-mobile-menu-chevron"
						name="chevron-down"
						size="sm"
						strokeWidth={1.8}
					/>
				</summary>
				<div className="docs-mobile-menu-panel">
					<DocsNavigation
						pathname={pathname}
						onNavigate={() => mobileMenuRef.current?.removeAttribute("open")}
					/>
				</div>
			</details>
			<div className="sidebar-status">
				<span />
				<strong>4 packages available</strong>
				<small>More extension families planned</small>
			</div>
		</aside>
	);
}
