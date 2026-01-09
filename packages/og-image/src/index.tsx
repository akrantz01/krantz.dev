import ImageResponse from '@takumi-rs/image-response/wasm';
import type { Font } from '@takumi-rs/wasm';
import DefaultImage from './DefaultImage';
import PostImage from './PostImage';

interface DefaultImage {
	type: 'default';
	title: string;
	description: string;
}

interface PostImage {
	type: 'post';
	title: string;
	timestamp: Date;
	siteName: string;
	siteDescription: string;
}

export type Image = DefaultImage | PostImage;

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

const selectImage = (image: Image) => {
	switch (image.type) {
		case 'default':
			return <DefaultImage title={image.title} description={image.description} />;
		case 'post':
			return (
				<PostImage
					title={image.title}
					date={image.timestamp}
					site={{ title: image.siteName, description: image.siteDescription }}
				/>
			);
	}
};
