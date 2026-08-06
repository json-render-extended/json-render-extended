"use client";

import type { Spec } from "@json-render/core";
import { JSONUIProvider, Renderer, useChatUI } from "@json-render/react";
import type { ShadcnBase } from "@json-render-extended/shadcn";
import { useState } from "react";

import { registryByBase } from "@/lib/registries";

const labels: Record<ShadcnBase, string> = {
	"base-ui": "Base UI",
	"react-aria": "React Aria",
	radix: "Radix UI",
};

function GeneratedSpec({ base, spec }: { base: ShadcnBase; spec: Spec }) {
	const registry = registryByBase[base];

	return (
		<JSONUIProvider registry={registry} initialState={spec.state ?? {}}>
			<Renderer key={base} spec={spec} registry={registry} />
		</JSONUIProvider>
	);
}

export function AiRegistryPreview() {
	const [base, setBase] = useState<ShadcnBase>("base-ui");
	const [input, setInput] = useState("Create a compact project status dashboard");
	const { messages, isStreaming, error, send, clear } = useChatUI({ api: "/api/generate" });

	return (
		<section className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
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
				<button
					className="text-muted-foreground text-sm hover:text-foreground"
					onClick={clear}
					type="button"
				>
					Clear
				</button>
			</div>

			<form
				className="flex gap-2"
				onSubmit={(event) => {
					event.preventDefault();
					void send(input);
				}}
			>
				<input
					aria-label="Describe a UI"
					className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
					disabled={isStreaming}
					onChange={(event) => setInput(event.target.value)}
					value={input}
				/>
				<button
					className="rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm disabled:opacity-50"
					disabled={isStreaming || !input.trim()}
					type="submit"
				>
					{isStreaming ? "Generating…" : "Generate"}
				</button>
			</form>

			{error && <p className="text-destructive text-sm">{error.message}</p>}

			<div className="space-y-6">
				{messages.map((message) => (
					<article className="space-y-3" key={message.id}>
						{message.text && (
							<p
								className={
									message.role === "user" ? "font-medium text-sm" : "text-muted-foreground text-sm"
								}
							>
								{message.text}
							</p>
						)}
						{message.spec && <GeneratedSpec base={base} spec={message.spec} />}
					</article>
				))}
			</div>
		</section>
	);
}
