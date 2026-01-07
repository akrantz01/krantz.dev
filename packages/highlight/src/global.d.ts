/// <reference types="vite/client" />

declare module '@arborium/*/grammar.js' {
	export function cancel(session: number): void;
	export function create_session(): number;
	export function free_session(session: number): void;
	export function injection_languages(): string[];
	export function language_id(): string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function parse(session: number): any;
	export function set_text(session: number, text: string): void;

	export interface InitOutput {
		readonly memory: WebAssembly.Memory;
		readonly cancel: (a: number) => void;
		readonly create_session: () => number;
		readonly free_session: (a: number) => void;
		readonly injection_languages: (a: number) => void;
		readonly language_id: (a: number) => void;
		readonly parse: (a: number, b: number) => void;
		readonly set_text: (a: number, b: number, c: number) => void;
		// There's also some other stuff in this interface but we don't care about it
	}

	export type SyncInitInput = BufferSource | WebAssembly.Module;
	export function initSync(module: { module: SyncInitInput }): InitOutput;

	export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;
	export default function __wbg_init(module_or_path: {
		module_or_path?: InitInput | Promise<InitInput>;
	}): Promise<InitOutput>;
}

declare module '$arborium-host/arborium_host.js' {
	export function highlight(language: string, source: string): Promise<string>;
	export function isLanguageAvailable(language: string): boolean;

	export interface InitOutput {
		readonly memory: WebAssembly.Memory;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		readonly highlight: (a: number, b: number, c: number, d: number) => any;
		readonly isLanguageAvailable: (a: number, b: number) => number;
		// There's also some other stuff in this interface but we don't care about it
	}

	export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;
	export default function __wbg_init(module_or_path: {
		module_or_path?: InitInput | Promise<InitInput>;
	}): Promise<InitOutput>;
}
