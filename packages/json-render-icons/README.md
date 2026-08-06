# @json-render-extended/icons

An extensible icon vocabulary for JSON Render. The root entry owns the stable `Icon` prop contract,
metadata normalization, semantic retrieval, runtime name validation, and AI-scoped catalog factory.
It does not import a visual icon library.

This package is part of the public
[json-render-extended](https://github.com/json-render-extended/json-render-extended) monorepo and is
versioned independently. Review the
[changelog](https://github.com/json-render-extended/json-render-extended/blob/main/packages/json-render-icons/CHANGELOG.md)
before upgrading.

Install the core as a direct dependency when the project should discover and compose the selected
icon set automatically:

```bash
pnpm add @json-render-extended/core @json-render-extended/icons
pnpm exec json-render-extended generate --output lib/json-render-extended.generated.ts
```

## Detect an existing icon library

The optional Node tooling reads the application's `package.json`. If it finds a supported library,
it resolves the corresponding catalog and renderer without requiring a separate JSON Render adapter
package:

```bash
pnpm exec json-render-icons detect
```

Built-in adapters are available for the icon libraries supported by shadcn:

| Selection | Application dependencies | JSON Render subpath |
| --- | --- | --- |
| `lucide` | `lucide-react` | `@json-render-extended/icons/lucide` |
| `tabler` | `@tabler/icons-react` | `@json-render-extended/icons/tabler` |
| `hugeicons` | `@hugeicons/react` and `@hugeicons/core-free-icons` | `@json-render-extended/icons/hugeicons` |
| `phosphor` | `@phosphor-icons/react` | `@json-render-extended/icons/phosphor` |
| `remix` | `@remixicon/react` | `@json-render-extended/icons/remix` |

With `@tabler/icons-react` selected, for example, generation points to:

```ts
import { tablerComponentDefinitions } from "@json-render-extended/icons/tabler/catalog";
import { tablerComponents } from "@json-render-extended/icons/tabler/react";
```

Every visual library is an optional peer: this package never installs one. Each adapter derives
valid names from the application's installed version, so schema validation and semantic metadata
remain aligned with it.

When multiple supported icon sets are declared, select the active adapter in the generic project
configuration:

```ts
import { defineConfig } from "@json-render-extended/core";

export default defineConfig({
	adapterOptions: {
		"@json-render-extended/icons": {
			iconSet: "tabler",
		},
	},
});
```

For read-only CLI inspection, the equivalent override is
`json-render-icons detect --icon-set <name>`.

When the core project adapter runs, an existing shadcn `components.json` may provide the same
preference through `iconLibrary`. Generic project configuration has precedence, `components.json`
is the fallback, and a single installed candidate can be selected automatically. Multiple installed
candidates without either preference produce an explicit ambiguity diagnostic.

## Define an icon set

Icon-set packages can reuse the same contract with `defineIconSet`:

```ts
import { defineIconSet } from "@json-render-extended/icons";

export const icons = defineIconSet({
	id: "acme",
	version: "1.0.0",
	names: ["check", "close"] as const,
	exampleName: "check",
	semantics: {
		check: { aliases: ["done", "success"], intents: ["confirm"] },
	},
});

export const componentDefinitions = icons.componentDefinitions;
export const searchIcons = icons.search;
```

The complete definition validates every name without enumerating the whole set in an AI prompt.
Before generation, use `search` and `createComponentDefinitions` to expose a small explicit enum
selected by user intent.

## Publish a self-describing icon package

An icon library can make its own JSON Render layer discoverable. Export a catalog and renderer,
then add this manifest to the library's `package.json`:

```json
{
	"json-render-extended": {
		"iconSet": {
			"protocol": "json-render-icons/v1",
			"name": "acme",
			"catalog": {
				"module": "@acme/icons/json-render/catalog",
				"export": "componentDefinitions"
			},
			"registries": {
				"react": {
					"module": "@acme/icons/json-render/react",
					"export": "components"
				}
			}
		}
	}
}
```

Project detection scans direct dependencies for this `json-render-icons/v1` manifest. The ecosystem
can therefore add icon sets without waiting for a new release of this package.

## Support and license

Use [GitHub Issues](https://github.com/json-render-extended/json-render-extended/issues) for public
bugs and adapter proposals. Report vulnerabilities privately. The package is Apache-2.0 licensed;
supported icon libraries retain their own terms, recorded in the `THIRD_PARTY_NOTICES.md` shipped
with every npm archive.
