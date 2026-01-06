/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	resolve: {
		// Prefer non-browser conditional exports so SSR builds avoid DOM-only code paths.
		conditions: ['module', 'import', 'default']
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
