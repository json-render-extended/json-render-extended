# Icon-set authoring

An adapter defines valid names, semantic metadata, catalog definitions, and a runtime registry.

```ts
import { defineIconSet } from "@json-render-extended/icons";

export const acmeIconSet = defineIconSet({
	id: "acme",
	version: "1.0.0",
	names: ["check", "close", "warning"] as const,
	exampleName: "check",
	semantics: {
		check: { aliases: ["done", "success"], intents: ["confirm"] },
	},
});
```

An external icon package can self-describe the adapter in `package.json`:

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

Keep generated name metadata synchronized with the installed library version. Do not make the core
package depend on every supported icon library.

