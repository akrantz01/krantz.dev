import type { Plugin } from 'vite';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const MODULE_PREFIX = '\0wasm-module:';
const WASM_EXTENSIONS = ['.wasm', '.wasm?module'];

export default function vitePlugin(): Plugin {
	const additionalModulePaths = new Set<string>();
	let isBuild: boolean;

	return {
		name: 'cloudflare-wasm',
		enforce: 'pre',
		sharedDuringBuild: true,

		configResolved({ command }) {
			isBuild = command === 'build';
		},

		async resolveId(source, importer, options) {
			// Ignore virtual modules and non-wasm imports
			if (source.startsWith('\0') || source.startsWith('/@id/__x00__')) return null;
			if (!WASM_EXTENSIONS.some((ext) => source.endsWith(ext))) return null;

			this.debug(`resolving ${source}`);

			const resolved = await this.resolve(cleanUrl(source), importer, {
				...options,
				skipSelf: true
			});
			if (!resolved) throw new Error(`Import "${source}" not found. Does the file exist?`);

			this.debug(`resolved path: ${resolved.id}`);

			additionalModulePaths.add(resolved.id);

			const id = MODULE_PREFIX + resolved.id;
			this.debug(`registering virtual module: ${id}`);
			return { id };
		},

		async load(id) {
			if (!id.startsWith(MODULE_PREFIX)) return null;
			this.debug(`loading wasm module: ${id}`);

			const wasmPath = id.slice(MODULE_PREFIX.length);

			if (isBuild) {
				const fileName = path.basename(wasmPath);
				const source = await fs.readFile(wasmPath);

				const ref = this.emitFile({
					type: 'asset',
					name: fileName,
					originalFileName: wasmPath,
					needsCodeReference: true,
					source: source
				});

				const code = `
let wasm;
if (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') {
  const module = await import(/* @vite-ignore */ import.meta.ROLLUP_FILE_URL_${ref});
  wasm = module.default;
} else {
  const { readFile } = await import('node:fs/promises');
  const url = new URL(import.meta.ROLLUP_FILE_URL_${ref}, import.meta.url);
  const bytes = await readFile(url);
  wasm = await WebAssembly.compile(bytes);
}
export default wasm;
`.trim();
				return { code, map: null };
			} else {
				const code = `
import { readFile } from 'node:fs/promises';
const bytes = await readFile(${JSON.stringify(wasmPath)});
const wasm = await WebAssembly.compile(bytes);
export default wasm;
`.trim();
				return { code, map: null };
			}
		},

		hotUpdate({ file, server }) {
			if (additionalModulePaths.has(file)) {
				this.info(`WASM file changed: ${file}`);
				server.restart();
				return [];
			}
		}
	};
}

const postfixRE = /[?#].*$/;
const cleanUrl = (url: string): string => url.replace(postfixRE, '');
