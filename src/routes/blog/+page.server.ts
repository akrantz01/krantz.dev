import type { PageServerLoad } from './$types';
import { fs } from '$lib/server/posts';

export const load: PageServerLoad = () => ({ posts: fs.listWithFrontmatter() });
