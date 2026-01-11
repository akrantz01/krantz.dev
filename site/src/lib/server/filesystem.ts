import matter from 'gray-matter';
import type { ZodType } from 'zod';
import * as z from 'zod';

const FILE_EXTENSION_REGEX = /\.[^.]+$/;

export class FileSystem<C> {
	protected readonly content: Map<string, C>;

	constructor(modules: Record<string, C>) {
		const prefix = findDirectoryPrefix(Object.keys(modules));
		this.content = new Map(
			Object.entries(modules).map(([k, v]) => [k.substring(prefix.length), v])
		);
	}

	list(): string[] {
		return this.content.keys().toArray();
	}

	read(name: string): C | null {
		const reader = this.content.get(name);
		if (reader === undefined) return null;
		return reader;
	}

	exists(name: string): boolean {
		return this.content.has(name);
	}
}

export interface MarkdownFile<M extends ZodType> {
	path: string;
	slug: string;
	meta: MetaOf<M>;
}

type MetaOf<S extends ZodType> = z.output<S>;

export class MarkdownFileSystem<S extends ZodType> extends FileSystem<string> {
	private readonly metadata: Map<string, MetaOf<S>>;

	constructor(
		modules: Record<string, string>,
		private readonly schema: S
	) {
		super(modules);

		this.metadata = new Map();
		this.content.forEach((value, path) => {
			const fm = matter(value, { language: 'yaml' });
			this.content.set(path, fm.content);

			const parsed = this.schema.safeParse(fm.data as unknown);
			if (!parsed.success) {
				throw new Error(`Invalid frontmatter for '${path}':\n${parsed.error}`);
			}
			this.metadata.set(path, parsed.data);
		});
	}

	listWithFrontmatter(): MarkdownFile<S>[] {
		return this.metadata
			.entries()
			.map(([path, meta]) => ({ path, slug: path.replace(FILE_EXTENSION_REGEX, ''), meta }))
			.toArray();
	}

	frontmatter(name: string): MetaOf<S> | null {
		const meta = this.metadata.get(name);
		if (meta === undefined) return null;
		return meta;
	}
}

function findDirectoryPrefix(paths: string[]): string {
	if (paths.length === 0) return '/';

	const directories = paths.map((p) => {
		const segments = p.split('/');
		segments.pop();
		return segments;
	});

	if (paths.length === 1) return directories[0].join('/') + '/';

	const minSegments = Math.min(...directories.map((s) => s.length));

	let prefix = 0;
	for (let i = 0; i < minSegments; i++) {
		const segment = directories[0][i];
		if (directories.every((segments) => segments[i] === segment)) prefix++;
		else break;
	}

	return directories[0].slice(0, prefix).join('/') + '/';
}
