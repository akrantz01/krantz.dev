<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		href: string;
		newTab?: boolean;
		children: Snippet;
	}

	const { href, newTab = false, children }: Props = $props();
	const external = $derived(href.startsWith('https://') || href.startsWith('http://'));
</script>

<a
	{href}
	class:current={!external && page.route.id === href}
	target={newTab || external ? '_blank' : null}
	rel={external ? 'noopener noreferrer' : null}
>
	{@render children()}
</a>

<style>
	a {
		background-color: var(--link-bg, inherit);
		color: var(--link-fg, inherit);
		padding: var(--link-padding, 0);
		border-radius: var(--link-radius, 0);
		text-decoration: underline;

		&.current {
			background-color: var(--link-current-bg, var(--link-bg));
			color: var(--link-current-fg, var(--link-fg));
		}

		&:hover {
			text-decoration: none;
		}
	}
</style>
