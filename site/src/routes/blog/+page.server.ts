import { compareDesc } from 'date-fns';

import { fs } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const posts = fs.listWithFrontmatter();
	posts.sort((a, b) => compareDesc(a.meta.date, b.meta.date));
	return { posts };
};
