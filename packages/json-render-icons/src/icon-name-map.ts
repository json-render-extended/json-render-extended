export function componentNameToIconName(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.replace(/([A-Za-z])(\d+)/g, "$1-$2")
		.toLowerCase();
}

export function createIconNameMap(
	moduleExports: Readonly<Record<string, unknown>>,
	options: {
		isComponent: (exportName: string, value: unknown) => boolean;
		stripExportName: (exportName: string) => string;
	},
): ReadonlyMap<string, string> {
	const names = new Map<string, string>();
	for (const [exportName, value] of Object.entries(moduleExports)) {
		if (!options.isComponent(exportName, value)) continue;
		const name = componentNameToIconName(options.stripExportName(exportName));
		if (!names.has(name)) names.set(name, exportName);
	}
	return names;
}
