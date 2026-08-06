---
name: json-render-registry-authoring
description: Author and validate shadcn registries that extend JSON Render through the json-render-extended/v1 metadata protocol. Use when publishing a registry provider, packaging catalog and runtime modules, creating installed-item receipts, composing third-party shadcn blocks, or deciding between package and installed-items discovery modes.
license: Apache-2.0
compatibility: A shadcn-compatible registry and JSON Render catalog/runtime modules.
metadata:
  author: frnwtr
  version: "0.1.0"
---

# JSON Render registry authoring

Publish ordinary shadcn registry items and place JSON Render metadata in the standard registry item
`meta` field. The shadcn registry remains responsible for distributing files; the extension
metadata identifies the constrained catalog and runtime registry that an agent may use.

## Choose a provider mode

- Use `package` when an installable package already exports the catalog and base-specific runtime
  modules.
- Use `installed-items` for large registries or composed blocks. Only items the user installs should
  enter the project catalog.

Read [protocol v1](references/protocol-v1.md) before publishing. Start from
[`registry-provider.json`](templates/registry-provider.json) and
[`installed-item.json`](templates/installed-item.json).

## Authoring workflow

1. Keep the registry compatible with the upstream shadcn schema.
2. Serve a conventional `json-render-extended` provider item.
3. For installed-items mode, make each compatible installed item leave a receipt under
   `lib/json-render-extended/manifests`.
4. Export both component definitions and runtime components. The two modules form one contract.
5. Declare runtime modules per supported primitive base. Do not claim support that resolves to a
   missing module.
6. Validate the registry and run a consumer generation test with `--strict`.

## Security and provenance

Do not include credentials in registry output, generated files, diagnostics, or examples. Discovery
must parse metadata without executing fetched source. Record upstream source and licensing for
composed third-party items, and keep installation an explicit user action.
