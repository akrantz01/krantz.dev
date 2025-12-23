import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import generateFavicons from './plugins/generate-favicons';

export default defineConfig({
	plugins: [generateFavicons(), sveltekit()]
});
