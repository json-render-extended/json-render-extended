# Examples

Examples are private workspace applications that demonstrate one published package family at a
time. They are built in CI but are never released to npm.

The shadcn examples cover Next.js and Svelte, with static and AI-assisted variants:

- `shadcn/next-static`
- `shadcn/next-ai`
- `shadcn/svelte-static`
- `shadcn/svelte-ai`

Run an example through its workspace name after installing repository dependencies. Keep examples
free of private registry credentials and production API keys; use their `.env.example` files when
environment configuration is required.

Published API documentation belongs in the relevant package README and changelog. Examples should
remain focused integration tests rather than becoming shared application infrastructure.
