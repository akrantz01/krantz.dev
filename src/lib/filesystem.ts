export default class FileSystem {
	private content: Map<string, () => Promise<string>>;

	constructor(modules: Record<string, () => Promise<string>>) {
		const prefix = findDirectoryPrefix(Object.keys(modules));
		this.content = new Map(
			Object.entries(modules).map(([k, v]) => [k.substring(prefix.length), v])
		);
	}

	list(): string[] {
		return this.content.keys().toArray();
	}

	async read(name: string): Promise<string | null> {
		const reader = this.content.get(name);
		if (reader === undefined) return null;
		return reader();
	}

	exists(name: string): boolean {
		return this.content.has(name);
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
