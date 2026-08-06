<script lang="ts">
	import {
		buildPlaygroundSpecUrl,
		playgroundLinkStyle,
		type PlaygroundLinkPosition,
	} from "@json-render-extended/playground/dev-link";

	let {
		href,
		spec,
		position = "bottom-right",
		label = "Open JSON Render spec",
	}: {
		href?: string;
		spec: string;
		position?: PlaygroundLinkPosition;
		label?: string;
	} = $props();

	const dev = import.meta.env.DEV;
</script>

{#if dev && href}
	<a
		href={buildPlaygroundSpecUrl(href, spec)}
		rel="noreferrer"
		target="_blank"
		style:position={playgroundLinkStyle(position).position}
		style:bottom={playgroundLinkStyle(position).bottom}
		style:top={playgroundLinkStyle(position).top}
		style:left={playgroundLinkStyle(position).left}
		style:right={playgroundLinkStyle(position).right}
		style:z-index={playgroundLinkStyle(position).zIndex}
	>
		<span aria-hidden="true">JR</span>
		{label}
	</a>
{/if}

<style>
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid #333;
		border-radius: 999px;
		padding: 0.55rem 0.8rem;
		background: #090909;
		box-shadow: 0 8px 30px rgb(0 0 0 / 25%);
		color: #fff;
		font: 600 12px/1 ui-sans-serif, system-ui, sans-serif;
		text-decoration: none;
	}
</style>
