import ImageResponse from '@takumi-rs/image-response/wasm';
import type { Font } from '@takumi-rs/wasm';
import DefaultImage from './DefaultImage';

interface DefaultImage {
	type: 'default';
	title: string;
	description: string;
}

export type Image = DefaultImage;

interface InputImage {
	src: string;
	data: Buffer;
}

export interface Options {
	format?: 'webp' | 'png';
	debug?: boolean;
	module: WebAssembly.Module;
	images?: InputImage[];
	fonts?: Font[];
}

export default function render(
	image: Image,
	{ module, fonts, images, format = 'webp', debug = false }: Options
) {
	return new ImageResponse(selectImage(image), {
		module,
		format,
		width: 1200,
		height: 630,
		fonts,
		persistentImages: images,
		drawDebugBorder: debug
	});
}

const selectImage = ({ type, ...props }: Image) => {
	switch (type) {
		case 'default':
			return <DefaultImage {...props} />;
	}
};
