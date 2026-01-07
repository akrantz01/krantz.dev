<script lang="ts">
	import { render, type CustomElement } from '@krantz-dev/markdown';
	import Renderer, { type CustomElements, type Overrides } from './Renderer.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		src: string;
		overrides?: Overrides;
		customElements?: CustomElements;
		customElementFallback?: Snippet<[CustomElement]>;
	}
	const {
		src,
		overrides = {},
		customElements = {},
		customElementFallback = undefined
	}: Props = $props();

	const { ast } = $derived(await render(src));
</script>

<Renderer node={ast} {overrides} {customElements} {customElementFallback} />

<!-- TODO: display messages somewhere/somehow (probably a toggleable modal?) -->
