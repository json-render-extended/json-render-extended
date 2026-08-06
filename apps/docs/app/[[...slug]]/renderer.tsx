"use client";

import { PageRenderer, type PageRendererProps } from "@json-render/next";

export function DocsRenderer(props: PageRendererProps) {
	return <PageRenderer {...props} />;
}
