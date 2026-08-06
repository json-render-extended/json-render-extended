"use client";

import type { ShadcnBase } from "@json-render-extended/shadcn";

import { useRegistry } from "@/components/registry-provider";

const bases = [
	{ value: "base-ui", label: "Base UI" },
	{ value: "react-aria", label: "React Aria" },
	{ value: "radix", label: "Radix" },
] as const satisfies ReadonlyArray<{ value: ShadcnBase; label: string }>;

export function BaseSwitcher() {
	const { base, selectBase } = useRegistry();

	return (
		<fieldset className="base-switcher" aria-label="Primitive registry">
			<legend>Registry</legend>
			<div>
				{bases.map((item) => (
					<button
						key={item.value}
						type="button"
						aria-pressed={base === item.value}
						onClick={() => selectBase(item.value)}
					>
						{item.label}
					</button>
				))}
			</div>
		</fieldset>
	);
}
