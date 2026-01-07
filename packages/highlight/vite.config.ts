/// <reference types="vitest/config" />
import { copyFileSync } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, Plugin } from 'vite';
import dts from 'vite-plugin-dts';

const copyArboriumHost: Plugin = {
	name: 'copy-arborium-host',
	closeBundle() {
		const outDir = path.resolve(import.meta.dirname, 'dist');

		const arborium = import.meta.resolve('@arborium/arborium');
		const hostModule = new URL('arborium_host.js', arborium);
		const hostWasm = new URL('arborium_host_bg.wasm', arborium);

		copyFileSync(fileURLToPath(hostModule), path.resolve(outDir, 'arborium_host.js'));
		copyFileSync(fileURLToPath(hostWasm), path.resolve(outDir, 'arborium_host_bg.wasm'));
	}
};

export default defineConfig({
	resolve: {
		// Prefer non-browser conditional exports so SSR builds avoid DOM-only code paths.
		conditions: ['module', 'import', 'default']
	},
	plugins: [dts(), copyArboriumHost],
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es']
		},
		target: 'esnext',
		sourcemap: true,
		rollupOptions: {
			external: [fileURLToPath(new URL('src/arborium_host.js', import.meta.url))]
		}
	}
});
