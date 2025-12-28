<script lang="ts">
	import type { PageProps } from './$types';
	import Markdown from '$lib/markdown';
	import Link from '$lib/components/Link.svelte';
	import Date from '$lib/components/Date.svelte';
	import SEO from '$lib/components/SEO.svelte';

	const { data }: PageProps = $props();
</script>

<SEO title={data.meta.title} description={data.meta.description} />

<h1>{data.meta.title}</h1>

<p class="timestamps">
	Published on <Date value={data.meta.date} />
	{#if data.meta.lastModified}
		| Last updated on <Date value={data.meta.lastModified} time />
	{/if}
</p>

<Markdown src={data.content} renderers={{ a: Link }} />

<style>
	.timestamps {
		font-style: italic;
	}
</style>
