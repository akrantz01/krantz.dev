import 'dotenv/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

import cloudflareAssetsPlugin from './plugins/cloudflare-assets';
import generateFavicons from './plugins/generate-favicons';
import svgAs from './plugins/svg-as';

const cloudflareAssets = cloudflareAssetsPlugin([
	{
		type: 'wasm',
		extensions: ['.wasm', '.wasm?module'],
		genBuild: {
			workerd: (exportName, ref) => [
				`const module = await import(/* @vite-ignore */ import.meta.ROLLUP_FILE_URL_${ref});`,
				`${exportName} = module.default;`
			],
			nodejs: (exportName, ref) => [
				`const { readFile } = await import('node:fs/promises');`,
				`const url = new URL(import.meta.ROLLUP_FILE_URL_${ref}, import.meta.url);`,
				`const bytes = await readFile(url);`,
				`${exportName} = await WebAssembly.compile(bytes);`
			]
		},
		genServe: (exportName, path) => [
			`import { readFile } from 'node:fs/promises';`,
			`const bytes = await readFile(${JSON.stringify(path)});`,
			`${exportName} = await WebAssembly.compile(bytes);`
		]
	},
	{
		type: 'font',
		extensions: ['.woff', '.woff2'],
		genBuild: {
			workerd: (exportName, ref) => [
				`const module = await import(/* @vite-ignore */ import.meta.ROLLUP_FILE_URL_${ref});`,
				`${exportName} = module.default;`
			],
			nodejs: (exportName, ref) => [
				`const { readFile } = await import('node:fs/promises');`,
				`const url = new URL(import.meta.ROLLUP_FILE_URL_${ref}, import.meta.url);`,
				`${exportName} = await readFile(url);`
			]
		},
		genServe: (exportName, path) => [
			`import { readFile } from 'node:fs/promises';`,
			`${exportName} = await readFile(${JSON.stringify(path)});`
		]
	}
]);

const allowedHosts = (process.env.VITE_ALLOWED_HOSTS ?? '')
	.split(',')
	.map((domain) => domain.trim());

export default defineConfig({
	plugins: [
		devtoolsJson(),
		generateFavicons({ source: 'src/lib/assets/favicon.svg' }),
		cloudflareAssets,
		svgAs(),
		sveltekit()
	],
	server: {
		allowedHosts,
		fs: {
			allow: [searchForWorkspaceRoot(import.meta.dirname)]
		}
	},
	preview: { allowedHosts }
});
