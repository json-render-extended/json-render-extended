import * as coreFreeIcons from "@hugeicons/core-free-icons";

import { createIconNameMap } from "../icon-name-map";

const iconNameMap = createIconNameMap(coreFreeIcons, {
	isComponent: (exportName) => exportName.endsWith("Icon") && !exportName.endsWith("FreeIcons"),
	stripExportName: (exportName) => exportName.slice(0, -4),
});

export type HugeiconsIconName = string;
export const hugeiconsIconNames: readonly HugeiconsIconName[] = [...iconNameMap.keys()];

export function hugeiconsExportNameForIcon(name: string): string | undefined {
	return iconNameMap.get(name);
}
