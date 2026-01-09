import * as fs from 'node:fs/promises';
import path from 'node:path';
import sharp, { type Sharp } from 'sharp';
import * as svgo from 'svgo';
import type { Plugin } from 'vite';

import toIco from './ico';

interface SvgIcon {
	format: 'svg';
	name: string;
}

interface PngIcon {
	format: 'png';
	name: string;
	size: number;
}

interface IcoIcon {
	format: 'ico';
	name: string;
	sizes: number[];
}

type Icon = SvgIcon | PngIcon | IcoIcon;

const ICONS: Icon[] = [
	{ format: 'svg', name: 'favicon.svg' },
	{ format: 'ico', name: 'favicon.ico', sizes: [16, 32, 48] },
	{ format: 'png', name: 'favicon-16x16.png', size: 16 },
	{ format: 'png', name: 'favicon-32x32.png', size: 32 },
	{ format: 'png', name: 'favicon-48x48.png', size: 48 },
	{ format: 'png', name: 'favicon.png', size: 64 },
	{ format: 'png', name: 'favicon-96x96.png', size: 96 },
	{ format: 'png', name: 'apple-touch-icon.png', size: 180 },
	{ format: 'png', name: 'android-chrome-192x192.png', size: 192 },
	{ format: 'png', name: 'android-chrome-512x512.png', size: 512 }
];
const FORMAT_TO_CONTENT_TYPE = {
	ico: 'image/x-icon',
	png: 'image/png',
	svg: 'image/svg+xml'
};

interface Options {
	source?: string;
}

export default function vitePlugin(opts: Options = {}): Plugin {
	let srcPath: string;

	let running: Promise<void> | null = null;
	let cache: Map<string, Uint8Array> = new Map();

	async function populateCache(raw: string): Promise<void> {
		const optimized = optimizeSource(raw);
		const rendered = await Promise.all(ICONS.map((i) => generateIcon(optimized, i)));
		cache = new Map(ICONS.map((icon, i) => [icon.name, rendered[i]]));
	}

	async function updateCache(raw: string) {
		if (running !== null) return;
		running = populateCache(raw).finally(() => (running = null));
		return running;
	}

	return {
		name: 'generate-favicons',
		enforce: 'pre',
		configResolved(config) {
			srcPath = path.resolve(config.root, opts.source ?? 'src/favicon.svg');
		},
		async buildStart() {
			const raw = await this.fs.readFile(srcPath, { encoding: 'utf8' });
			updateCache(raw);
		},
		async renderStart() {
			await running;
			for (const [icon, rendered] of cache.entries()) {
				this.emitFile({
					type: 'asset',
					fileName: icon,
					source: rendered
				});
			}
		},
		async configureServer(server) {
			server.watcher.add(srcPath);
			server.watcher.on('change', async (file) => {
				if (file !== srcPath) return;

				this.info('favicon changed...');
				const raw = await fs.readFile(file, { encoding: 'utf8' });
				await updateCache(raw);
				this.info('favicon updated!');
			});

			for (const icon of ICONS) {
				server.middlewares.use(`/${icon.name}`, (_req, res, next) => {
					const rendered = cache.get(icon.name);
					if (!rendered) return next();

					res
						.writeHead(200, {
							'content-type': FORMAT_TO_CONTENT_TYPE[icon.format],
							'content-length': rendered.byteLength
						})
						.end(rendered);
				});
			}
		}
	};
}

function optimizeSource(raw: string): string {
	const optimized = svgo.optimize(raw, {
		multipass: true,
		plugins: [
			{
				name: 'preset-default',
				params: {
					overrides: {
						mergeStyles: false,
						inlineStyles: false,
						cleanupIds: false
					}
				}
			},
			'removeDimensions'
		]
	});
	return optimized.data;
}

async function generateIcon(svg: string, icon: Icon): Promise<Uint8Array> {
	switch (icon.format) {
		case 'svg':
			return Buffer.from(svg);
		case 'png':
			return toPng(svg, icon.size).toBuffer();
		case 'ico':
			return toIco(await Promise.all(icon.sizes.map((size) => toRaw(svg, size))));
	}
}

const toPng = (svg: string, size: number): Sharp =>
	sharp(Buffer.from(svg, 'utf8'), { density: 300 })
		.ensureAlpha()
		.resize(size, size, { fit: 'contain' })
		.png();

const toRaw = (svg: string, size: number) =>
	toPng(svg, size)
		.toColorspace('srgb')
		.raw({ depth: 'uchar' })
		.toBuffer({ resolveWithObject: true });
