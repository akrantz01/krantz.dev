declare module 'hast' {
	interface RootContentMap {
		customElement: import('@krantz-dev/markdown').CustomElement;
	}

	interface ElementContentMap {
		customElement: import('@krantz-dev/markdown').CustomElement;
	}
}

declare module '@arborium/*/grammar.js' {
	export function cancel(session: number): void;
	export function create_session(): number;
	export function free_session(session: number): void;
	export function injection_languages(): string[];
	export function language_id(): string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function parse(session: number): any;
	export function set_text(session: number, text: string): void;

	export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;
	export default function __wbg_init(module_or_path: {
		module_or_path?: InitInput | Promise<InitInput>;
	}): Promise<unknown>;
}

// This can be removed once the @cloudflare/vite-plugin is being used
declare module '*.wasm?module' {
	const wasm: WebAssembly.Module;
	export default wasm;
}
