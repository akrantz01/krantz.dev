const STORE = Symbol.for('internal:once');
const DUMMY_TOKEN = Symbol('internal:once:token');

export function once(key: symbol, fn: () => void) {
	oncePer(key, DUMMY_TOKEN, fn);
}

export function oncePer(key: symbol, token: unknown, fn: () => void) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const g = globalThis as any;
	const store: Map<symbol, unknown> = (g[STORE] ??= new Map());

	if (store.get(key) === token) return;

	store.set(key, token);
	fn();
}
