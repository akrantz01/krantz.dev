<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';

	const FILE_EXTENSION_REGEX = /\.[^.]+$/;

	const { data }: PageProps = $props();
</script>

<h1>Blog</h1>

<!-- TODO: add atom feed -->
<p>Subscribe via <Link href="#">RSS/Atom</Link></p>

<section>
	{#each data.posts as post (post.path)}
		{@const meta = post.meta}
		{@const slug = post.path.replace(FILE_EXTENSION_REGEX, '')}
		<article>
			<div>
				<h2><Link href={resolve('/blog/[slug]', { slug })}>{meta.title}</Link></h2>
				<!-- TODO: find better way to display date -->
				<p>{meta.date}</p>
			</div>

			<p>{meta.description}</p>
		</article>
	{/each}
</section>

<style>
	article {
		background-color: var(--secondary-container);
		color: var(--on-secondary-container);
		border-radius: 8px;
		padding: 1rem 2rem;
		margin: 2rem 0;

		h2,
		p {
			margin: 0.25rem 0;
		}

		div {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
</style>
