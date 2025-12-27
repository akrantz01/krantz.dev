import type { RequestHandler } from './$types';
import { js2xml, type Element } from 'xml-js';
import { fs, Metadata } from '$lib/server/posts';
import type { MarkdownFile } from '$lib/server/filesystem';
import { publicUrl } from '$lib/urls';
import { resolve } from '$app/paths';
import { UTCDate } from '@date-fns/utc';
import { format } from 'date-fns';
import { feedLink, SUPPORTED_FORMATS } from '$lib/server/feed';

export const prerender = true;

export const GET: RequestHandler = () => {
	const document = {
		declaration: {
			attributes: {
				version: '1.0',
				encoding: 'UTF-8'
			}
		},
		elements: [
			{
				type: 'element',
				name: 'urlset',
				attributes: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
					'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
					'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1'
				},
				elements: [
					makeUrl({ location: publicUrl(resolve('/')), lastModified: new Date() }),
					makeUrl({ location: publicUrl(resolve('/blog')), lastModified: new Date() }),
					...fs.listWithFrontmatter().map(postToUrl),
					...SUPPORTED_FORMATS.map((format) =>
						makeUrl({ location: feedLink(format), lastModified: new Date(), priority: 0.1 })
					)
				]
			}
		]
	} satisfies Element;

	return new Response(js2xml(document, { ignoreComment: true, spaces: 4 }), {
		headers: { 'Content-Type': 'application/xml' }
	});
};

const postToUrl = (post: MarkdownFile<typeof Metadata>): Element =>
	makeUrl({
		location: publicUrl(resolve('/blog/[slug]', { slug: post.slug })),
		lastModified: post.meta.lastModified ?? post.meta.date
	});

interface Url {
	location: string;
	lastModified: Date;
	priority?: number;
	extra?: Element[];
}

const makeUrl = ({ location, lastModified, priority, extra = [] }: Url): Element => {
	const children: Element[] = [
		{ type: 'element', name: 'loc', elements: [{ type: 'text', text: location }] },
		{
			type: 'element',
			name: 'lastmod',
			elements: [{ type: 'text', text: w3cDate(lastModified) }]
		},
		...extra
	];

	if (priority !== undefined) {
		if (priority > 1 || priority < 0) throw new Error('priority must be between 0 and 1');
		children.push({
			type: 'element',
			name: 'priority',
			elements: [{ type: 'text', text: priority.toString() }]
		});
	}

	return { type: 'element', name: 'url', elements: children };
};

const w3cDate = (date: Date): string =>
	format(new UTCDate(date.getTime()), "yyyy-MM-dd'T'hh:mm:ss'Z'");
