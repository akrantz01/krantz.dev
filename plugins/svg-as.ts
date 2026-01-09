import type { Plugin } from 'vite';
import * as querystring from 'node:querystring';
import * as fs from 'node:fs/promises';
import sharp from 'sharp';

const MODULE_ID = '\0svg-as:';

const FORMATS: Record<string, (src: Buffer, width?: number, height?: number) => Promise<Buffer>> = {
	async png(src, width, height) {
		return await sharp(src, { density: 300 })
			.ensureAlpha()
			.resize({ width, height, fit: 'contain' })
			.png()
			.toBuffer();
	}
};

export default function vitePlugin(): Plugin {
	return {
		name: 'svg-as',
		enforce: 'pre',

		async resolveId(id) {
			const [path, qs] = id.split('?', 2);
			if (!(path.endsWith('.svg') && qs !== undefined)) return null;

			const { as, width, height, size } = querystring.parse(qs);

			const format = formatFromQuery(as);
			if (format === undefined) return null;

			const { width: w, height: h } = dimensionsFromQuery(width, height, size);

			this.debug(`converting '${path}' to '${format}' with size (${w}, ${h})`);
			return { id: `${MODULE_ID}${format}:${path}:${w},${h}` };
		},

		async load(id) {
			if (!id.startsWith(MODULE_ID)) return null;
			const [, format, path, dimensions] = id.split(':', 4);

			const encoder = FORMATS[format];
			if (encoder === undefined) this.error(`unknown format '${format}' for '${path}'`);

			const [width, height] = dimensions.split(':').map((n) => parseInt(n));
			if (width < 0 || height < 0) this.error(`dimensions for '${path}' must be greater than 0`);

			const source = await fs.readFile(path);
			const encoded = await encoder(source, width || undefined, height || undefined);

			return {
				code: [
					`const source = ${JSON.stringify(encoded.toString('base64'))};`,
					`const image = Buffer.from(source, "base64");`,
					`export default image;`
				].join('\n'),
				map: null
			};
		}
	};
}

const formatFromQuery = (raw: string | string[] | undefined): string | undefined => {
	if (raw === undefined) return undefined;
	return valueOf(raw).toLowerCase();
};

interface Dimensions {
	width: number;
	height: number;
}

const dimensionsFromQuery = (
	rawWidth: string | string[] | undefined,
	rawHeight: string | string[] | undefined,
	rawSize: string | string[] | undefined
): Dimensions => {
	const width = maybeNumber(rawWidth);
	const height = maybeNumber(rawHeight);
	const size = maybeNumber(rawSize);

	return { width: width ?? size ?? 0, height: height ?? size ?? 0 };
};

const valueOf = <T>(maybeArray: T | T[]): T =>
	Array.isArray(maybeArray) ? maybeArray[0] : maybeArray;

const maybeNumber = (raw: string | string[] | undefined): number | undefined => {
	if (raw === undefined) return undefined;
	return parseInt(valueOf(raw));
};
