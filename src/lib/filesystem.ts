import matter from 'gray-matter';

export class FileSystem<C> {
	protected content: Map<string, C>;

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

export interface MarkdownFile<M extends { [key: string]: unknown }> {
	path: string;
	meta: M | null;
}

export class MarkdownFileSystem<M extends { [key: string]: unknown }> extends FileSystem<string> {
	private metadata: Map<string, M | null>;

	constructor(modules: Record<string, string>) {
		super(modules);

		this.metadata = new Map();
		this.content.forEach((value, path) => {
			const fm = matter(value, { language: 'yaml' });
			this.content.set(path, fm.content);
			this.metadata.set(path, fm.data);
		});
	}

	listWithMeta(): MarkdownFile<M>[] {
		return this.metadata
			.entries()
			.map(([path, meta]) => ({ path, meta }))
			.toArray();
	}

	meta(name: string): M | null {
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
