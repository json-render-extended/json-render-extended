"use client";

import { JSONUIProvider, Renderer } from "@json-render/react";
import type { ShadcnBase } from "@json-render-extended/shadcn";
import { useState } from "react";

import { registryByBase } from "@/lib/registries";
import { exampleSpec } from "@/lib/spec";

const labels: Record<ShadcnBase, string> = {
	"base-ui": "Base UI",
	"react-aria": "React Aria",
	radix: "Radix UI",
};

export function RegistryPreview() {
	const [base, setBase] = useState<ShadcnBase>("base-ui");
	const registry = registryByBase[base];

	return (
		<section className="space-y-6">
			<fieldset
				aria-label="Select shadcn base"
				className="inline-flex gap-1 rounded-lg bg-muted p-1"
			>
				{Object.entries(labels).map(([value, label]) => (
					<button
						key={value}
						type="button"
						aria-pressed={base === value}
						className="rounded-md px-3 py-1.5 font-medium text-sm aria-pressed:bg-background aria-pressed:shadow-sm"
						onClick={() => setBase(value as ShadcnBase)}
					>
						{label}
					</button>
				))}
			</fieldset>

			<JSONUIProvider registry={registry} initialState={{}}>
				<Renderer key={base} spec={exampleSpec} registry={registry} />
			</JSONUIProvider>
		</section>
	);
}
