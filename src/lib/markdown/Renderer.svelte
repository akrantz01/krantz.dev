<script lang="ts" module>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export type AnyComponent = Component<any>;
	export type Overrides = Record<string, AnyComponent | string | null>;
	export type CustomElements = Record<string, AnyComponent>;

	function resolveOverrides(
		available: Overrides,
		tag: string,
		resolutionChain: string[] = []
	): AnyComponent | string | null {
		if (resolutionChain.includes(tag)) {
			resolutionChain.push(tag);
			throw new Error(`circular dependency detected: ${resolutionChain.join(' -> ')}`);
		}

		const resolved = available[tag];
		if (typeof resolved === 'string')
			return resolveOverrides(available, resolved, [...resolutionChain, tag]);

		if (resolved === null) return null;
		if (resolved === undefined) return tag;
		return resolved;
	}
</script>

<script lang="ts">
	import type { CustomElement, HastNode } from 'markdown';
	import type { Component, Snippet } from 'svelte';
	import Renderer from './Renderer.svelte';

	interface Props {
		node: HastNode;
		overrides: Overrides;
		customElements: CustomElements;
		customElementFallback?: Snippet<[CustomElement]>;
	}
	const { node, overrides, customElements, customElementFallback = undefined }: Props = $props();
</script>

{#snippet children(nodes: HastNode[])}
	<!-- eslint-disable-next-line svelte/require-each-key -->
	{#each nodes as child}
		<Renderer node={child} {overrides} {customElements} />
	{/each}
{/snippet}

{#if node.type === 'root'}
	{@render children(node.children)}
{:else if node.type === 'element'}
	{@const Resolved = resolveOverrides(overrides, node.tagName)}
	{#if typeof Resolved === 'string'}
		{#if Array.isArray(node.children) && node.children.length > 0}
			<svelte:element this={Resolved} {...node.properties}>
				{@render children(node.children)}
			</svelte:element>
		{:else}
			<svelte:element this={Resolved} {...node.properties} />
		{/if}
	{:else if Resolved != null}
		{#if Array.isArray(node.children) && node.children.length > 0}
			<Resolved {...node.properties}>
				{@render children(node.children)}
			</Resolved>
		{:else}
			<Resolved {...node.properties} />
		{/if}
	{/if}
{:else if node.type === 'custom-element'}
	{@const CustomElement = customElements[node.name]}
	{#if CustomElement !== undefined}
		{#if node.children.length > 0}
			<CustomElement {...node.properties}>
				{@render children(node.children)}
			</CustomElement>
		{:else}
			<CustomElement {...node.properties} />
		{/if}
	{:else}
		{@render customElementFallback?.(node)}
	{/if}
{:else if node.type === 'text' || node.type === 'raw'}
	{node.value}
{/if}

<style>
	/* TODO: make rendered styling more customizable */
	p {
		font-size: 13pt;
	}
</style>
