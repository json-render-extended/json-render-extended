---
name: json-render-icons
description: Configure or author icon-set adapters for @json-render-extended/icons. Use when a JSON Render React project should detect an installed icon library from package.json, build a semantic Icon catalog, retrieve a small intent-based shortlist, select among multiple icon sets, or let a third-party icon package self-describe its JSON Render catalog and renderer.
license: Apache-2.0
compatibility: Node.js 20 or newer and a project using JSON Render; React is required for React icon registries.
metadata:
  author: frnwtr
  version: "0.1.0"
---

# JSON Render icons

Use the lightweight core contract without installing an icon library on the user's behalf. Reuse a
supported dependency already declared by the application or an icon package that publishes the
`json-render-icons/v1` manifest.

## Inspect and detect

1. Read the nearest `package.json`.
2. Identify declared icon libraries in dependencies and peer dependencies.
3. Run detection from the project root:

```bash
pnpm exec json-render-icons detect --json
```

4. Read `json-render-extended.config.ts` when present. The value at
   `adapterOptions["@json-render-extended/icons"].iconSet` is the primary selection.
5. If no generic selection exists, use `components.json.iconLibrary` as a shadcn-specific fallback.
6. If detection remains ambiguous, ask the user to choose or use `--icon-set <name>` for read-only
   CLI inspection when intent is already explicit.
7. If `package.json` is missing or no adapter is found, report that state without installing a
   library automatically.

Built-in selections are `lucide`, `tabler`, `hugeicons`, `phosphor`, and `remix`. `components.json`
is not required for icon detection; it only provides a fallback preference for a shadcn project.

## Give AI a constrained vocabulary

Do not inject thousands of icon names into a model prompt. Search by natural-language intent and
build component definitions for the returned shortlist. Preserve accessible labels for meaningful
icons and mark purely visual icons as decorative.

## Author an icon-set adapter

Read [icon-set authoring](references/icon-set-authoring.md). Keep the generic contract in
`@json-render-extended/icons`; keep library dependencies and license obligations in the adapter or
icon-set package.

## Verify

Confirm that every advertised name is exported by the installed icon library version, tree shaking
still works, semantic search returns deterministic results, and the application formatter,
typecheck, and tests pass.
