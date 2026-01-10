import * as z from 'zod';

import { MarkdownFileSystem } from '$lib/server/filesystem';

export const Metadata = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	date: z.date(),
	lastModified: z.date().nullable()
});

export const fs = new MarkdownFileSystem(
	import.meta.glob<string>('$content/posts/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}),
	Metadata
);
