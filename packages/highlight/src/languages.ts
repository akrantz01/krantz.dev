import type { ParseResult } from '@arborium/arborium';

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface WasmBindgenPlugin {
	default: (module: { module_or_path?: InitInput | Promise<InitInput> }) => Promise<unknown>;
	language_id: () => string;
	injection_languages: () => string[];
	create_session: () => number;
	free_session: (session: number) => void;
	set_text: (session: number, text: string) => void;
	parse: (session: number) => ParseResult;
	cancel: (session: number) => void;
}

export interface UninitializedLanguagePlugin {
	initialized: false;
	grammar: WasmBindgenPlugin;
	wasm: WebAssembly.Module;
}

export interface InitializedLanguagePlugin {
	initialized: true;
	injectionLanguages: string[];
	module: WasmBindgenPlugin;
	parse: (text: string) => ParseResult;
}

export type LanguagePlugin = InitializedLanguagePlugin | UninitializedLanguagePlugin;

const aliases = new Map<string, string>();
const languages = new Map<string, LanguagePlugin>();

export function resetLanguages() {
	aliases.clear();
	languages.clear();
}

export interface LanguageOptions {
	aliases?: string[];
}

export function registerLanguage(
	id: string,
	grammar: WasmBindgenPlugin,
	wasm: WebAssembly.Module,
	options?: LanguageOptions
) {
	if (languages.has(id)) throw new Error(`language ${id} is already registered`);

	if (options?.aliases !== undefined) {
		for (const alias of options.aliases) {
			const existing = aliases.get(alias);
			if (existing !== undefined && existing !== id)
				throw new Error(`language alias ${alias} is already defined for ${existing}`);

			aliases.set(alias, id);
		}
	}

	languages.set(id, {
		initialized: false,
		grammar,
		wasm
	});
}

export function hasLanguage(id: string): boolean {
	return languages.has(id) || aliases.has(id);
}

function resolveAlias(id: string): LanguagePlugin | undefined {
	const direct = languages.get(id);
	if (direct !== undefined) return direct;

	const resolved = aliases.get(id);
	if (resolved === undefined) return undefined;
	return languages.get(resolved);
}

export async function loadLanguage(id: string): Promise<InitializedLanguagePlugin | null> {
	const language = resolveAlias(id);
	if (language === undefined) {
		console.warn(`[highlight] language '${id}' not available`);
		return null;
	}

	if (language.initialized) {
		console.debug(`[highlight] language '${id}' already loaded`);
		return language;
	}

	try {
		console.debug(`[highlight] loading language '${id}'`);

		const { grammar, wasm } = language;
		await grammar.default({ module_or_path: wasm });

		const loadedId = grammar.language_id();
		if (loadedId !== id)
			console.warn(`[highlight] language id mismatch: expected '${id}', got '${loadedId}'`);

		const injectionLanguages = grammar.injection_languages();
		const plugin: InitializedLanguagePlugin = {
			initialized: true,
			injectionLanguages,
			module: grammar,
			parse: (text: string) => {
				const session = grammar.create_session();
				try {
					grammar.set_text(session, text);
					const result = grammar.parse(session);
					return { spans: result.spans || [], injections: result.injections || [] };
				} catch (e) {
					console.error(`[highlight] parse error:`, e);
					return { spans: [], injections: [] };
				} finally {
					grammar.free_session(session);
				}
			}
		} satisfies InitializedLanguagePlugin;

		languages.set(id, plugin);
		console.debug(`[highlight] language '${id}' loaded successfully`);
		return plugin;
	} catch (e) {
		console.error(`[highlight] failed to load language '${id}':`, e);
		return null;
	}
}
