import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DocsAppProvider, RegistryProvider } from "@/components/registry-provider";
import { SiteHeader } from "@/components/site-header";
import { withBasePath } from "@/lib/site-config";

import "./globals.css";

export const metadata: Metadata = {
	icons: {
		icon: withBasePath("/json-render-extended-logo.svg"),
	},
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" className="dark" data-scroll-behavior="smooth">
			<body>
				<RegistryProvider>
					<DocsAppProvider>
						<SiteHeader />
						{children}
					</DocsAppProvider>
				</RegistryProvider>
			</body>
		</html>
	);
}
