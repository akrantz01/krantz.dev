import type { PageServerLoad } from './$types';
import { MarkdownFileSystem } from '$lib/filesystem';
import * as z from 'zod';

const Metadata = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	date: z.date()
});

const fs = new MarkdownFileSystem(
	import.meta.glob<string>('$content/posts/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}),
	Metadata
);

export const load: PageServerLoad = () => ({ posts: fs.listWithFrontmatter() });
