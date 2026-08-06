import { resolve } from "node:path";

import type {
	ExtensionModuleReference,
	ExtensionSurfaceReference,
	ResolvedExtensionProject,
} from "@json-render-extended/core";

type ImportEntry = {
	alias: string;
	reference: ExtensionModuleReference | ExtensionSurfaceReference | undefined;
};

export function renderPlaygroundProjectModule(project: ResolvedExtensionProject) {
	const imports: string[] = [
		'import { defineCatalog } from "@json-render/core";',
		'import { defineRegistry } from "@json-render/react";',
		'import { schema } from "@json-render/react/schema";',
	];
	const entries: Array<{
		catalogComponents: string;
		catalogActions: string;
		runtimeComponents: string;
		runtimeActions: string;
	}> = [];

	for (const [index, extension] of project.extensions.entries()) {
		const runtime = extension.runtimes[project.runtime] ?? {};
		const entry = {
			catalogComponents: `extension${index}CatalogComponents`,
			catalogActions: `extension${index}CatalogActions`,
			runtimeComponents: `extension${index}RuntimeComponents`,
			runtimeActions: `extension${index}RuntimeActions`,
		};
		for (const item of [
			{ alias: entry.catalogComponents, reference: extension.catalog.components },
			{ alias: entry.catalogActions, reference: extension.catalog.actions },
			{ alias: entry.runtimeComponents, reference: runtime.components },
			{ alias: entry.runtimeActions, reference: runtime.actions },
		] satisfies ImportEntry[]) {
			imports.push(renderImport(item, project.cwd));
		}
		entries.push(entry);
	}

	const merge = (key: keyof (typeof entries)[number]) =>
		entries.map((entry) => `\t...${entry[key]},`).join("\n");

	return `${imports.join("\n")}

export const componentDefinitions = {
${merge("catalogComponents")}
};

export const actionDefinitions = {
${merge("catalogActions")}
};

export const components = {
${merge("runtimeComponents")}
};

export const actions = {
${merge("runtimeActions")}
};

export const catalog = defineCatalog(schema, {
\tcomponents: componentDefinitions,
\tactions: actionDefinitions,
});

export const registry = defineRegistry(catalog, { components, actions }).registry;
`;
}

function renderImport(entry: ImportEntry, cwd: string) {
	if (!entry.reference) return `const ${entry.alias} = {};`;
	const moduleName = moduleSpecifier(entry.reference.module, cwd);
	return entry.reference.export === "default"
		? `import ${entry.alias} from ${JSON.stringify(moduleName)};`
		: `import { ${entry.reference.export} as ${entry.alias} } from ${JSON.stringify(moduleName)};`;
}

function moduleSpecifier(moduleName: string, cwd: string) {
	if (!moduleName.startsWith(".") && !moduleName.startsWith("/")) return moduleName;
	const path = moduleName.startsWith("/") ? moduleName : resolve(cwd, moduleName);
	return `/@fs${path}`;
}
