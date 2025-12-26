import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

import generateFavicons from './plugins/generate-favicons';

export default defineConfig({
	plugins: [devtoolsJson(), generateFavicons({ source: 'src/lib/assets/favicon.svg' }), sveltekit()]
});
