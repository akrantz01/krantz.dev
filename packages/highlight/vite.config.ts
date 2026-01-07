/// <reference types="vitest/config" />
import * as path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	resolve: {
		// Prefer non-browser conditional exports so SSR builds avoid DOM-only code paths.
		conditions: ['module', 'import', 'default'],
		alias: {
			'$arborium-host': path.join(import.meta.dirname, 'node_modules/@arborium/arborium/dist')
		}
	},
	plugins: [dts()],
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es']
		},
		target: 'esnext',
		sourcemap: true
	}
});
