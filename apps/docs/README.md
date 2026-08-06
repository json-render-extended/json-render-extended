# Documentation application

This Next.js application presents and documents the `json-render-extended` extension ecosystem.
Package documentation is nested by publishable family, beginning with
`@json-render-extended/shadcn` and `@json-render-extended/icons`. The icon package exposes optional
library adapters through subpaths such as `@json-render-extended/icons/lucide`.

The application is defined as a multi-route `NextAppSpec` and rendered through `@json-render/next`.
Routes, metadata, the documentation layout, and page content are JSON Render data; the selected
Base UI, React Aria, or Radix registry renders the UI. The component explorer also generates its
result grid as a JSON Render tree.

```sh
pnpm install
pnpm --filter @json-render-extended/docs dev
```

The docs expose the public registry path at `/r/{name}.json` and proxy it to the registry service.
They also publish `/llms.txt` and a digest-verified Agent Skills collection at
`/.well-known/agent-skills/index.json`.

Deployment is origin- and path-agnostic. `NEXT_PUBLIC_SITE_URL` may contain an optional pathname;
alternatively set `NEXT_PUBLIC_BASE_PATH` explicitly at build time. `JR_EXT_REGISTRY_ORIGIN` selects
the internal registry service without exposing that origin to consumers. Repository and skills
installation sources are independently configurable. Local defaults are documented in
`.env.example`.

For a production deployment, set a canonical public site URL and a reachable registry backend;
never expose registry authorization headers through `NEXT_PUBLIC_*` variables. Production builds
run spec resolution, extension generation, Agent Skill packaging, TypeScript validation, and the
Next.js build.

This is a private workspace application rather than an npm package. Contributions follow the
repository-wide [contribution guide](../../CONTRIBUTING.md), security policy, and Apache License
2.0.
