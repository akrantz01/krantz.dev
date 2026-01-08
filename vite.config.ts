import 'dotenv/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

import cloudflareWasm from './plugins/cloudflare-wasm';
import generateFavicons from './plugins/generate-favicons';

const allowedHosts = (process.env.VITE_ALLOWED_HOSTS ?? '')
	.split(',')
	.map((domain) => domain.trim());

export default defineConfig({
	plugins: [
		devtoolsJson(),
		generateFavicons({ source: 'src/lib/assets/favicon.svg' }),
		cloudflareWasm(),
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
