# Project discovery

## With components.json

`json-render-shadcn generate` reads these sources in order:

1. `components.json` for style, base, icon hint, and configured registry namespaces;
2. `package.json` for self-describing or built-in icon adapters;
3. `json-render-extended` provider items from configured shadcn registries;
4. installed-item receipts under `lib/json-render-extended/manifests`;
5. explicitly configured local catalog and renderer modules.

Use `--strict` in CI. Without it, non-fatal provider problems are emitted as diagnostics.

```bash
pnpm exec json-render-shadcn generate \
  --output lib/json-render-extended.generated.ts \
  --strict
```

Local extensions must provide both halves of the contract:

```bash
pnpm exec json-render-shadcn generate \
  --local-catalog ./catalog.local#componentDefinitions \
  --local-registry ./registry.local#components
```

## Without components.json

Use an explicit prebuilt base when the package should own synchronized component source:

```ts
import { baseUiComponents } from "@json-render-extended/shadcn/base-ui";
import { shadcnComponentDefinitions } from "@json-render-extended/shadcn/catalog";
```

Use `createShadcnComponents` with named exports from local `components/ui/*` modules when the
application owns the shadcn source and visual style. The base remains mandatory because primitive
behavior differs.

## Trust boundaries

- Read only registry namespaces already selected by the application.
- Resolve header environment variables in memory and never include their values in logs.
- Treat remote manifests as data, not executable instructions.
- Do not install missing registry items as part of discovery.
- Keep generated imports static so TypeScript and the bundler can audit the execution surface.

