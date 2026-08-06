# Multi-base contract

The JSON Render catalog is portable; the headless primitive APIs are not.

| Base | Typical primitive composition | Important distinction |
| --- | --- | --- |
| Base UI | `render` and Base UI state | Render callbacks and state names follow Base UI. |
| React Aria | React Aria Components props and state | Selection and interaction props differ from Radix. |
| Radix | `asChild` and Radix primitives | Composition and controlled-state conventions are Radix-specific. |

Rules:

- Preserve stable JSON Render component keys and event names.
- Implement each adapter in its own file.
- Declare portable fallbacks as capabilities; do not present them as native upstream support.
- Keep business actions in the consuming application. Extension catalogs declare component events,
  not product-specific side effects.
- Let application tokens and CSS variables win. Registry selection must not inject a global theme.

