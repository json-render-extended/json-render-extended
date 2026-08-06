import { z } from "zod";

export const iconSizeNames = ["xs", "sm", "md", "lg", "xl"] as const;
export type IconSizeName = (typeof iconSizeNames)[number];

const iconSize = z.union([z.enum(iconSizeNames), z.number().int().min(8).max(128)]);

export interface IconDefinitionOptions<Name extends string> {
	isName: (value: string) => value is Name;
	exampleName: Name;
	description?: string;
}

function definitionForNameSchema<NameSchema extends z.ZodType<string>>(
	name: NameSchema,
	options: { exampleName: string; description?: string },
) {
	return {
		props: z.object({
			name,
			label: z.string().min(1).optional(),
			decorative: z.boolean().optional(),
			size: iconSize.optional(),
			strokeWidth: z.number().min(0.5).max(4).optional(),
			absoluteStrokeWidth: z.boolean().optional(),
			className: z.string().optional(),
		}),
		description:
			options.description ??
			"An icon selected by semantic intent. Provide label for meaningful icons; set decorative=true when assistive technology should ignore it.",
		example: {
			name: options.exampleName,
			label: "Completed",
			size: "md" as const,
		},
	};
}

export function createIconDefinition<Name extends string>(options: IconDefinitionOptions<Name>) {
	return definitionForNameSchema(
		z.string().refine(options.isName, { message: "Unknown icon name." }),
		options,
	);
}

export function createScopedIconDefinition<Name extends string>(
	names: readonly Name[],
	options: Pick<IconDefinitionOptions<Name>, "exampleName" | "description">,
) {
	if (names.length === 0) throw new Error("At least one icon name is required.");
	const uniqueNames = [...new Set(names)];
	return definitionForNameSchema(z.enum(uniqueNames as [Name, ...Name[]]), {
		...options,
		exampleName: uniqueNames.includes(options.exampleName) ? options.exampleName : uniqueNames[0],
	});
}

export function createIconComponentDefinitions<Name extends string>(
	options: IconDefinitionOptions<Name>,
) {
	return { Icon: createIconDefinition(options) };
}

export function createScopedIconComponentDefinitions<Name extends string>(
	names: readonly Name[],
	options: Pick<IconDefinitionOptions<Name>, "exampleName" | "description">,
) {
	return { Icon: createScopedIconDefinition(names, options) };
}

export type IconProps = z.infer<ReturnType<typeof createIconDefinition>["props"]>;
