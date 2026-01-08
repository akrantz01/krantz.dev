<script lang="ts">
	import { highlighter } from '$lib/highlighter.remote';
	import '@krantz-dev/highlight/theme.css';

	interface Props {
		language: string;
		text: string;
	}
	const { language, text }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<pre><code>{@html await highlighter({ language, text })}</code></pre>

<style>
	:root {
		--code-block-bg-light: oklch(92% 0.006 60deg);
		--code-block-bg-dark: oklch(30% 0.018 280deg);

		--code-block-fg-light: oklch(33% 0.08 300deg);
		--code-block-fg-dark: oklch(85% 0.06 275deg);
	}

	@supports (color: light-dark(black, white)) {
		:root {
			--code-block-bg: light-dark(var(--code-block-bg-light), var(--code-block-bg-dark));
			--code-block-fg: light-dark(var(--code-block-fg-light), var(--code-block-fg-dark));
		}
	}

	@supports not (color: light-dark(black, white)) {
		:root {
			--code-block-bg: var(--code-block-bg-light);
			--code-block-fg: var(--code-block-fg-light);
		}

		@media (prefers-color-scheme: dark) {
			:root {
				--code-block-bg: var(--code-block-bg-dark);
				--code-block-fg: var(--code-block-fg-dark);
			}
		}
	}

	pre {
		background-color: var(--code-block-bg);
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--code-block-fg);
		border-radius: 8px;
	}
</style>
