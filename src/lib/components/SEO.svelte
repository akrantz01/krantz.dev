<script lang="ts">
	import * as meta from '$lib/meta';
	import { page } from '$app/state';

	interface Props {
		title?: string;
		description?: string;
	}

	const { title: partialTitle, description = meta.description }: Props = $props();

	const url = $derived(page.url.toString());
	const title = $derived(
		partialTitle === undefined ? meta.siteName : `${partialTitle} | ${meta.siteName}`
	);
</script>

<!-- TODO: add og:image and twitter:image -->

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="author" content={meta.author} />

	<link rel="canonical" href={url} />

	<!-- OpenGraph -->
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={meta.siteName} />
	<meta property="og:locale" content={meta.language} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
