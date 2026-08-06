<script lang="ts">
import { JsonUIProvider, Renderer } from "@json-render/svelte";

import { registry } from "$lib/registry";
import { exampleSpec } from "$lib/spec";
</script>

<svelte:head>
	<title>json-render · shadcn-svelte · static</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
	<header class="space-y-2">
		<p class="font-medium text-primary text-sm">Static JSON spec · Svelte</p>
		<h1 class="font-semibold text-3xl tracking-tight">The shared catalog on shadcn-svelte</h1>
		<p class="max-w-2xl text-muted-foreground">
			The JSON contract matches the React examples. Svelte uses its native shadcn-svelte
			implementation rather than React primitive bases.
		</p>
	</header>

	<JsonUIProvider {registry} initialState={{}}>
		<Renderer spec={exampleSpec} {registry} />
	</JsonUIProvider>
</main>
