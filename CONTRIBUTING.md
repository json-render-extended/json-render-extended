# Contributing

Thank you for contributing to JSON Render Extended. The repository is a public pnpm monorepo with
independently versioned packages, private applications, runnable examples, and portable Agent
Skills.

## Development setup

Requirements:

- Node.js 20.19 or newer;
- pnpm 9.15.9 through the repository `packageManager` declaration;
- Git.

Install and validate the workspace:

```bash
pnpm install
pnpm sync:check
pnpm check
pnpm build
```

Biome owns formatting and linting. TypeScript and JavaScript use tabs. Formats that prohibit tabs,
including YAML, retain their required syntax.

## Generated and synchronized files

Do not hand-edit generated shadcn sources. Run `pnpm sync:shadcn` only when intentionally updating
the pinned upstream revision, then review the generated source, checksums, upstream lock, and
third-party attribution together.

Generated JSON Render project modules and materialized playground components must remain linked to
their source specs and receipts. Do not update digests merely to hide source or output drift.

## Changesets and changelogs

Add a changeset for every user-visible change to a published package:

```bash
pnpm changeset
```

Select only the affected packages, choose the semantic version bump, and write a concise release
summary. Documentation-only, test-only, example-only, and private-application changes normally do
not need a changeset. The release workflow converts accumulated changesets into package versions
and package-specific `CHANGELOG.md` entries.

## Pull requests

Keep changes focused and include the commands used to verify them. Published-package changes should
also pass:

```bash
pnpm pack:check
```

Do not commit credentials, registry authorization headers, playground tokens, generated environment
values, or npm publishing tokens.

By submitting a contribution, you agree that it is licensed under the repository's Apache License
2.0.
