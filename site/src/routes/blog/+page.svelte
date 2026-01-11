<script lang="ts">
	import Date from '$lib/components/Date.svelte';
	import Link from '$lib/components/Link.svelte';
	import SEO from '$lib/components/SEO.svelte';

	import type { PageProps } from './$types';

	import { resolve } from '$app/paths';

	const { data }: PageProps = $props();
</script>

<SEO title="Blog" />

<h1>Blog</h1>

<p>
	Subscribe via
	<Link href="/feed.rss">RSS</Link> /
	<Link href="/feed.atom">Atom</Link> /
	<Link href="/feed.json">JSON feed</Link>
</p>

<section>
	{#each data.posts as post (post.path)}
		{@const meta = post.meta}
		<article>
			<div>
				<h2><Link href={resolve('/blog/[slug]', { slug: post.slug })}>{meta.title}</Link></h2>
				<Date value={meta.date} />
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
