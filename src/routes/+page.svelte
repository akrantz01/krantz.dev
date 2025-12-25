<div class="hero">
	<h1>Alex Krantz</h1>

	<!-- TODO: replace with fontawesome icon -->
	<p>V</p>
</div>

<!-- TODO: add about me content -->

<style>
	:root {
		--min-font-size: clamp(1.76rem, 1.43rem + 1.65vw, 3.66rem);
		--max-font-size: clamp(4.29rem, 1.82rem + 12.36vw, 18.51rem);
	}

	.hero {
		flex: auto;
		flex-direction: columns;
		place-content: center;
		padding-inline: 0;
		text-align: center;

		h1 {
			font-size: var(--max-font-size);
		}
	}

	@supports (font-size: 1cqi) {
		.hero {
			container-type: inline-size;
			/* TODO: make this work with a dynamic header height */
			min-height: calc(100dvh - 90px);

			h1 {
				font-size: clamp(var(--min-font-size), 100cqmin / 4.5, var(--max-font-size));
			}
		}
	}
</style>
