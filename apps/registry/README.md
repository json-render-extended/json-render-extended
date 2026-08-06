# Registry application

This private workspace app builds and serves the shadcn-compatible registry used by JSON Render
Extended. It supports local protocol testing and can be deployed as the public registry backend.

```bash
pnpm --filter @json-render-extended/registry dev
```

The development server is available at `http://127.0.0.1:3210/r/{name}.json`. A consumer can
configure the namespace in `components.json` and install the first bridge item:

```bash
pnpm exec shadcn add @jr-ext/code-block-composition-1 --cwd apps/docs
```

The item depends on the public Shadcnblocks composition and adds a catalog definition, a runtime
adapter, and an installed extension receipt under `lib/json-render-extended/manifests`.

The documentation app proxies its public `/r/{name}.json` path to this service. In deployment,
`JR_EXT_REGISTRY_ORIGIN` selects the registry backend without leaking that internal origin into the
consumer-facing URL.

Set `JR_EXT_REGISTRY_HOST` and `JR_EXT_REGISTRY_PORT` for the target runtime. A production host must
provide TLS, caching, health monitoring, and immutable responses for versioned registry items. Do
not place private registry credentials in generated JSON or committed configuration.

Registry items remain subject to their own upstream licenses and provider terms. See the root
[third-party notices](../../THIRD_PARTY_NOTICES.md) before adding or redistributing a composed item.
