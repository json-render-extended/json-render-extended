import { joinPublicUrl, publicRepositoryUrl, resolvePublicSiteUrl } from "@/lib/site-config";

export function GET(request: Request) {
	const siteUrl = resolvePublicSiteUrl(request);
	const link = (path: string) => joinPublicUrl(path, siteUrl);
	const content = `# JSON Render Extended

> Extension packages, registries, and Agent Skills that add constrained UI and icon vocabularies to JSON Render.

## Documentation

- [Overview](${link("/docs")}): Architecture and available extension families.
- [AI agents](${link("/docs/agents")}): Agent Skills, discovery, and trust boundaries.
- [Core package](${link("/docs/core")}): Extension protocol, dependency discovery, and static composition.
- [Authoring an extension](${link("/docs/core/authoring")}): Self-describing package and adapter contract.
- [Project composition](${link("/docs/core/composition")}): Local configuration, overrides, and generated surfaces.
- [shadcn package](${link("/docs/shadcn")}): Base UI, React Aria, and Radix component registries.
- [Icon package](${link("/docs/icons")}): Stable Icon contract and semantic registries.
- [Icon package installation](${link("/docs/icons/installation")}): Core, peer, catalog, and renderer setup.
- [Icon sets](${link("/docs/icons/icon-sets")}): Built-in Lucide support and the shared adapter model.
- [Icon project discovery](${link("/docs/icons/discovery")}): Safe package.json-based detection.
- [Authoring an icon set](${link("/docs/icons/authoring")}): Versioned protocol for ecosystem packages.

## Machine-readable resources

- [Agent Skills index](${link("/.well-known/agent-skills/index.json")}): Installable Agent Skills with integrity digests.
- [shadcn registry](${link("/r/registry.json")}): Public shadcn-compatible registry index.
- [JSON Render extension provider](${link("/r/json-render-extended.json")}): Registry discovery metadata.

## Source

- [Repository](${publicRepositoryUrl}): Packages, skills, examples, registry, and documentation sources.
`;

	return new Response(content, {
		headers: {
			"cache-control": "public, max-age=300",
			"content-type": "text/markdown; charset=utf-8",
		},
	});
}
