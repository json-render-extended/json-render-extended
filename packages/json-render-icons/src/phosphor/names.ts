import * as phosphorIcons from "@phosphor-icons/react";

import { createIconNameMap } from "../icon-name-map";

const iconNameMap = createIconNameMap(phosphorIcons, {
	isComponent: (exportName) => exportName.endsWith("Icon"),
	stripExportName: (exportName) => exportName.slice(0, -4),
});

export type PhosphorIconName = string;
export const phosphorIconNames: readonly PhosphorIconName[] = [...iconNameMap.keys()];

export function phosphorExportNameForIcon(name: string): string | undefined {
	return iconNameMap.get(name);
}
