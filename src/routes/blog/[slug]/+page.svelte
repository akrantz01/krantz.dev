<script lang="ts">
	import type { PageProps } from './$types';
	import Markdown from '$lib/markdown';
	import Link from '$lib/components/Link.svelte';

	const { data }: PageProps = $props();
</script>

<h1>{data.meta.title}</h1>

<!-- TODO: find better way of formatting date -->
<p>{data.meta.date}</p>

<Markdown src={data.content} renderers={{ a: Link }} />
