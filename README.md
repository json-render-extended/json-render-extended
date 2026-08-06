# json-render-extended

A monorepo for npm packages that extend [json-render](https://json-render.dev) with broader UI
registries, reusable catalogs, semantic assets, and repository-backed authoring workflows.

## Packages

| Package | Purpose | Changelog |
| --- | --- | --- |
| `@json-render-extended/core` | Extension protocol, dependency discovery, validation, and static composition | [History](packages/json-render-extended/CHANGELOG.md) |
| `@json-render-extended/shadcn` | Base UI, React Aria, and Radix shadcn registries | [History](packages/json-render-shadcn/CHANGELOG.md) |
| `@json-render-extended/icons` | Semantic `Icon` contract and optional icon-set adapters | [History](packages/json-render-icons/CHANGELOG.md) |
| `@json-render-extended/playground` | Repository specs, shared preview sessions, and materialization | [History](packages/json-render-playground/CHANGELOG.md) |

The packages are prepared for public publication under the `@json-render-extended` npm organization
and are versioned independently. The initial public release is tracked through Changesets.

The package families are:

- `@json-render-extended/core`, with the versioned extension protocol, direct-dependency discovery,
  project adapters, collision validation, and static module generation;
- `@json-render-extended/shadcn`, with shadcn/ui-backed component registries for Base UI, React Aria,
  and Radix;
- `@json-render-extended/icons`, with the shared JSON Render `Icon` contract, semantic index, and
  factories used to author icon-set adapters, plus optional `/lucide`, `/tabler`, `/hugeicons`,
  `/phosphor`, and `/remix` subpaths that reuse libraries already declared by the application.
- `@json-render-extended/playground`, with project-local specs, live user/agent iteration,
  development links, typed materialization, and runtime-or-static production resolution.

## Quick start

Install only the capabilities a project needs:

```bash
pnpm add @json-render-extended/core @json-render-extended/shadcn
```

Published APIs remain pre-1.0 and may change between minor releases. See each package README and
changelog before upgrading.

## Why this exists

The official `@json-render/shadcn` package currently bundles a Radix implementation and a
36-component catalog. This project extends that catalog to every synchronized shadcn source item
while making the primitive base explicit:

- `@json-render-extended/shadcn/base-ui`
- `@json-render-extended/shadcn/react-aria`
- `@json-render-extended/shadcn/radix`
- `@json-render-extended/shadcn/catalog`

Base UI is the default entry point, matching the current shadcn/ui default for new projects.

## Registry extension protocol

`@json-render-extended/shadcn` can use an application's existing `components.json` as its project
configuration. Its generator derives the selected primitive base and style, discovers a conventional
`json-render-extended` item in every configured shadcn registry, and writes one statically importable
catalog/runtime module.

This creates four deterministic layers:

- the synchronized shadcn catalog and selected base;
- the icon adapter detected from the application's declared icon-library dependency;
- compatible extension packages advertised by trusted shadcn registries and receipts left by
  installed registry items;
- application-local catalog and renderer overrides, applied last.

Registry authors use the standard shadcn registry item `meta` field to advertise the
`json-render-extended/v1` contract. They can therefore distribute UI files through shadcn while also
publishing the constrained component vocabulary an AI needs to use those files safely.

Registries can advertise npm-backed extensions directly or use `mode: "installed-items"`. The
second mode activates only components that the user installed and that left a receipt under
`lib/json-render-extended/manifests`, keeping large registries out of the AI catalog until selected.

## Styling contract

There are two supported styling modes.

The prebuilt Base UI, React Aria and Radix entry points are generated from the same shadcn style
(Nova by default). Their Tailwind classes are compiled into the synchronized component source.
Importing a registry never injects global CSS, adds a wrapper class or overwrites application tokens:
colors, radii and themes continue to come from the application's existing CSS variables.

Tailwind must scan the package because the prebuilt class names live in its JavaScript output. Import
the package integration entry point next to the application's existing Tailwind imports:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
@import "@json-render-extended/shadcn/tailwind.css";
```

The integration file only registers the compiled package output as a Tailwind source. It does not
ship tokens, global selectors, or visual defaults.

Applications that already own shadcn components should use the style-neutral factory instead:

```tsx
import { createShadcnComponents } from "@json-render-extended/shadcn/create-registry";
import { localShadcnPrimitives } from "./json-render-primitives";

const components = createShadcnComponents(localShadcnPrimitives, {
	base: "base-ui",
});
```

`localShadcnPrimitives` is a typed object made from the named exports in the application's own
`components/ui/*` files. This keeps the selected shadcn style, CSS variables and local component
changes. The base option is explicit because React Aria uses different state props from Base UI and
Radix. In this mode the package supplies only the JSON Render adapters; the local shadcn files remain
the source of truth for visual styling.

The sync lock records a checksum for every style currently published by shadcn (`vega`, `nova`,
`maia`, `lyra`, `mira`, `luma`, `rhea`, `sera`) and the style used for the prebuilt entries. A
different prebuilt style can be regenerated explicitly with
`pnpm sync:shadcn -- --style maia`.

The authored component matrix and style definitions are pinned to a shadcn commit. Resolved
style-specific component files come from shadcn's official registry endpoint and receive a checksum
per base. Consequently `sync:check` detects changes to both upstream style definitions and resolved
component output instead of silently replacing local or generated styles.

## Component matrices

Two matrices are intentionally separate:

- `implementedJsonRenderComponentNames` contains 68 callable JSON Render keys: every item in the
  upstream shadcn union plus the six JSON Render layout/content components that do not correspond to
  a shadcn source file.
- `shadcnRegistryCapabilities` mirrors the complete upstream shadcn source matrix. It currently has
  58 common source items, plus Base UI/Radix-only items and Base UI's `toast`.

All three exported React registries expose the same 68 keys, so the same JSON spec can switch base
at runtime. Where the upstream matrix has no native implementation, the adapter uses an explicit
portable fallback: `Toast` for every base and `HoverCard`, `Menubar` and `NavigationMenu` for React
Aria. `fallbackJsonRenderComponentNamesByBase` exposes that distinction programmatically.

Every public adapter has its own file. The generated source matrix remains separate because it
describes upstream implementation availability, while the JSON Render catalog describes the stable
portable API.

## Repository layout

```text
apps/
  docs/                       # Next.js presentation and documentation application
  registry/                   # Deployable shadcn-compatible registry service
examples/
  shadcn/
    next-static/              # Next.js with a checked-in JSON spec
    next-ai/                  # Next.js with AI-generated JSON Render specs
    svelte-static/            # Svelte with a checked-in JSON spec
    svelte-ai/                # Svelte with AI-generated JSON Render specs
packages/
  json-render-extended/       # Shared extension protocol and project composer
  json-render-icons/          # Generic Icon contract, discovery, and optional adapters
  json-render-playground/     # Repository specs, preview sessions, and materialization
  json-render-shadcn/         # Published npm package
skills/
  json-render-extensions/     # Compose and author generic extension packages
  json-render-icons/          # Detect and author semantic icon-set adapters
  json-render-shadcn/         # Configure the multi-base shadcn extension
  json-render-registry-authoring/ # Publish compatible external registry metadata
tooling/
  generate-agent-assets.mjs  # Build digest-verified well-known skill archives
  sync-shadcn.mjs             # Upstream synchronization and content drift check
```

## Development

```bash
pnpm install
pnpm skills:check
pnpm sync:check
pnpm check
pnpm build
pnpm pack:check
pnpm --filter @json-render-extended/registry dev
pnpm --filter @json-render-extended/docs dev
pnpm --filter @examples/shadcn-next-static dev
```

Biome owns both linting and formatting with tabs. `sync:check` exits non-zero when committed
generated shadcn sources differ from their recorded upstream state. Icon adapters derive their
valid names from the installed library, so the JSON Render layer follows that dependency version.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. User-visible package changes
need a Changeset so the release workflow can maintain independent versions and package changelogs.
Security reports follow [SECURITY.md](SECURITY.md); release mechanics are documented in
[RELEASING.md](RELEASING.md).

## Agent Skills

The repository publishes five portable Agent Skills: `json-render-extensions`,
`json-render-shadcn`, `json-render-icons`, `json-render-playground`, and
`json-render-registry-authoring`. They can be installed individually from the repository with
the `skills` CLI. The documentation build also packages the same sources as deterministic archives
under `/.well-known/agent-skills/`, with a SHA-256 digest for every artifact. No production domain or
application base path is embedded in those assets.

## Status

The repository is preparing its first public `0.1.0` release. The core composes self-describing
packages and local extensions into statically importable catalog and renderer surfaces. All 68
shadcn catalog keys are available
from all three React base entry points, including mappings for every item in the 62-item upstream
shadcn union. The icon core makes that extension protocol reusable. Its five built-in adapters read
valid names from the installed Lucide, Tabler, Hugeicons, Phosphor, or Remix package and add the
corresponding React implementation without making any visual library a required dependency. The
Svelte examples continue to use the native `@json-render/shadcn-svelte` catalog; the current shadcn
and icon runtime adapters are React specific.

## License

JSON Render Extended is licensed under the [Apache License 2.0](LICENSE). Generated and adapted
upstream source retains its original attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
and in the notices shipped with the affected npm packages.
