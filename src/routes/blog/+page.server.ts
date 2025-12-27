import type { PageServerLoad } from './$types';
import { fs } from '$lib/server/posts';
import { compareDesc } from 'date-fns';

export const load: PageServerLoad = () => {
	const posts = fs.listWithFrontmatter();
	posts.sort((a, b) => compareDesc(a.meta.date, b.meta.date));
	return { posts };
};
