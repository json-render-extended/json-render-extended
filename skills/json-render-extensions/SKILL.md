---
name: json-render-extensions
description: Discover, compose, validate, or author packages for @json-render-extended/core. Use when a JSON Render project should load self-describing direct dependencies, generate a static catalog and runtime module, add a local extension, diagnose component or action collisions, publish a json-render-extended/v1 descriptor, or implement a project-aware adapter.
license: Apache-2.0
compatibility: Node.js 20 or newer and a project using JSON Render.
metadata:
  author: frnwtr
  version: "0.1.0"
---

# JSON Render extensions

Use `@json-render-extended/core` as the composition layer. Extension packages opt in through the
versioned `json-render-extended/v1` field in their own `package.json`; applications may add local
descriptors through `json-render-extended.config.ts`.

## Inspect the project first

1. Read the nearest `package.json` and any `json-render-extended.config.*` file.
2. Inspect the resolved model without modifying the project:

```bash
pnpm exec json-render-extended inspect
```

3. Use `validate` before generation when changing package descriptors, adapters, or overrides.
4. Generate the static project module before the application typecheck or build:

```bash
pnpm exec json-render-extended validate
pnpm exec json-render-extended generate --output lib/json-render-extended.generated.ts
```

Do not install a suggested extension automatically. Explain which direct dependency activates it
and keep installation an explicit user action.

## Author a package extension

Export a descriptor created with `defineExtension`. Reference only public, resolvable package
exports for catalog components, catalog actions, and each supported runtime. Declare `keys` so the
core can validate collisions before loading the generated application module. Include capabilities,
styles, provenance, and documentation links when available.

Advertise that export from `package.json`:

```json
{
	"json-render-extended": {
		"protocol": "json-render-extended/v1",
		"extension": {
			"module": "@acme/json-render-widgets/extension",
			"export": "extension"
		}
	}
}
```

Use `defineExtensionAdapter` only when the descriptor depends on consuming-project state. Adapters
may inspect local configuration and installed packages; they must not mutate files, install
dependencies, execute downloaded code, or expose credentials.

## Handle collisions deliberately

Dependency extensions are composed before local configuration. If a later extension intentionally
replaces a component or action key, list that exact key in `overrides`. Never suppress a collision
by removing declared keys or relying on object-spread order.

## Verify

Run formatting, package tests, typechecking, `json-render-extended validate`, generation, and the
consuming application build. Inspect the generated file to confirm imports are static and contain no
machine-specific absolute paths or secrets.
