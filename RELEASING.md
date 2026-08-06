# Releasing

Published packages use independent semantic versions and package-specific changelogs managed by
Changesets. Private applications and examples are never published.

## Normal release flow

1. User-visible package changes include a committed changeset.
2. CI validates synchronized sources, formatting, types, tests, builds, and npm archives.
3. On `main`, the release workflow opens or updates the `chore: release packages` pull request.
4. Review the generated versions, dependency ranges, and changelogs.
5. Merge the release pull request.
6. The same workflow publishes changed packages, creates Git tags and GitHub Releases, and records
   npm provenance.

The `npm` GitHub environment should be protected with required reviewers for public releases.

## First publication bootstrap

npm Trusted Publishing can be attached only after a package exists. For the first publication of
the four scoped packages, create a temporary granular npm automation token that can publish public
packages in the `@json-render-extended` organization and store it as the `NPM_TOKEN` repository or
`npm` environment secret. Merge the initial release pull request, verify the publication, then:

1. configure a GitHub Actions trusted publisher for each package;
2. select organization `json-render-extended`, repository `json-render-extended`, and workflow
   `release.yml`;
3. restrict the publisher to the `npm` environment when that environment is configured;
4. remove the temporary `NPM_TOKEN` secret and revoke the token.

Subsequent releases authenticate through GitHub OIDC. The workflow grants `id-token: write`, uses an
OIDC-capable npm 11 client, and requests package provenance.

## Local release checks

Before merging a release pull request, run:

```bash
pnpm release:check
pnpm changeset status
```

`release:check` does not publish. It validates the complete workspace and builds temporary tarballs
to ensure licenses, changelogs, exports, binaries, upstream locks, notices, and internal dependency
ranges are ready for npm. `changeset status` requires the repository to have an initial commit and a
reachable `main` branch; it is therefore expected to fail in a brand-new, uncommitted checkout.

Never run `changeset publish` from an unreviewed working tree.
