<script lang="ts" module>
	import type { Page } from '@sveltejs/kit';

	export type Matcher = (href: string, page: Page) => boolean;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		newTab?: boolean;
		matcher?: Matcher;
		children: Snippet;
	}

	const {
		href: to,
		newTab = false,
		matcher = (href, page) => page.route.id === href,
		children,
		...rest
	}: Props = $props();
	const anchor = $derived(to.startsWith('#'));
	const external = $derived(to.startsWith('https://') || to.startsWith('http://'));
	// @ts-expect-error resolve can be passed a string and be fine
	const href = $derived(anchor || external ? to : resolve(to));
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	{href}
	class:current={!external && matcher(href, page)}
	target={newTab || external ? '_blank' : null}
	rel={external ? 'noopener noreferrer' : null}
	{...rest}
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
		}

		&:hover {
			text-decoration: none;
		}
	}

	a,
	a:visited,
	a:hover,
	a:active {
		color: var(--link-fg, inherit);

		&.current {
			color: var(--link-current-fg, var(--link-fg));
		}
	}
</style>
