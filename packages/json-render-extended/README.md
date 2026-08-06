# @json-render-extended/core

The protocol and build-time composer shared by JSON Render Extended packages. It lets libraries
publish constrained JSON Render catalogs and runtime registries that an application can discover
from its direct dependencies, compose with local extensions, validate, and import statically.

This package is part of the public
[json-render-extended](https://github.com/json-render-extended/json-render-extended) monorepo. Its
pre-1.0 API is versioned independently; review the
[changelog](https://github.com/json-render-extended/json-render-extended/blob/main/packages/json-render-extended/CHANGELOG.md)
before upgrading.

## Install

```bash
pnpm add @json-render-extended/core
```

Generate a project module before the application builds:

```bash
pnpm exec json-render-extended generate --output lib/json-render-extended.generated.ts
```

The generated module exports aggregate `componentDefinitions`, `actionDefinitions`, `components`,
and `actions`, plus typed `*ByExtension` maps, metadata, diagnostics, and required style entry points.
No remote source is executed and no dependency is installed during discovery.

## Publish a self-describing extension

Export a versioned descriptor from your package:

```ts
import { defineExtension } from "@json-render-extended/core";

export const extension = defineExtension({
	id: "@acme/json-render-charts",
	catalog: {
		components: {
			module: "@acme/json-render-charts/catalog",
			export: "componentDefinitions",
			keys: ["LineChart"],
		},
	},
	runtimes: {
		react: {
			components: {
				module: "@acme/json-render-charts/react",
				export: "components",
				keys: ["LineChart"],
			},
		},
	},
	styles: ["@acme/json-render-charts/styles.css"],
	capabilities: {
		description: "Constrained chart components for analytical interfaces.",
		tags: ["charts", "analytics"],
	},
});
```

Advertise it in the package manifest:

```json
{
	"exports": {
		"./extension": "./dist/extension.js"
	},
	"json-render-extended": {
		"protocol": "json-render-extended/v1",
		"extension": {
			"module": "@acme/json-render-charts/extension",
			"export": "extension"
		}
	}
}
```

Use an adapter instead of a fixed descriptor when the result depends on the consuming project. An
adapter receives the project root, runtime, package manifest, and environment. It may inspect local
configuration and return one or more descriptors, but should never install packages, mutate files,
or execute downloaded registry code.

## Add local extensions

Create `json-render-extended.config.ts` when an application needs local or explicitly imported
extensions:

```ts
import { defineConfig, defineExtension } from "@json-render-extended/core";

const localExtension = defineExtension({
	id: "local:product-ui",
	catalog: {
		components: {
			module: "./lib/product-ui.catalog",
			export: "componentDefinitions",
			keys: ["AccountSummary"],
		},
	},
	runtimes: {
		react: {
			components: {
				module: "./lib/product-ui.registry",
				export: "components",
				keys: ["AccountSummary"],
			},
		},
	},
});

export default defineConfig({
	runtime: "react",
	adapterOptions: {
		"@json-render-extended/icons": { iconSet: "tabler" },
	},
	extensions: [localExtension],
	strict: true,
});
```

`adapterOptions` is keyed by adapter id. It lets a project select package-specific behavior without
putting extension configuration in another tool's manifest.

Composition follows dependency order and then configuration order. Duplicate component or action
keys fail unless the later descriptor names them explicitly in `overrides`. `validate` checks package
registrations, adapters, configuration, and declared collisions; `inspect` prints the resolved model.

```bash
pnpm exec json-render-extended inspect
pnpm exec json-render-extended validate
```

## Support and license

Use [GitHub Issues](https://github.com/json-render-extended/json-render-extended/issues) for public
bugs and feature requests. Report vulnerabilities through the repository's private security
channel. The package is distributed under the Apache License 2.0, included in every npm archive.
