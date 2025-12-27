<script lang="ts">
	import Parser from './parser';
	import Renderer, { type Renderers } from './Renderer.svelte';

	interface Props {
		src: string;
		renderers?: Renderers;
	}
	const { src, renderers = {} }: Props = $props();

	const parser = $state(new Parser());
	const ast = $derived(parser.parse(src));
</script>

<Renderer node={await ast} {renderers} />
