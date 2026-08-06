import * as remixIcons from "@remixicon/react";

import { createIconNameMap } from "../icon-name-map";

const iconNameMap = createIconNameMap(remixIcons, {
	isComponent: (exportName, value) => /^Ri[A-Z0-9]/.test(exportName) && typeof value === "function",
	stripExportName: (exportName) => exportName.slice(2),
});

export type RemixIconName = string;
export const remixIconNames: readonly RemixIconName[] = [...iconNameMap.keys()];

export function remixExportNameForIcon(name: string): string | undefined {
	return iconNameMap.get(name);
}
