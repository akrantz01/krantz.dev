import { error } from '@sveltejs/kit';

import { fs } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params: { slug } }) => {
	const path = slug + '.md';
	const content = fs.read(path);
	const meta = fs.frontmatter(path);
	if (content === null || meta === null) error(404, { message: 'Not found' });

	return { content, meta };
};
