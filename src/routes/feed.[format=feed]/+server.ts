import type { RequestHandler } from './$types';
import populateFeed, { type FeedGenerator } from '$lib/server/feed';

export const prerender = true;

const feed = populateFeed();

interface FeedMeta {
	generator: keyof FeedGenerator;
	type: string;
}

const EXTENSION_TO_METADATA: Record<string, FeedMeta> = {
	rss: {
		generator: 'rss2',
		type: 'application/rss+xml'
	},
	atom: {
		generator: 'atom1',
		type: 'application/atom+xml'
	},
	json: {
		generator: 'json1',
		type: 'application/feed+json'
	}
};

export const GET: RequestHandler = async ({ params: { format } }) => {
	const metadata = EXTENSION_TO_METADATA[format];
	if (metadata === undefined) throw new Error(`missing feed format: ${format}`);

	return new Response((await feed)[metadata.generator](), {
		headers: { 'Content-Type': metadata.type }
	});
};
