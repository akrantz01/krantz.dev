<script lang="ts">
	import Date from '$lib/components/Date.svelte';
	import Link from '$lib/components/Link.svelte';
	import Markdown from '$lib/components/markdown';
	import SEO from '$lib/components/SEO.svelte';

	import type { PageProps } from './$types';

	const { data, params }: PageProps = $props();
</script>

<SEO
	title={data.meta.title}
	description={data.meta.description}
	image={`/og/post/${params.slug}`}
/>

<h1>{data.meta.title}</h1>

<p class="timestamps">
	Published on <Date value={data.meta.date} />
	{#if data.meta.lastModified}
		| Last updated on <Date value={data.meta.lastModified} time />
	{/if}
</p>

<Markdown src={data.content} overrides={{ a: Link }} />

<style>
	.timestamps {
		font-style: italic;
	}
</style>
