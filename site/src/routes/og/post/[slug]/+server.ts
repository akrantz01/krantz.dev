import { error } from '@sveltejs/kit';

import * as meta from '$lib/meta';
import render from '$lib/server/og-image';
import { fs } from '$lib/server/posts';

import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () =>
	fs.list().map((path) => ({ slug: path.replace(/\.md$/, '') }));

export const GET: RequestHandler = ({ url, params: { slug } }) => {
	const post = fs.frontmatter(slug + '.md');
	if (post === null) error(404, { message: 'Not found' });

	return render(url, {
		type: 'post',
		title: post.title,
		timestamp: post.date,
		siteName: meta.siteName,
		siteDescription: meta.description
	});
};
