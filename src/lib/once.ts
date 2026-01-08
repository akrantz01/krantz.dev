const STORE = Symbol.for('internal:once');
const DUMMY_TOKEN = Symbol('internal:once:token');

export async function once(key: symbol, fn: () => Promise<void> | void) {
	await oncePer(key, DUMMY_TOKEN, fn);
}

export async function oncePer(key: symbol, token: unknown, fn: () => Promise<void> | void) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const g = globalThis as any;
	const store: Map<symbol, unknown> = (g[STORE] ??= new Map());

	if (store.get(key) === token) return;

	store.set(key, token);
	await fn();
}
