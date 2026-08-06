import type { ComponentDefinition } from "@json-render-extended/shadcn/catalog";
import { z } from "zod";

export const componentDefinitions = {
	CodeBlock: {
		props: z.object({
			code: z.string(),
			language: z.string().optional(),
			label: z.string().optional(),
		}),
		description:
			"A syntax-highlighted code block with a filename label and copy button, extended from the public Shadcnblocks registry.",
		example: {
			code: "const registry = defineRegistry(catalog, { components });",
			language: "typescript",
			label: "registry.ts",
		},
	},
} satisfies Record<string, ComponentDefinition>;
