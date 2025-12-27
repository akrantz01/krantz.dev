<script lang="ts">
	import type { PageProps } from './$types';
	import Markdown from '$lib/markdown';
	import Link from '$lib/components/Link.svelte';
	import Date from '$lib/components/Date.svelte';

	const { data }: PageProps = $props();
</script>

<h1>{data.meta.title}</h1>

<Date value={data.meta.date} />

<Markdown src={data.content} renderers={{ a: Link }} />
