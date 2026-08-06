import { createIconComponentDefinitions, createScopedIconComponentDefinitions } from "./catalog";
import { createIconMetadataIndex, type DefineIconSetOptions } from "./metadata";

export {
	createIconComponentDefinitions,
	createIconDefinition,
	createScopedIconComponentDefinitions,
	createScopedIconDefinition,
	type IconDefinitionOptions,
	type IconProps,
	type IconSizeName,
	iconSizeNames,
} from "./catalog";
export {
	createIconMetadataIndex,
	type DefineIconSetOptions,
	type IconMetadata,
	type IconMetadataIndex,
	type IconMetadataIndexOptions,
	type IconSearchResult,
	type IconSemantics,
	type SearchIconsOptions,
} from "./metadata";

export function defineIconSet<Name extends string, Category extends string = string>(
	options: DefineIconSetOptions<Name, Category>,
) {
	const index = createIconMetadataIndex(options);
	return {
		id: options.id,
		version: options.version ?? null,
		names: options.names,
		metadata: index.metadata,
		isName: index.isName,
		getMetadata: index.get,
		search: index.search,
		componentDefinitions: createIconComponentDefinitions({
			isName: index.isName,
			exampleName: options.exampleName,
			description: options.description,
		}),
		createComponentDefinitions: (names: readonly Name[]) =>
			createScopedIconComponentDefinitions(names, {
				exampleName: options.exampleName,
				description: options.description,
			}),
	} as const;
}
