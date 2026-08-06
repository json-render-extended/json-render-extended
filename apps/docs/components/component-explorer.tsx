"use client";

import type { Spec } from "@json-render/core";
import { PageRenderer } from "@json-render/next";
import { useMemo, useState } from "react";

import { componentCatalog, componentCategories } from "@/lib/component-data";

const supportLabels = {
	"json-render": "JSON Render",
	native: "Native",
	portable: "Portable",
};

function createCatalogSpec(query: string, category: string): Spec {
	const normalizedQuery = query.trim().toLowerCase();
	const matches = componentCatalog.filter(
		(component) =>
			(category === "All" || component.category === category) &&
			(component.name.toLowerCase().includes(normalizedQuery) ||
				component.description.toLowerCase().includes(normalizedQuery)),
	);
	const elements: Spec["elements"] = {
		results: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				justify: "start",
				className: "component-results",
			},
			children: ["count", "grid"],
		},
		count: {
			type: "Text",
			props: {
				text: `${matches.length} ${matches.length === 1 ? "component" : "components"}`,
				variant: "muted",
			},
		},
		grid: {
			type: "Grid",
			props: { columns: 2, gap: "md", className: "component-catalog-grid" },
			children: matches.map((component) => `card-${component.name}`),
		},
	};

	for (const component of matches) {
		const cardId = `card-${component.name}`;
		const supportId = `support-${component.name}`;
		elements[cardId] = {
			type: "Card",
			props: {
				title: component.name,
				description: component.description,
				maxWidth: "full",
				centered: false,
				className: "component-catalog-card",
			},
			children: [supportId],
		};
		elements[supportId] = {
			type: "Stack",
			props: {
				direction: "horizontal",
				gap: "sm",
				align: "center",
				justify: "start",
				className: "component-support-row",
			},
			children: (["base-ui", "react-aria", "radix"] as const).map((base) => {
				const id = `${supportId}-${base}`;
				elements[id] = {
					type: "Badge",
					props: {
						text: `${base === "base-ui" ? "Base" : base === "react-aria" ? "Aria" : "Radix"} · ${supportLabels[component.support[base]]}`,
						variant: component.support[base] === "native" ? "default" : "outline",
					},
				};
				return id;
			}),
		};
	}

	if (matches.length === 0) {
		elements.grid = {
			type: "Empty",
			props: {
				title: "No components found",
				description: "Try a different name, description, or category.",
				media: null,
				actionLabel: null,
			},
		};
	}

	return { root: "results", elements };
}

export function ComponentExplorer() {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All");
	const spec = useMemo(() => createCatalogSpec(query, category), [query, category]);

	return (
		<section className="component-explorer" aria-label="Component catalog">
			<div className="component-filters">
				<label>
					<span>Search components</span>
					<input
						type="search"
						value={query}
						placeholder="Try Calendar, Message, form…"
						onChange={(event) => setQuery(event.currentTarget.value)}
					/>
				</label>
				<label>
					<span>Category</span>
					<select value={category} onChange={(event) => setCategory(event.currentTarget.value)}>
						{componentCategories.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
				</label>
			</div>
			<PageRenderer spec={spec} />
		</section>
	);
}
