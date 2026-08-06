# Next.js AI shadcn example

This private example streams an AI-generated JSON Render specification into the React shadcn
registry. It is built in public CI and is not published to npm.

Copy `.env.example` to `.env.local`, provide an OpenAI API key, and keep that file uncommitted:

```bash
pnpm --filter @examples/shadcn-next-ai dev
```

The example runs on `http://localhost:3101`. Never place real credentials in issues, logs,
screenshots, or committed example files.
