import type { RequestHandler } from './$types';
import render from '$lib/server/og-image';
import * as meta from '$lib/meta';
import { fs } from '$lib/server/posts';
import { error } from '@sveltejs/kit';

export const prerender = true;

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
