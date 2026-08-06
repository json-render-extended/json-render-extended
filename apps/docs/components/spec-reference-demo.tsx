"use client";

import type { BaseComponentProps } from "@json-render/react";
import { JsonRenderSpec } from "@json-render-extended/playground/runtime";

import { useRegistry } from "@/components/registry-provider";
import { jsonRenderSpecs } from "@/json-render/specs";

export interface SpecReferenceDemoProps {
	message?: string;
	spec: string;
	title?: string;
}

export function SpecReferenceDemo({ props }: BaseComponentProps<SpecReferenceDemoProps>) {
	const { registry } = useRegistry();
	return (
		<JsonRenderSpec
			entries={jsonRenderSpecs}
			playground={{
				href: process.env.NEXT_PUBLIC_JSON_RENDER_PLAYGROUND_URL,
				position: "inline",
			}}
			props={{
				...(props.message ? { message: props.message } : {}),
				...(props.title ? { title: props.title } : {}),
			}}
			registry={registry}
			spec={props.spec}
		/>
	);
}
