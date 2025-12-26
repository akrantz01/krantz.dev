<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<h1>{data.meta.title}</h1>

<!-- TODO: find better way of formatting date -->
<p>{data.meta.date}</p>

{data.content}
