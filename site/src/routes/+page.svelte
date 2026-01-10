<script lang="ts">
	import type { IconProp } from '@fortawesome/fontawesome-svg-core';
	import {
		faGithub,
		faInstagram,
		faLinkedin,
		faStackOverflow,
		faStrava
	} from '@fortawesome/free-brands-svg-icons';
	import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import Link from '$lib/components/Link.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO />

<section class="hero">
	<h1>Alex Krantz</h1>

	<Link href="#about-heading">
		<FontAwesomeIcon class="down-arrow" icon={faChevronDown} />
		<span class="sr-only">Jump to about</span>
	</Link>
</section>

<section class="about">
	<h1 id="about-heading">About me</h1>

	<p>Hi hi! 👋 I'm Alex (he/him), a 24 y/o software developer based in Vancouver, BC.</p>

	<h3 class="sr-only">Socials</h3>
	<ul class="socials">
		{#snippet social_account(icon: IconProp, name: string, handle: string, href: string)}
			<li>
				<FontAwesomeIcon {icon} />
				<span>
					<span class="sr-only">{name}</span>
					<Link {href}><code>{handle}</code></Link></span
				>
			</li>
		{/snippet}

		{@render social_account(faGithub, 'GitHub', 'akrantz01', 'https://github.com/akrantz01')}
		{@render social_account(
			faLinkedin,
			'LinkedIn',
			'in/akrantz01',
			'https://linkedin.com/in/akrantz01'
		)}
		{@render social_account(
			faStackOverflow,
			'StackOverflow',
			'akrantz01',
			'https://stackoverflow.com/users/6383564/akrantz01'
		)}
		{@render social_account(
			faInstagram,
			'Instagram',
			'@bakingnotalex',
			'https://www.instagram.com/bakingnotalex'
		)}
		{@render social_account(
			faStrava,
			'Strava',
			'Alex Krantz',
			'https://www.strava.com/athletes/118294715'
		)}
	</ul>

	<h3>Fun facts</h3>
	<ul class="fun-facts">
		<li>I moved to Vancouver in 2020 during the height of the COVID-19 pandemic from California</li>
		<li>
			I bake an inordinate amount—only limited by how fast I can eat or pawn off to friends the last
			thing I made.
		</li>
		<li>I daily drive Fedora on my laptop and NixOS on my homelab servers</li>
		<li>
			Recently, I've been playing lots of
			<Link href="https://www.supergiantgames.com/games/hades-ii">Hades II</Link>. I also love
			playing
			<Link href="https://www.satisfactorygame.com/">Satisfactory</Link> and
			<Link href="https://www.enterthegungeon.com/">Enter the Gungeon</Link>.
		</li>
		<li>The first programming language I leared was Python</li>
	</ul>

	<h3>What I'm up to</h3>
	<p>
		I'm studying computer science at BCIT in downtown Vancouver. I'm finishing my final term before
		graduating. My specialization is in programming paradigms which focuses on different ways of
		developing programs in languages like OCaml, Elixir, Go, and Rust.
	</p>

	<p>
		As I'm about to graduate, I'm currently looking for full-time positions. My focus is
		particularly in DevOps and platform-related jobs.
	</p>

	<!-- TODO: add list of projects -->

	<!-- TODO: add get in touch section -->
</section>

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
		/* TODO: make this work with a dynamic header height */
		min-height: calc(100dvh - 90px);

		h1 {
			font-size: var(--max-font-size);
		}
	}

	@supports (font-size: 1cqi) {
		.hero {
			container-type: inline-size;

			h1 {
				font-size: clamp(var(--min-font-size), 100cqmin / 4.5, var(--max-font-size));
			}
		}
	}

	.about {
		min-height: calc(100dvh - 4rem);
	}

	.socials {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		padding: 0;
	}

	.fun-facts li {
		padding: 0.125rem 0;
	}

	:global(.down-arrow) {
		animation: 2s ease-in-out 0s infinite bob;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.down-arrow) {
			animation: none;
		}
	}

	@keyframes bob {
		0% {
			transform: translateY(-0.5rem);
		}
		50% {
			transform: translateY(0.5rem);
		}
		100% {
			transform: translateY(-0.5rem);
		}
	}
</style>
