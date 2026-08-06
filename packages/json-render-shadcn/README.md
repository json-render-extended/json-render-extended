# @json-render-extended/shadcn

Multi-base shadcn/ui component registries for JSON Render, with Base UI, React Aria and Radix
implementations behind the same 68-component semantic catalog.

This package is part of the public
[json-render-extended](https://github.com/json-render-extended/json-render-extended) monorepo and is
versioned independently. Review the
[changelog](https://github.com/json-render-extended/json-render-extended/blob/main/packages/json-render-shadcn/CHANGELOG.md)
before upgrading.

```bash
pnpm add @json-render-extended/core @json-render-extended/shadcn @json-render/core @json-render/react zod
```

The package advertises its project adapter through `json-render-extended/v1`. The core composer
therefore detects it as a direct dependency, reads `components.json` when present, and generates the
selected base registry without a manual extension entry:

```bash
pnpm exec json-render-extended generate --output lib/json-render-extended.generated.ts
```

Base UI is the default:

```ts
import { shadcnComponents } from "@json-render-extended/shadcn";
```

Or select a base explicitly:

```ts
import { baseUiComponents } from "@json-render-extended/shadcn/base-ui";
import { reactAriaComponents } from "@json-render-extended/shadcn/react-aria";
import { radixComponents } from "@json-render-extended/shadcn/radix";
```

All three entry points expose the same component keys, so an application can switch registries at
runtime without changing the JSON spec.

The catalog maps every source item in the synchronized 62-item shadcn union and retains the six
additional layout/content components from JSON Render. Upstream omissions use documented portable
fallbacks. They are available at runtime through:

```ts
import { fallbackJsonRenderComponentNamesByBase } from "@json-render-extended/shadcn";
```

Catalog definitions are server-safe:

```ts
import { shadcnComponentDefinitions } from "@json-render-extended/shadcn/catalog";
```

## components.json and registry extensions

The Node-only `project` entry point reads the application's existing `components.json` for shadcn
style and registry configuration. Icon discovery is independent: it reads `package.json` and
selects the adapter for an installed library such as `lucide-react`. An optional `iconLibrary`
value only disambiguates projects that declare multiple icon sets. The generator then inspects every
configured shadcn namespace for a well-known `json-render-extended` item:

```json
{
	"style": "aria-nova",
	"iconLibrary": "lucide",
	"registries": {
		"@acme": "https://registry.acme.com/r/{name}.json"
	}
}
```

Generate a statically importable project module:

```bash
pnpm exec json-render-shadcn generate --strict
```

The generated `json-render-extended.generated.ts` exports `componentDefinitions`, `components`,
`iconComponentDefinitions`, `iconComponents`, `extensionComponentDefinitions`,
`extensionComponents`, and the resolved `shadcnProject` metadata. It starts with this package and
the selected icon adapter, applies compatible ecosystem extensions in `components.json` order, then
installed item receipts and explicitly configured local modules.

`components.json` is required only for the shadcn-aware base, style, and registry workflow. The icon
package can detect `package.json` or be composed directly with JSON Render.

Lucide is the built-in subpath adapter. Applications and future icon-set packages can extend the
resolver without changing the shared `Icon` contract:

```ts
import { generateShadcnProjectModule } from "@json-render-extended/shadcn/project";

await generateShadcnProjectModule({
	iconLibraries: {
		acme: {
			catalog: { module: "@acme/json-render-icons/catalog" },
			registry: { module: "@acme/json-render-icons/react" },
		},
	},
});
```

With `"iconLibrary": "acme"`, the generated module uses that explicit adapter. A package can also
publish a `json-render-icons/v1` manifest and be discovered automatically from the application's
dependencies.

```ts
import { defineCatalog } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import { componentDefinitions, components } from "./json-render-extended.generated";

export const catalog = defineCatalog(schema, {
	components: componentDefinitions,
	actions: {},
});

export const { registry } = defineRegistry(catalog, { components });
```

Applications can extend or override the result with local modules:

```bash
pnpm exec json-render-shadcn generate \
	--local-catalog ./src/catalog.local#componentDefinitions \
	--local-registry ./src/registry.local#components
```

For direct composition without code generation, use `extendShadcnComponentDefinitions` and
`extendShadcnComponents` from the `extend` entry point. Later maps win deterministically.

### Publishing an ecosystem extension

A shadcn registry opts in by publishing `json-render-extended.json` as a standard registry item.
Its `meta` field points to an npm package with the catalog and runtime components:

```json
{
	"$schema": "https://ui.shadcn.com/schema/registry-item.json",
	"name": "json-render-extended",
	"type": "registry:item",
	"dependencies": ["@acme/json-render"],
	"meta": {
		"json-render-extended": {
			"protocol": "json-render-extended/v1",
			"catalog": "@acme/json-render/catalog",
			"registries": {
				"base-ui": "@acme/json-render/base-ui",
				"react-aria": "@acme/json-render/react-aria",
				"radix": "@acme/json-render/radix"
			}
		}
	}
}
```

For registries that contain many independently installable items, publish a discovery provider:

```json
{
	"name": "json-render-extended",
	"type": "registry:item",
	"meta": {
		"json-render-extended": {
			"protocol": "json-render-extended/v1",
			"mode": "installed-items"
		}
	}
}
```

Each compatible UI item then installs a package-mode receipt under
`lib/json-render-extended/manifests`. The receipt points to the installed catalog and renderer
modules for each supported base. Only installed receipts are merged into the generated catalog.

Module references may also use `{ "module": "...", "export": "..." }`. The default export names
are `componentDefinitions` for catalogs and `components` for runtime registries. A manifest is only
activated when it supplies the base selected by `components.json`.

Discovery does not execute fetched code or add unconfigured registries. It only reads metadata from
namespaces the application already trusts, expands shadcn-compatible environment placeholders, and
writes static imports for TypeScript and the bundler to validate.

## Styling

The prebuilt registries contain the synchronized shadcn class names for the Nova style. They do not
import global CSS or set theme variables, so an application's existing shadcn colors, radius and
dark-mode tokens remain in control.

Import the package Tailwind integration so it can discover classes in the compiled output:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
@import "@json-render-extended/shadcn/tailwind.css";
```

The integration contains only an internal `@source` declaration. It does not provide theme tokens,
global selectors, or component CSS.

There is no required `style-*` wrapper class.

If the application already has customized shadcn components, use them directly through the
style-neutral factory:

```tsx
import { createShadcnComponents } from "@json-render-extended/shadcn/create-registry";
import { localShadcnPrimitives } from "./json-render-primitives";

export const components = createShadcnComponents(localShadcnPrimitives, {
	base: "react-aria",
});
```

`localShadcnPrimitives` is assembled from the named exports in the application's existing
`components/ui/*` files. This preserves its chosen shadcn style and every local component change;
the package contributes only the semantic JSON Render adapters.

The synchronization manifest tracks all currently available upstream styles and records checksums
for both their definitions and the resolved component sources used by the prebuilt registries.

## Support and license

Use [GitHub Issues](https://github.com/json-render-extended/json-render-extended/issues) for public
bugs, component mappings, and base-specific behavior. Report vulnerabilities privately. The package
is Apache-2.0 licensed and ships `LICENSE`, `THIRD_PARTY_NOTICES.md`, and the synchronized upstream
lock in every npm archive.
