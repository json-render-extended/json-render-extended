import { createNextApp } from "@json-render/next/server";

import { applicationSpec } from "@/lib/application-spec";

export const { generateMetadata, generateStaticParams, getPageData } = createNextApp({
	spec: applicationSpec,
});
