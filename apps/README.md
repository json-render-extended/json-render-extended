# Applications

`docs` is the official Next.js presentation and documentation application for the extension
ecosystem. Its page content is composed from JSON Render specifications and rendered with the
available extension packages themselves.

`registry` builds and serves the shadcn-compatible registry used to develop, verify, and deploy
ecosystem component bridges. Localhost is only its development default; deployments provide the
public registry origin through environment configuration.

Runnable, focused integration demonstrations continue to live in `examples/`.

Both applications are private workspace packages. They are deployed independently and are never
published to npm. Package source and release history live under `packages/`.
