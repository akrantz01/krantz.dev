import { Feed } from 'feed';
import { publicUrl, PUBLIC_URL } from '$lib/urls';
import { resolve } from '$app/paths';
import { Parser } from '$lib/markdown';
import { fs } from './posts';
import { compareDesc } from 'date-fns';

const feedLink = (ext: string): string =>
	publicUrl(resolve('/feed.[format=feed]', { format: ext }));

export type FeedGenerator = Pick<Feed, 'atom1' | 'json1' | 'rss2'>;

export default async function populateFeed(): Promise<Feed> {
	const parser = new Parser();

	// TODO: extract common metadata (i.e. title, description, etc) into shared location
	const feed = new Feed({
		title: 'Alex Krantz',
		description: 'My little corner of the internet',
		id: PUBLIC_URL,
		link: PUBLIC_URL,
		language: 'en',
		favicon: publicUrl('favicon.ico'),
		copyright: `All rights reserved ${new Date().getFullYear()}, Alex Krantz`,
		generator: 'krantz.dev',
		// TODO: choose based on last update to post
		updated: new Date(),
		feedLinks: {
			atom: feedLink('atom'),
			rss: feedLink('rss'),
			json: feedLink('json')
		}
	});

	const files = fs.listWithFrontmatter();
	files.sort((a, b) => compareDesc(a.meta.date, b.meta.date));

	const rendered = await Promise.all(files.map((f) => parser.render(fs.read(f.path)!)));
	for (let i = 0; i < files.length; i++) {
		const post = files[i];
		const url = publicUrl(resolve('/blog/[slug]', { slug: post.slug }));
		feed.addItem({
			id: url,
			title: post.meta.title,
			description: post.meta.description,
			// TODO: distinguished between updated (date) and published
			date: post.meta.date,
			published: post.meta.date,
			link: url,
			content: rendered[i]
		});
	}

	return feed;
}
