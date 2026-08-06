function withoutTrailingSlash(value: string): string {
	return value.replace(/\/+$/, "");
}

function normalizeBasePath(value: string | undefined): string {
	if (!value || value === "/") return "";
	return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function basePathFromSiteUrl(value: string | undefined): string {
	if (!value) return "";
	try {
		return normalizeBasePath(new URL(value).pathname);
	} catch {
		return "";
	}
}

function applyBasePathToSiteUrl(value: string, basePath: string): string {
	const siteUrl = withoutTrailingSlash(value);
	if (!basePath) return siteUrl;
	try {
		const configuredPath = normalizeBasePath(new URL(siteUrl).pathname);
		if (!configuredPath) return `${siteUrl}${basePath}`;
		if (configuredPath !== basePath) {
			throw new Error(
				`NEXT_PUBLIC_SITE_URL pathname ${configuredPath} does not match NEXT_PUBLIC_BASE_PATH ${basePath}.`,
			);
		}
		return siteUrl;
	} catch (error) {
		if (error instanceof TypeError) return siteUrl;
		throw error;
	}
}

const deploymentHost =
	process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? "localhost:3000";

export const publicBasePath = normalizeBasePath(
	process.env.NEXT_PUBLIC_BASE_PATH ?? basePathFromSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
);

export const publicSiteUrl = applyBasePathToSiteUrl(
	process.env.NEXT_PUBLIC_SITE_URL ??
		(deploymentHost.startsWith("localhost")
			? `http://${deploymentHost}`
			: `https://${deploymentHost}`),
	publicBasePath,
);

export const publicRepositoryUrl = withoutTrailingSlash(
	process.env.NEXT_PUBLIC_REPOSITORY_URL ??
		"https://github.com/json-render-extended/json-render-extended",
);

export const publicSkillsSource =
	process.env.NEXT_PUBLIC_SKILLS_SOURCE ?? "json-render-extended/json-render-extended";

export function withBasePath(path: string): string {
	if (!path.startsWith("/") || path.startsWith("//") || !publicBasePath) return path;
	if (path === publicBasePath || path.startsWith(`${publicBasePath}/`)) return path;
	return path === "/" ? publicBasePath : `${publicBasePath}${path}`;
}

export function joinPublicUrl(path: string, baseUrl = publicSiteUrl): string {
	return `${withoutTrailingSlash(baseUrl)}/${path.replace(/^\/+/, "")}`;
}

export function resolvePublicSiteUrl(request: Request): string {
	if (process.env.NEXT_PUBLIC_SITE_URL) return publicSiteUrl;
	const requestUrl = new URL(request.url);
	const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
	const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
	const origin = forwardedHost
		? `${forwardedProtocol ?? requestUrl.protocol.replace(":", "")}://${forwardedHost}`
		: requestUrl.origin;
	return `${withoutTrailingSlash(origin)}${publicBasePath}`;
}

export const publicRegistryUrlTemplate = joinPublicUrl("/r/{name}.json");
export const publicAgentSkillsIndexUrl = joinPublicUrl("/.well-known/agent-skills/index.json");
export const publicLlmsTextUrl = joinPublicUrl("/llms.txt");
