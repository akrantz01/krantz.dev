import { Feed } from 'feed';
import { renderToString } from '@krantz-dev/markdown';
import { publicUrl, PUBLIC_URL } from '$lib/urls';
import { resolve } from '$app/paths';
import { fs } from './posts';
import { compareDesc } from 'date-fns';
import * as meta from '$lib/meta';

export const SUPPORTED_FORMATS = ['atom', 'rss', 'json'];

export const feedLink = (ext: string): string =>
	publicUrl(resolve('/feed.[format=feed]', { format: ext }));

export type FeedGenerator = Pick<Feed, 'atom1' | 'json1' | 'rss2'>;

export default async function populateFeed(): Promise<Feed> {
	const feed = new Feed({
		title: meta.siteName,
		description: meta.description,
		id: PUBLIC_URL,
		link: PUBLIC_URL,
		language: meta.language,
		favicon: publicUrl('favicon.ico'),
		copyright: `All rights reserved ${new Date().getFullYear()}, ${meta.author}`,
		generator: 'krantz.dev',
		author: { name: meta.author },
		feedLinks: Object.fromEntries(SUPPORTED_FORMATS.map((format) => [format, feedLink(format)]))
	});

	const files = fs.listWithFrontmatter();

	const byLastModified = files.toSorted((a, b) =>
		compareDesc(a.meta.lastModified ?? a.meta.date, b.meta.lastModified ?? b.meta.date)
	);
	feed.options.updated = byLastModified[0].meta.lastModified ?? byLastModified[0].meta.date;

	const rendered = await Promise.all(
		files
			.toSorted((a, b) => compareDesc(a.meta.date, b.meta.date))
			.map((f) => renderToString(fs.read(f.path)!))
	);
	for (let i = 0; i < files.length; i++) {
		const post = files[i];
		const url = publicUrl(resolve('/blog/[slug]', { slug: post.slug }));
		feed.addItem({
			id: url,
			title: post.meta.title,
			description: post.meta.description,
			date: post.meta.lastModified ?? post.meta.date,
			published: post.meta.date,
			link: url,
			content: rendered[i]
		});
	}

	return feed;
}
