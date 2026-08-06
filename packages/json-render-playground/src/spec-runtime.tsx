"use client";

import { createStateStore, type Spec } from "@json-render/core";
import type { ComponentRegistry } from "@json-render/react";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { type ComponentType, useMemo } from "react";

import type { PlaygroundLinkPosition } from "./dev-link";
import { JsonRenderPlaygroundLink } from "./react";

export type JsonRenderSpecEntry =
	| {
			mode: "materialized";
			Component: ComponentType<never>;
	  }
	| {
			mode: "runtime";
			spec: Spec;
	  };

export type JsonRenderSpecEntries = Record<string, JsonRenderSpecEntry>;

export interface JsonRenderSpecProps {
	entries: JsonRenderSpecEntries;
	registry?: ComponentRegistry;
	spec: string;
	props?: Record<string, unknown>;
	playground?: {
		href?: string;
		position?: PlaygroundLinkPosition;
	};
}

export function JsonRenderSpec({
	entries,
	registry,
	spec,
	props = {},
	playground,
}: JsonRenderSpecProps) {
	const entry = entries[spec];
	if (!entry)
		throw new Error(`JSON Render spec ${spec} is not present in the generated spec module.`);
	if (entry.mode === "materialized") {
		const Component = entry.Component as ComponentType<Record<string, unknown>>;
		return (
			<>
				<Component {...props} />
				{playground && <JsonRenderPlaygroundLink {...playground} spec={spec} />}
			</>
		);
	}
	if (!registry) throw new Error("A JSON Render registry is required for a runtime spec.");
	return (
		<>
			<RuntimeJsonRenderSpec entry={entry} props={props} registry={registry} />
			{playground && <JsonRenderPlaygroundLink {...playground} spec={spec} />}
		</>
	);
}

function RuntimeJsonRenderSpec({
	entry,
	props,
	registry,
}: {
	entry: Extract<JsonRenderSpecEntry, { mode: "runtime" }>;
	props: Record<string, unknown>;
	registry: ComponentRegistry;
}) {
	const serializedProps = JSON.stringify(props);
	const store = useMemo(() => {
		const runtimeProps = JSON.parse(serializedProps) as Record<string, unknown>;
		return createStateStore({
			...(entry.spec.state ?? {}),
			props: {
				...(isRecord(entry.spec.state?.props) ? entry.spec.state.props : {}),
				...runtimeProps,
			},
		});
	}, [entry.spec, serializedProps]);
	return (
		<JSONUIProvider registry={registry} store={store}>
			<Renderer registry={registry} spec={entry.spec} />
		</JSONUIProvider>
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
