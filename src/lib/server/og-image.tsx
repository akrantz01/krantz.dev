import type { FC } from 'hono/jsx';
import * as meta from '$lib/meta';
import ImageResponse from '@takumi-rs/image-response/wasm';
import takumi from '@takumi-rs/wasm/takumi_wasm_bg.wasm?module';
import notoSans from '@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2';

interface Props {
	title?: string;
	description?: string;
}

const OpenGraphImage: FC<Props> = ({ title = meta.siteName, description = meta.description }) => (
	<div
		style={{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			color: 'oklch(0.85 0.01 8)',
			backgroundColor: 'oklch(13% 0.126 8deg)',
			fontFamily: "'Noto Sans'",
			fontWeight: 400,
			fontStyle: 'normal',
			padding: '60px'
		}}
	>
		<span style={{ fontSize: 32 }}>{title}</span>
		<span>{description}</span>
	</div>
);

interface Options extends Props {
	format?: 'webp' | 'png';
	debug?: boolean;
}

const makeImage = ({ format = 'webp', debug = false, ...props }: Options = {}) =>
	new ImageResponse(<OpenGraphImage {...props} />, {
		module: takumi,
		format: format,
		width: 1200,
		height: 630,
		devicePixelRatio: 1.0,
		// This can be removed once using cloudflare vite plugin
		// @ts-expect-error using a custom loader so woff2 is loaded as a Buffer, not string
		fonts: [{ name: 'Noto Sans', data: notoSans, weight: 400, style: 'normal' }],
		drawDebugBorder: debug
	});

export default makeImage;
