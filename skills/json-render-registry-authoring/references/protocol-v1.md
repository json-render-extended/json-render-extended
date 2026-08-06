# json-render-extended/v1

## Conventional provider item

Every participating registry may expose an item named `json-render-extended`. Its metadata uses the
`json-render-extended` key and the `json-render-extended/v1` protocol identifier.

### Package mode

Package mode points to a catalog module and one or more base-specific runtime modules. Consumers
resolve the runtime matching the base selected by their `components.json`.

### Installed-items mode

Installed-items mode advertises discovery but adds no catalog keys by itself. Installed components
leave project-local receipts containing their catalog and runtime module references. This prevents
a large configured registry from flooding the AI vocabulary.

## Resolution order

1. synchronized package catalog and selected base;
2. providers in `components.json` order;
3. installed-item receipts in deterministic filename order;
4. explicit application-local catalog and runtime overrides.

The final generated module must contain static imports. Remote registry source is installed only by
the user's shadcn workflow, never by JSON Render discovery.

