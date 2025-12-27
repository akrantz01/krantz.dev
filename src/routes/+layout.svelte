<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Alex Krantz</title>
</svelte:head>

<Header />
<main>
	{@render children()}
</main>

<style>
	:global {
		:root {
			/* Common named colors */
			--white: oklch(100% 0 0deg);
			--black: oklch(0% 0 0deg);

			/* Text */
			--text-body-light: oklch(20% 0.015 8deg);
			--text-body-dark: oklch(85% 0.01 8deg);

			--text-muted-light: oklch(36% 0.015 8deg);
			--text-muted-dark: oklch(72% 0.01 8deg);

			/* Backgrounds, surfaces, and containers */
			--background-light: oklch(93% 0.126 8deg);
			--background-dark: oklch(13% 0.126 8deg);
			--on-background-light: var(--text-body-light);
			--on-background-dark: var(--text-body-dark);

			--surface-light: oklch(97% 0.06 8deg);
			--surface-dark: oklch(16% 0.08 8deg);
			--on-surface-light: var(--text-body-light);
			--on-surface-dark: var(--text-body-dark);

			--surface-variant-light: oklch(97% 0.04 8deg);
			--surface-variant-dark: oklch(16% 0.06 8deg);
			--on-surface-variant-light: var(--text-muted-light);
			--on-surface-variant-dark: var(--text-muted-dark);

			--outline-light: oklch(75% 0.08 8deg);
			--outline-dark: oklch(25% 0.08 8deg);

			--primary-container-light: oklch(72% 0.126 8deg);
			--primary-container-dark: oklch(28% 0.08 8deg);
			--on-primary-container-light: var(--background-dark);
			--on-primary-container-dark: var(--text-body-dark);

			--secondary-container-light: oklch(72% 0.126 188deg);
			--secondary-container-dark: oklch(28% 0.095 188deg);
			--on-secondary-container-light: var(--background-dark);
			--on-secondary-container-dark: var(--text-body-dark);

			/* Actions */
			--primary-light: oklch(28% 0.08 8deg);
			--primary-dark: oklch(82% 0.06 8deg);
			--on-primary-light: var(--white);
			--on-primary-dark: var(--background-dark);

			--secondary-light: oklch(28% 0.095 188deg);
			--secondary-dark: oklch(72% 0.136 188deg);
			--on-secondary-light: var(--white);
			--on-secondary-dark: var(--background-dark);

			/* Status */
			--success-light: oklch(32% 0.11 135deg);
			--success-dark: oklch(70% 0.126 135deg);
			--on-success-light: var(--white);
			--on-success-dark: var(--background-dark);

			--warning-light: oklch(38% 0.12 75deg);
			--warning-dark: oklch(78% 0.09 75deg);
			--on-warning-light: var(--white);
			--on-warning-dark: var(--background-dark);

			--danger-light: oklch(35% 0.12 25deg);
			--danger-dark: oklch(78% 0.08 25deg);
			--on-danger-light: var(--white);
			--on-danger-dark: var(--background-dark);

			--info-light: oklch(28% 0.095 200deg);
			--info-dark: oklch(68% 0.126 200deg);
			--on-info-light: var(--white);
			--on-info-dark: var(--background-dark);

			/* Interactions */
			--hover-overlay-light: oklch(28% 0.08 8deg / 0.08);
			--hover-overlay-dark: oklch(82% 0.06 8deg / 0.12);

			--focus-ring-light: oklch(28% 0.08 8deg / 0.5);
			--focus-ring-dark: oklch(82% 0.06 8deg / 0.5);
		}

		:root {
			color-scheme: light dark;
		}

		@supports (color: light-dark(black, white)) {
			:root {
				--background: light-dark(var(--background-light), var(--background-dark));
				--on-background: light-dark(var(--on-background-light), var(--on-background-dark));

				--surface: light-dark(var(--surface-light), var(--surface-dark));
				--on-surface: light-dark(var(--on-surface-light), var(--on-surface-dark));

				--surface-variant: light-dark(var(--surface-variant-light), var(--surface-variant-dark));
				--on-surface-variant: light-dark(
					var(--on-surface-variant-light),
					var(--on-surface-variant-dark)
				);

				--primary: light-dark(var(--primary-light), var(--primary-dark));
				--on-primary: light-dark(var(--on-primary-light), var(--on-primary-dark));

				--primary-container: light-dark(
					var(--primary-container-light),
					var(--primary-container-dark)
				);
				--on-primary-container: light-dark(
					var(--on-primary-container-light),
					var(--on-primary-container-dark)
				);

				--secondary: light-dark(var(--secondary-light), var(--secondary-dark));
				--on-secondary: light-dark(var(--on-secondary-light), var(--on-secondary-dark));

				--secondary-container: light-dark(
					var(--secondary-container-light),
					var(--secondary-container-dark)
				);
				--on-secondary-container: light-dark(
					var(--on-secondary-container-light),
					var(--on-secondary-container-dark)
				);

				--success: light-dark(var(--success-light), var(--success-dark));
				--on-success: light-dark(var(--on-success-light), var(--on-success-dark));

				--warning: light-dark(var(--warning-light), var(--warning-dark));
				--on-warning: light-dark(var(--on-warning-light), var(--on-warning-dark));

				--danger: light-dark(var(--danger-light), var(--danger-dark));
				--on-danger: light-dark(var(--on-danger-light), var(--on-danger-dark));

				--info: light-dark(var(--info-light), var(--info-dark));
				--on-info: light-dark(var(--on-info-light), var(--on-info-dark));

				--link: var(--primary);
				--on-link: var(--on-background);

				--hover-overlay: light-dark(var(--hover-overlay-light), var(--hover-overlay-dark));
				--focus-ring: light-dark(var(--focus-ring-light), var(--focus-ring-dark));
				--outline: light-dark(var(--outline-light), var(--outline-dark));
			}
		}

		/* light-dark polyfill using a prefers-color-scheme media query */
		@supports not (color: light-dark(black, white)) {
			:root {
				--background: var(--background-light);
				--on-background: var(--on-background-light);

				--surface: var(--surface-light);
				--on-surface: var(--on-surface-light);

				--surface-variant: var(--surface-variant-light);
				--on-surface-variant: var(--on-surface-variant-light);

				--primary: var(--primary-light);
				--on-primary: var(--on-primary-light);

				--primary-container: var(--primary-container-light);
				--on-primary-container: var(--on-primary-container-light);

				--secondary: var(--secondary-light);
				--on-secondary: var(--on-secondary-light);

				--secondary-container: var(--secondary-container-light);
				--on-secondary-container: var(--on-secondary-container-light);

				--success: var(--success-light);
				--on-success: var(--on-success-light);

				--warning: var(--warning-light);
				--on-warning: var(--on-warning-light);

				--danger: var(--danger-light);
				--on-danger: var(--on-danger-light);

				--info: var(--info-light);
				--on-info: var(--on-info-light);

				--hover-overlay: var(--hover-overlay-light);
				--focus-ring: var(--focus-ring-light);
				--outline: var(--outline-light);

				/* these are constant regardless of color scheme */
				--link: var(--primary);
				--on-link: var(--on-background);
			}

			@media (prefers-color-scheme: dark) {
				:root {
					--background: var(--background-dark);
					--on-background: var(--on-background-dark);

					--surface: var(--surface-dark);
					--on-surface: var(--on-surface-dark);

					--surface-variant: var(--surface-variant-dark);
					--on-surface-variant: var(--on-surface-variant-dark);

					--primary: var(--primary-dark);
					--on-primary: var(--on-primary-dark);

					--primary-container: var(--primary-container-dark);
					--on-primary-container: var(--on-primary-container-dark);

					--secondary: var(--secondary-dark);
					--on-secondary: var(--on-secondary-dark);

					--secondary-container: var(--secondary-container-dark);
					--on-secondary-container: var(--on-secondary-container-dark);

					--success: var(--success-dark);
					--on-success: var(--on-success-dark);

					--warning: var(--warning-dark);
					--on-warning: var(--on-warning-dark);

					--danger: var(--danger-dark);
					--on-danger: var(--on-danger-dark);

					--info: var(--info-dark);
					--on-info: var(--on-info-dark);

					--hover-overlay: var(--hover-overlay-dark);
					--focus-ring: var(--focus-ring-dark);
					--outline: var(--outline-dark);
				}
			}
		}

		* {
			box-sizing: border-box;
		}

		html,
		body {
			height: 100dvh;
			margin: 0;
		}

		body {
			background-color: var(--background);
			color: var(--on-background);
		}

		main {
			max-width: 56rem;
			margin: 0 auto;
			padding: 1rem 0;
		}
	}
</style>
