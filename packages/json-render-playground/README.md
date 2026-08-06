# @json-render-extended/playground

Repository-backed authoring for JSON Render Extended extensions. The playground gives a user and
an AI agent the same revisioned session while keeping valid specs as ordinary JSON files in the
target package or application.

This package is part of the public
[json-render-extended](https://github.com/json-render-extended/json-render-extended) monorepo and is
versioned independently. Review the
[changelog](https://github.com/json-render-extended/json-render-extended/blob/main/packages/json-render-playground/CHANGELOG.md)
before upgrading.

## Start a target project

Single-package repository:

```bash
json-render-playground --spec landing-page
```

Monorepo:

```bash
json-render-playground --project apps/web --spec landing-page
```

Specs are created under `json-render/specs` in the selected package by default. Use `--spec-dir`
to opt into another project-local directory. Invalid editor contents remain session-only; the file,
preview, and TypeScript output keep the last valid revision.

The command binds to `127.0.0.1`, creates a random bearer token, and prints the UI and API URLs. Use
`--json` when another tool or agent needs to consume that startup information.

## Next.js or React development link

```tsx
import { JsonRenderPlaygroundLink } from "@json-render-extended/playground/react";

export function DevelopmentTools() {
	return (
		<JsonRenderPlaygroundLink
			href={process.env.NEXT_PUBLIC_JSON_RENDER_PLAYGROUND_URL}
			position="bottom-right"
			spec="checkout/summary"
		/>
	);
}
```

The link renders only in development and opens the requested repository spec directly.

## Svelte development link

```svelte
<script lang="ts">
	import JsonRenderPlaygroundLink from "@json-render-extended/playground/svelte";
</script>

<JsonRenderPlaygroundLink
	href={PUBLIC_JSON_RENDER_PLAYGROUND_URL}
	position="bottom-right"
	spec="checkout/summary"
/>
```

Authoring providers come from installed extensions. For example,
`@json-render-extended/shadcn` contributes package-owned presets and generates TypeScript that
imports the consuming application's shadcn aliases and selected icon library.

## Materialize a spec

```bash
json-render-playground materialize \
	--project apps/web \
	--spec checkout/summary \
	--output components/generated/checkout-summary.tsx
```

The generated component embeds its spec ID, provider, and source digest. A versioned receipt at
`json-render/materializations/<spec-id>.json` links the source spec to one or more generated outputs.
Regenerate generated files instead of editing them directly; put application customizations in a
stable wrapper component.

Verify all spec-to-component links in local checks or CI:

```bash
json-render-playground check --project apps/web
```

The command fails when the source spec changed, a generated output was edited, or either side of the
link is missing.

## Public props and production resolution

Declare component inputs under `state.props`, then reference them with JSON Render's native
`$state` expression:

```json
{
	"state": {
		"props": {
			"title": "Order summary"
		}
	},
	"elements": {
		"title": {
			"type": "Heading",
			"props": {
				"text": { "$state": "/props/title" },
				"level": "h2"
			}
		}
	}
}
```

At runtime, passed props override the defaults in `state.props`. Materialized TypeScript exposes the
same fields as typed component props and preserves the spec defaults as fallbacks.

Generate one project-local resolver module during a build:

```bash
json-render-playground build \
	--project apps/web \
	--output json-render/specs.ts
```

Materialization is opt-in per spec. A current receipt selects the generated application component;
a spec without a receipt remains embedded JSON rendered through the application's registry. A stale
receipt falls back to runtime JSON and emits a diagnostic. The build command does not overwrite
materialized components unless `--refresh-materialized` is explicitly passed.

```tsx
import { JsonRenderSpec } from "@json-render-extended/playground/runtime";

import { jsonRenderSpecs } from "@/json-render/specs";
import { registry } from "@/lib/json-render";

export function CheckoutSummary({ title }: { title: string }) {
	return (
		<JsonRenderSpec
			entries={jsonRenderSpecs}
			registry={registry}
			spec="checkout/summary"
			props={{ title }}
			playground={{
				href: process.env.NEXT_PUBLIC_JSON_RENDER_PLAYGROUND_URL,
				position: "bottom-right",
			}}
		/>
	);
}
```

The call site remains unchanged when the spec moves between runtime and materialized modes. The
optional playground link renders only in development.

## Security and support

The playground binds to loopback by default and uses a random bearer token, but it is still a local
development service rather than a multi-tenant production host. Do not expose it directly to the
public internet or commit session URLs and tokens.

Use [GitHub Issues](https://github.com/json-render-extended/json-render-extended/issues) for public
bugs and feature requests. Report vulnerabilities privately. The package is distributed under the
Apache License 2.0, included in every npm archive.
