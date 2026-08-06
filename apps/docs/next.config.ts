import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined): string | undefined {
	if (!value || value === "/") return undefined;
	return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function configuredSitePath(): string | undefined {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
	if (!siteUrl) return undefined;
	try {
		return new URL(siteUrl).pathname;
	} catch {
		return undefined;
	}
}

const registryOrigin = (process.env.JR_EXT_REGISTRY_ORIGIN ?? "http://127.0.0.1:3210").replace(
	/\/+$/,
	"",
);
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? configuredSitePath());

const nextConfig: NextConfig = {
	...(basePath ? { basePath } : {}),
	transpilePackages: [
		"@json-render-extended/core",
		"@json-render-extended/icons",
		"@json-render-extended/playground",
		"@json-render-extended/shadcn",
	],
	rewrites() {
		return [
			{
				source: "/r/:path*",
				destination: `${registryOrigin}/r/:path*`,
			},
		];
	},
};

export default nextConfig;
