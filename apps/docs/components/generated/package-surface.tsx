/* TypeScript generated for this shadcn project.
 * @json-render-extended/spec docs/package-surface
 * @json-render-extended/source sha256:1711d1cf28253e85fac8232e0fa23ecdafd0e020144e0be45219624c34ffd605
 * @json-render-extended/provider shadcn
 */

import { IconCircleCheck, IconCreditCard, IconSearch, IconSettings } from "@tabler/icons-react";
import type { JSX } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const jsonRenderMaterialization = {
	provider: "shadcn",
	specId: "docs/package-surface",
	sourceDigest: "sha256:1711d1cf28253e85fac8232e0fa23ecdafd0e020144e0be45219624c34ffd605",
} as const;

export interface PackageSurfaceProps {
	title?: string;
}

export function PackageSurface(props: PackageSurfaceProps): JSX.Element {
	return (
		<div className="flex flex-col gap-4 items-stretch justify-start mx-auto w-full max-w-3xl p-6">
			<Badge variant="secondary">{"SHADCN REGISTRY"}</Badge>
			<h2>{props.title ?? "One spec, three primitive bases"}</h2>
			<p className="text-muted-foreground">
				{
					"Compose a JSON Render surface, inspect the package renderer, then export code for this project."
				}
			</p>
			<div className="flex flex-row flex-wrap gap-4 items-center justify-start">
				<IconCircleCheck aria-label="Success" role="img" size={32} />
				<IconCreditCard aria-label="Payment" role="img" size={32} />
				<IconSearch aria-label="Search" role="img" size={32} />
				<IconSettings aria-label="Settings" role="img" size={32} />
			</div>
			<div className="grid grid-cols-2 gap-3">
				<Card>
					<CardHeader>
						<CardTitle>{"Package catalog"}</CardTitle>
						<CardDescription>
							{"The live preview uses the selected JSON Render extension registry."}
						</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{"Application-owned output"}</CardTitle>
						<CardDescription>
							{"Generated code imports the consuming project's shadcn components."}
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
			<Alert>
				<AlertTitle>{"Ready to iterate"}</AlertTitle>
				<AlertDescription>
					{"Valid JSON updates the preview and TypeScript output in real time."}
				</AlertDescription>
			</Alert>
		</div>
	);
}
