import type { ParseResult } from '@arborium/arborium';
import * as arboriumHost from '$arborium-host/arborium_host.js';

import { loadLanguage, hasLanguage, type InitializedLanguagePlugin } from './languages';

const handles = new Map<number, InitializedLanguagePlugin>();
let nextHandle = 1;

export function resetHandles() {
	handles.clear();
	// We don't reset the nextHandle to ensure uniqueness
}

function setupHostInterface(): void {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).arboriumHost = {
		isLanguageAvailable(language: string): boolean {
			return hasLanguage(language);
		},

		async loadGrammar(language: string): Promise<number> {
			const plugin = await loadLanguage(language);
			if (plugin === null) return 0;

			for (const [handle, p] of handles) {
				if (p === plugin) return handle;
			}

			const handle = nextHandle++;
			handles.set(handle, plugin);
			return handle;
		},

		parse(handle: number, text: string): ParseResult {
			const plugin = handles.get(handle);
			if (plugin === undefined) return { spans: [], injections: [] };
			return plugin.parse(text);
		}
	};
}

interface HostModule {
	highlight: (language: string, source: string) => Promise<string>;
	isLanguageAvailable: (language: string) => boolean;
}

let hostWasm: WebAssembly.Module | null = null;
let hostModule: HostModule | null = null;
let hostLoadPromise: Promise<HostModule | null> | null = null;

export function setHostWasmModule(module: WebAssembly.Module) {
	if (hostWasm !== null) throw new Error('host webassembly module already set');
	hostWasm = module;
}

export default async function loadHost(): Promise<HostModule | null> {
	if (hostModule !== null) return hostModule;
	if (hostLoadPromise !== null) return hostLoadPromise;

	if (hostWasm === null)
		throw new Error('host webassembly module not set. call setHostWasmModule() first');

	hostLoadPromise = (async () => {
		setupHostInterface();

		console.debug('[highlight] loading host module');
		try {
			await arboriumHost.default({ module_or_path: hostWasm });

			hostModule = {
				highlight: arboriumHost.highlight,
				isLanguageAvailable: arboriumHost.isLanguageAvailable
			};
			console.debug(`[highlight] host loaded successfully`);
			return hostModule;
		} catch (e) {
			console.error(`[highlight] failed to load host:`, e);
			return null;
		}
	})();

	return hostLoadPromise;
}
