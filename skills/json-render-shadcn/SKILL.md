---
name: json-render-shadcn
description: Configure and extend @json-render-extended/shadcn for Base UI, React Aria, or Radix. Use when a JSON Render React project needs shadcn components, when components.json must drive the selected base and registry discovery, when generating a bundler-safe project module, or when composing local component catalogs without replacing application-owned styles.
license: Apache-2.0
compatibility: Node.js 20 or newer and a React project using JSON Render.
metadata:
  author: frnwtr
  version: "0.1.0"
---

# JSON Render shadcn

Use this skill for the multi-base JSON Render extension. For general `@json-render/core`, React
renderer, or AI streaming questions, prefer the matching first-party JSON Render documentation or
skill.

## Inspect before changing anything

1. Read the nearest `package.json` and determine the package manager.
2. Look for `components.json` in the project root.
3. Read any generated JSON Render project module and
   `lib/json-render-extended/manifests/*.json` receipts.
4. Inspect local `components/ui/*` files before choosing prebuilt components over application-owned
   primitives.
5. Never print registry authorization headers or expand unresolved environment variables.

Read [project discovery](references/project-discovery.md) when choosing between generated,
prebuilt, and local-component workflows. Read
[the multi-base contract](references/multi-base-contract.md) before mapping component behavior.

## Choose the workflow

### Project has components.json

Treat it as the source of truth for the shadcn style, primitive base, icon library hint, and trusted
registry namespaces. Generate a static module:

```bash
pnpm exec json-render-shadcn generate --strict
```

The generator may inspect compatible metadata from configured registries and installed-item
receipts. It must not add registries, install items, or execute fetched source code.

### Project has no components.json

Do not invent one silently. For package-owned styling, import an explicit prebuilt registry from
`@json-render-extended/shadcn/base-ui`, `/react-aria`, or `/radix`. For application-owned styling,
create a registry from the local component files and require the base to be explicit.

Only suggest initializing shadcn when registry discovery or local shadcn ownership is actually
needed, and obtain user approval before installing or generating files.

## Extend the catalog locally

Apply application-local definitions and renderers last so the application may intentionally
override ecosystem keys. Keep one component adapter per file. Do not pretend Base UI, React Aria,
and Radix expose the same primitive API; normalize only the public JSON Render contract.

## Verify

Run the repository's formatter, typecheck, and tests. If generation is used, verify that the emitted
module contains static imports and that diagnostics identify invalid or unreachable providers.

When the user wants an iterative composition and preview loop, use the `json-render-playground`
skill. The shadcn package contributes the authoring preset and consumer-owned TypeScript generator;
the generic playground owns repository spec persistence, sessions, API access, and browser handoff.
