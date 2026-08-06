# Svelte static shadcn example

This private example renders a checked-in JSON Render specification through the first-party Svelte
shadcn integration. It provides a framework comparison and is not published to npm.

```bash
pnpm --filter @examples/shadcn-svelte-static dev
```

The example runs on `http://localhost:3102`. The current JSON Render Extended shadcn runtime package
is React-specific; this example intentionally uses `@json-render/shadcn-svelte`.
