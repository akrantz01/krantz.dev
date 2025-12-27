<script lang="ts">
	import { page } from '$app/state';
	import Link, { type Matcher } from './Link.svelte';
	import icon from '$lib/assets/favicon.svg';

	const MINIMAL_ROUTES = ['/'];

	const route = $derived(page.route.id ?? '');
	const minimal = $derived(MINIMAL_ROUTES.includes(route));
</script>

{#snippet navlink(href: string, label: string, matcher: Matcher | undefined = undefined)}
	<Link
		{href}
		{matcher}
		--link-fg="var(--on-primary)"
		--link-bg="var(--primary)"
		--link-current-fg="var(--on-secondary)"
		--link-current-bg="var(--secondary)"
		--link-padding="0.25rem"
		--link-radius="4px"
	>
		{label}
	</Link>
{/snippet}

<header>
	<div class="name">
		<img src={icon} alt="Blog logo" height="56rem" />
		{#if !minimal}
			<h1>Alex Krantz</h1>
		{/if}
	</div>

	<nav>
		{@render navlink('/', 'About me')}
		{@render navlink(
			'/blog',
			'Blog',
			(href, page) => page.route.id === '/blog' || page.url.pathname.startsWith('/blog/')
		)}
		{@render navlink('https://resume.krantz.dev', 'Resume')}
	</nav>
</header>

<style>
	header {
		padding: 1em;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--surface);
		color: var(--on-surface);
		border-bottom: 2px solid var(--outline);
	}

	.name {
		display: flex;
		align-items: center;
		gap: 1rem;

		h1 {
			margin: 0;
		}
	}

	nav {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
