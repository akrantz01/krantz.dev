<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { dedent } from '$lib/text';

	import { page } from '$app/state';

	function makeIssueUrl(): string {
		const url = new URL('https://github.com/akrantz01/krantz.dev/issues/new');
		url.searchParams.set('title', `Error on ${page.url.pathname}`);
		url.searchParams.set(
			'body',
			dedent(`\`\`\`
			URL: ${page.url}
			Route: ${page.route.id}
			Status: ${page.status}
			Error: ${JSON.stringify(page.error)}
			\`\`\`
			<!-- Please include any additional context below -->
			`)
		);
		return url.toString();
	}
</script>

<div>
	{#if page.status === 404}
		<h1>Not found</h1>
		<p>Looks like I haven't made this page yet...</p>
		<p>
			You're at: <code>{page.url}</code><br />
			Please check it's correct and try again!
		</p>
	{:else}
		<h1>Unexpected Error</h1>
		<p>
			An unexpected error occurred, please report an issue
			<Link href={makeIssueUrl()}>on GitHub</Link>.
		</p>
	{/if}

	<Link href="/">Return home</Link>
</div>

<style>
	div {
		text-align: center;
	}

	code {
		color: var(--secondary);
	}
</style>
