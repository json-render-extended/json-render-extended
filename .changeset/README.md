# Changesets

Every pull request that changes a published package should include a changeset unless the change is
documentation-only, test-only, or otherwise has no user-visible release impact.

Create one interactively:

```bash
pnpm changeset
```

Choose each affected package, select the appropriate semantic version bump, and write a concise
user-facing summary. Package changelogs are generated from these files by the release workflow.

The packages use independent versions. Changesets also updates affected internal dependency ranges
when a package such as `core` is released.
