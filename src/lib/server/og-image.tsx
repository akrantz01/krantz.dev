import type { FC } from 'hono/jsx';
import * as meta from '$lib/meta';
import ImageResponse from '@takumi-rs/image-response/wasm';
import takumi from '@takumi-rs/wasm/takumi_wasm_bg.wasm?module';
import notoSans400 from '@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2';
import notoSans800 from '@fontsource/noto-sans/files/noto-sans-latin-800-normal.woff2';
import icon from '$lib/assets/favicon.svg?as=png&svg-as';

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
			justifyContent: 'center',
			color: 'oklch(0.85 0.01 8)',
			backgroundColor: 'oklch(13% 0.126 8deg)',
			fontFamily: "'Noto Sans'",
			fontWeight: 400,
			fontStyle: 'normal',
			padding: '3.5rem'
		}}
	>
		<div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
			<div style={{ width: '256px', height: '256px' }}>
				<img src="icon" />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span style={{ fontSize: 80, fontWeight: 800 }}>{title}</span>
				<span style={{ fontSize: 40 }}>{description}</span>
			</div>
		</div>
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
		fonts: [
			// @ts-expect-error using a custom loader so woff2 is loaded as a Buffer, not string
			{ name: 'Noto Sans', data: notoSans400, weight: 400, style: 'normal' },
			// @ts-expect-error using a custom loader so woff2 is loaded as a Buffer, not string
			{ name: 'Noto Sans', data: notoSans800, weight: 800, style: 'normal' }
		],
		persistentImages: [
			{
				src: 'icon',
				data: icon
			}
		],
		drawDebugBorder: debug
	});

export default makeImage;
