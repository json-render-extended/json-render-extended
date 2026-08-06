export interface IconSemantics<Category extends string = string> {
	aliases?: readonly string[];
	intents?: readonly string[];
	categories?: readonly Category[];
}

export interface IconMetadata<Name extends string = string, Category extends string = string> {
	name: Name;
	label: string;
	aliases: readonly string[];
	intents: readonly string[];
	categories: readonly Category[];
}

export interface SearchIconsOptions<Category extends string = string> {
	limit?: number;
	categories?: readonly Category[];
	intents?: readonly string[];
}

export interface IconSearchResult<Name extends string = string, Category extends string = string>
	extends IconMetadata<Name, Category> {
	score: number;
}

export interface IconMetadataIndexOptions<Name extends string, Category extends string> {
	names: readonly Name[];
	semantics?: Partial<Record<Name, IconSemantics<Category>>>;
	tokenAliases?: Readonly<Record<string, readonly string[]>>;
	categoryTokens?: Readonly<Record<Category, readonly string[]>>;
	labelForName?: (name: Name) => string;
}

export interface IconMetadataIndex<Name extends string, Category extends string> {
	metadata: readonly IconMetadata<Name, Category>[];
	isName: (value: string) => value is Name;
	get: (name: Name) => IconMetadata<Name, Category>;
	search: (
		query: string,
		options?: SearchIconsOptions<Category>,
	) => IconSearchResult<Name, Category>[];
}

export interface DefineIconSetOptions<Name extends string, Category extends string>
	extends IconMetadataIndexOptions<Name, Category> {
	id: string;
	version?: string;
	exampleName: Name;
	description?: string;
}

function defaultLabelForName(name: string): string {
	return name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function categoriesForName<Category extends string>(
	name: string,
	categoryTokens: Readonly<Record<Category, readonly string[]>>,
): Category[] {
	const tokens = new Set(name.split("-"));
	return (Object.entries(categoryTokens) as Array<[Category, readonly string[]]>)
		.filter(([, candidates]) =>
			candidates.some((candidate) => name.includes(candidate) || tokens.has(candidate)),
		)
		.map(([category]) => category);
}

export function createIconMetadataIndex<Name extends string, Category extends string = string>(
	options: IconMetadataIndexOptions<Name, Category>,
): IconMetadataIndex<Name, Category> {
	const nameSet = new Set<string>(options.names);
	const metadata = options.names.map((name): IconMetadata<Name, Category> => {
		const semantics = options.semantics?.[name];
		const generatedAliases = name
			.split("-")
			.flatMap((token) => options.tokenAliases?.[token] ?? [])
			.filter((alias, index, aliases) => aliases.indexOf(alias) === index);
		return {
			name,
			label: options.labelForName?.(name) ?? defaultLabelForName(name),
			aliases: [...new Set([...(semantics?.aliases ?? []), ...generatedAliases])],
			intents: semantics?.intents ?? [],
			categories: [
				...new Set([
					...(semantics?.categories ?? []),
					...categoriesForName(name, options.categoryTokens ?? ({} as Record<Category, string[]>)),
				]),
			],
		};
	});
	const metadataByName = new Map(metadata.map((entry) => [entry.name, entry]));
	const isName = (value: string): value is Name => nameSet.has(value);
	const get = (name: Name): IconMetadata<Name, Category> => {
		const entry = metadataByName.get(name);
		if (!entry) throw new Error(`Unknown icon: ${name}`);
		return entry;
	};
	const search = (
		query: string,
		searchOptions: SearchIconsOptions<Category> = {},
	): IconSearchResult<Name, Category>[] => {
		const queryText = query.trim().toLowerCase();
		const queryTokens = queryText.split(/[^a-z0-9]+/).filter(Boolean);
		const categories = new Set(searchOptions.categories ?? []);
		const intents = new Set((searchOptions.intents ?? []).map((intent) => intent.toLowerCase()));
		const limit = Math.max(1, Math.min(searchOptions.limit ?? 12, 100));
		return metadata
			.filter(
				(entry) =>
					(categories.size === 0 ||
						entry.categories.some((category) => categories.has(category))) &&
					(intents.size === 0 || entry.intents.some((intent) => intents.has(intent))),
			)
			.map((entry) => ({ ...entry, score: scoreMetadata(entry, queryText, queryTokens) }))
			.filter((entry) => queryText.length === 0 || entry.score > 0)
			.sort((left, right) => right.score - left.score || left.name.localeCompare(right.name))
			.slice(0, limit);
	};
	return { metadata, isName, get, search };
}

function scoreMetadata<Name extends string, Category extends string>(
	metadata: IconMetadata<Name, Category>,
	queryText: string,
	queryTokens: readonly string[],
): number {
	if (queryText.length === 0) return 1;
	let score = metadata.name === queryText ? 120 : 0;
	if (metadata.label.toLowerCase() === queryText) score += 100;
	if (metadata.name.includes(queryText)) score += 30;
	const nameTokens = new Set(metadata.name.split("-"));
	const aliases = metadata.aliases.map((alias) => alias.toLowerCase());
	const intents = metadata.intents.map((intent) => intent.toLowerCase());
	for (const token of queryTokens) {
		if (nameTokens.has(token)) score += 18;
		if (aliases.includes(token)) score += 28;
		if (aliases.some((alias) => alias.includes(token))) score += 10;
		if (intents.some((intent) => intent.includes(token))) score += 22;
		if (metadata.categories.includes(token as Category)) score += 8;
	}
	return score;
}
