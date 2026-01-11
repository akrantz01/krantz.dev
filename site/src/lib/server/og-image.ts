import notoSans400 from '@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2';
import notoSans800 from '@fontsource/noto-sans/files/noto-sans-latin-800-normal.woff2';
import renderImage, { type Image } from '@krantz-dev/og-image';
import takumi from '@takumi-rs/wasm/takumi_wasm_bg.wasm?module';
import * as z from 'zod';

import icon from '$lib/assets/favicon.svg?as=png&svg-as';

import { dev } from '$app/environment';

const render = (url: URL, image: Image) => {
	const debug = dev && z.parse(z.stringbool().catch(false), url.searchParams.get('debug'));

	return renderImage(image, {
		module: takumi,
		format: 'png',
		debug,
		images: [{ src: 'icon', data: icon }],
		// This can be removed once using cloudflare vite plugin
		fonts: [
			// @ts-expect-error using a custom loader so woff2 is loaded as a Buffer, not string
			{ name: 'Noto Sans', data: notoSans400, weight: 400, style: 'normal' },
			// @ts-expect-error using a custom loader so woff2 is loaded as a Buffer, not string
			{ name: 'Noto Sans', data: notoSans800, weight: 800, style: 'normal' }
		]
	});
};

export default render;
