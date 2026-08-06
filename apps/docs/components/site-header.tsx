import Link from "next/link";

import { BaseSwitcher } from "@/components/base-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { withBasePath } from "@/lib/site-config";

export function SiteHeader() {
	return (
		<header className="site-header">
			<div className="site-header-inner">
				<Link className="brand" href="/">
					<span
						className="brand-logo"
						aria-hidden="true"
						style={{
							maskImage: `url(${withBasePath("/json-render-extended-logo.svg")})`,
							WebkitMaskImage: `url(${withBasePath("/json-render-extended-logo.svg")})`,
						}}
					/>
					<span className="brand-wordmark">
						<strong>json-render</strong>
						<span>extended</span>
					</span>
				</Link>
				<nav className="main-nav" aria-label="Main navigation">
					<Link href="/docs">Docs</Link>
					<a href="https://json-render.dev" target="_blank" rel="noreferrer">
						JSON Render ↗
					</a>
				</nav>
				<div className="header-tools">
					<BaseSwitcher />
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
