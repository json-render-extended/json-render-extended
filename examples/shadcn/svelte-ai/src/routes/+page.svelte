<script lang="ts">
import { createChatUI, JsonUIProvider, Renderer } from "@json-render/svelte";

import { registry } from "$lib/registry";

let input = $state("Create a compact project status dashboard");
const chat = createChatUI({ api: "/api/generate" });

function submit(event: SubmitEvent) {
	event.preventDefault();
	void chat.send(input);
}
</script>

<svelte:head>
	<title>json-render · shadcn-svelte · AI</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
	<header class="space-y-2">
		<p class="font-medium text-primary text-sm">AI-generated JSON spec · Svelte</p>
		<h1 class="font-semibold text-3xl tracking-tight">Streaming UI on shadcn-svelte</h1>
		<p class="max-w-2xl text-muted-foreground">
			This uses the same catalog contract as the React AI example and renders with native Svelte
			components.
		</p>
	</header>

	<div class="flex justify-end">
		<button class="text-muted-foreground text-sm hover:text-foreground" onclick={chat.clear} type="button">
			Clear
		</button>
	</div>

	<form class="flex gap-2" onsubmit={submit}>
		<input
			aria-label="Describe a UI"
			class="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
			disabled={chat.isStreaming}
			bind:value={input}
		/>
		<button
			class="rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm disabled:opacity-50"
			disabled={chat.isStreaming || !input.trim()}
			type="submit"
		>
			{chat.isStreaming ? "Generating…" : "Generate"}
		</button>
	</form>

	{#if chat.error}
		<p class="text-destructive text-sm">{chat.error.message}</p>
	{/if}

	<div class="space-y-6">
		{#each chat.messages as message (message.id)}
			<article class="space-y-3">
				{#if message.text}
					<p class={message.role === "user" ? "font-medium text-sm" : "text-muted-foreground text-sm"}>
						{message.text}
					</p>
				{/if}
				{#if message.spec}
					<JsonUIProvider {registry} initialState={message.spec.state ?? {}}>
						<Renderer spec={message.spec} {registry} loading={chat.isStreaming} />
					</JsonUIProvider>
				{/if}
			</article>
		{/each}
	</div>
</main>
