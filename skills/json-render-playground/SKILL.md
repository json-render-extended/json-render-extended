---
name: json-render-playground
description: Compose and iterate repository-backed JSON Render specs with @json-render-extended/playground. Use when an agent should create or edit a UI spec, share a live package renderer with the user, generate consumer-owned TypeScript, target an application or package in a monorepo, or add a development-only Next.js, React, or Svelte link to a specific spec.
license: Apache-2.0
compatibility: Node.js 20 or newer and a project using JSON Render Extended authoring providers.
metadata:
  author: frnwtr
  version: "0.1.0"
---

# JSON Render Extended playground

Use the playground as a repository-backed authoring loop shared by the agent and user. Specs are
the source artifacts; the browser is a preview and feedback surface.

## Inspect the target

1. Read the repository and nearest project instructions.
2. Identify the package manager and whether the target is a single application or a monorepo
   package/application.
3. Read the target `package.json`, `components.json` when present, and JSON Render Extended config.
4. Check whether `@json-render-extended/playground` and at least one extension authoring provider
   are already installed. Recommend an install command when absent; do not install silently.
5. Do not expose registry headers, environment values, or playground bearer tokens in durable files.

## Keep specs with their owner

The default directory is `json-render/specs` inside the selected target package:

- single application: `json-render/specs/<id>.json`
- monorepo application: `apps/<app>/json-render/specs/<id>.json`
- monorepo package: `packages/<package>/json-render/specs/<id>.json`

Use nested IDs such as `checkout/summary`. Select a monorepo target explicitly with `--project`.
Do not centralize unrelated package specs at the repository root.

## Start a shared authoring session

Run the package manager equivalent of:

```bash
pnpm exec json-render-playground \
	--project apps/web \
	--spec checkout/summary \
	--json
```

Omit `--project` in a single-package repository or when the current directory is already inside the
target package. Parse the one-line ready event; retain its URL, API URL, token, session ID, revision,
project root, and spec path only for the active local session.

## Choose the preview browser

1. Honor a browser explicitly selected by the user.
2. Otherwise use the agent's configured or default browser capability when one is available.
3. If no controllable browser exists, give the local URL to the user instead of installing or
   configuring browser software without permission.

Open the ready URL. A `spec` query parameter points the UI directly at a repository spec. Keep the
preview available to the user during iteration when the environment supports a visible browser.

## Edit through the API

Read the current state:

```text
GET /api/session
Authorization: Bearer <token>
```

Submit the full JSON source with optimistic concurrency:

```json
{
	"source": "{\n\t\"root\": \"surface\",\n\t\"elements\": {}\n}\n",
	"revision": 3
}
```

Use `PUT /api/session`. On `409`, read the returned current state, reconcile the user's changes,
and retry with the new revision. Do not automate the editor textarea when the API is available.

Only valid JSON is written to the repository. Invalid source remains session-only while the last
valid preview and TypeScript stay visible. Confirm that the response has `error: null` before
treating an edit as persisted.

Use `POST /api/session/open` with `specId` and `revision` to switch files. Use
`POST /api/session/specs` with `specId`, optional `presetId`, and `revision` to create one from a
provider preset.

## Iterate and hand off

1. Modify the smallest coherent spec revision.
2. Confirm the live render and generated TypeScript after each valid change.
3. Let extension providers own code generation. For shadcn, layout vocabulary becomes native HTML,
   and component/icon imports must point to the consuming project and its installed libraries.
4. Apply generated code to the user's requested destination only when implementation is in scope.
5. Run the repository formatter, typecheck, and relevant tests after applying code.

When the user wants a durable component, materialize it instead of copying code from the browser:

```bash
pnpm exec json-render-playground materialize \
	--project apps/web \
	--spec checkout/summary \
	--output components/generated/checkout-summary.tsx
```

The generated file carries the spec ID, provider, and source digest. The versioned receipt under
`json-render/materializations/<spec-id>.json` records every output. Treat generated files as owned
artifacts: put manual behavior and styling overrides in a wrapper rather than breaking the link.
Do not infer a JSON spec back from edited TypeScript; that transform is not lossless.

Before handing off materialized code, run:

```bash
pnpm exec json-render-playground check --project apps/web
```

Resolve any reported spec drift, output drift, or missing file by regenerating from the canonical
spec. Do not update receipt hashes to conceal manual edits.

## Expose dynamic component props

Use `state.props` as the public prop defaults and reference those fields with JSON Render's native
`$state` expression, for example `{ "$state": "/props/title" }`. Do not replace the expression with
a literal during materialization. The provider must generate a typed component prop and preserve the
declared value as its fallback.

## Resolve runtime and materialized specs at build time

Run the project-local resolver generator after specs and materializations are ready:

```bash
pnpm exec json-render-playground build \
	--project apps/web \
	--output json-render/specs.ts
```

A current materialization receipt opts that spec into a static component import. Specs without a
receipt stay as runtime JSON Render specs. Stale receipts must produce a diagnostic and runtime
fallback. Do not pass `--refresh-materialized` unless the user explicitly wants generated outputs
regenerated, because it overwrites those outputs.

In React or Next.js, render by spec ID through `JsonRenderSpec` from
`@json-render-extended/playground/runtime`. Pass the generated entries, application registry, public
props, and optional playground URL. Keep this call site stable when a spec changes production mode.

## Add an application-local development link

For Next.js or React, use `@json-render-extended/playground/react`. For Svelte, use
`@json-render-extended/playground/svelte`. Pass the session URL through a development environment
variable, a repository spec ID, and an optional fixed position. These components render only in
development; never hard-code the session token or URL in committed source.
