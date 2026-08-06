import { z } from "zod";

export const packageShowcaseExtensionSchema = z.enum([
	"@json-render-extended/shadcn",
	"@json-render-extended/icons/tabler",
]);

export const packageShowcasePropsSchema = z.object({
	packages: z
		.array(
			z.object({
				id: z.string().min(1),
				label: z.string().min(1),
				name: z.string().min(1),
				href: z.string().min(1),
				extensions: z.array(packageShowcaseExtensionSchema).min(1),
				source: z.string().min(1),
			}),
		)
		.min(1),
});

export type PackageShowcaseProps = z.infer<typeof packageShowcasePropsSchema>;
