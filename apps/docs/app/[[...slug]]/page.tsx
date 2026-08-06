import { notFound } from "next/navigation";

import { generateMetadata, generateStaticParams, getPageData } from "@/lib/next-app";

import { DocsRenderer } from "./renderer";

export { generateMetadata, generateStaticParams };

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
	const data = await getPageData({ params });

	if (!data) {
		notFound();
	}

	return <DocsRenderer {...data} />;
}
