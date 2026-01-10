import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { Plugin } from 'vite';

const MODULE_PREFIX = '\0cf-asset:';
const MODULE_REGEXP = /^\0cf-asset:([a-z]+):(.+)$/g;

interface GenBuild {
	workerd: (exportName: string, ref: string) => string[];
	nodejs: (exportName: string, ref: string) => string[];
}

interface Asset {
	type: string;
	extensions: string[];
	genBuild: GenBuild;
	genServe: (exportName: string, path: string) => string[];
}

export default function cloudflareAssetsPlugin(assets: Asset[]): Plugin {
	const typeToAsset = new Map<string, Asset>();
	for (const asset of assets) {
		if (typeToAsset.has(asset.type))
			throw new Error(`asset type '${asset.type}' is already defined`);

		typeToAsset.set(asset.type, asset);
	}

	const additionalModulePaths = new Set<string>();
	let isBuild: boolean;

	return {
		name: 'cloudflare-assets',
		enforce: 'pre',
		sharedDuringBuild: true,

		configResolved({ command }) {
			isBuild = command === 'build';
		},

		async resolveId(source, importer, options) {
			// Ignore virtual modules and non-asset imports
			if (source.startsWith('\0') || source.startsWith('/@id/__x00__')) return null;

			const asset = assets.find((asset) => asset.extensions.some((ext) => source.endsWith(ext)));
			if (asset === undefined) return null;

			this.debug(`resolving ${asset.type} asset ${source}`);

			const resolved = await this.resolve(cleanUrl(source), importer, {
				...options,
				skipSelf: true
			});
			if (!resolved) throw new Error(`Import "${source}" not found. Does the file exist?`);

			this.debug(`resolved path: ${resolved.id}`);

			additionalModulePaths.add(resolved.id);

			if (resolved.id.startsWith(MODULE_PREFIX)) {
				this.debug(`forwarding existing virtual module`);
				return { id: resolved.id };
			} else {
				const id = `${MODULE_PREFIX}${asset.type}:${resolved.id}`;
				this.debug(`registering virtual module: ${id}`);
				return { id };
			}
		},

		async load(id) {
			const asset = extractAsset(id);
			if (asset === null) return null;
			this.debug(`loading ${asset.type} asset: ${asset.path}`);

			const assetDef = typeToAsset.get(asset.type);
			if (assetDef === undefined) {
				this.warn(`asset definition '${asset.type}' not found for ${id}`);
				return null;
			}

			const exportName = 'cfAsset_' + randomHex(6);

			const code = [`let ${exportName};`];
			if (isBuild) {
				const fileName = path.basename(asset.path);
				const source = await fs.readFile(asset.path);

				const ref = this.emitFile({
					type: 'asset',
					name: fileName,
					originalFileName: asset.path,
					needsCodeReference: true,
					source
				});

				code.push(
					`if (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') {`
				);
				code.push(...assetDef.genBuild.workerd(exportName, ref));
				code.push(`} else {`);
				code.push(...assetDef.genBuild.nodejs(exportName, ref));
				code.push(`}`);
			} else {
				code.push(...assetDef.genServe(exportName, asset.path));
			}

			code.push(`export default ${exportName};`);
			return { code: code.join('\n'), map: null };
		},

		hotUpdate({ file, server }) {
			if (additionalModulePaths.has(file)) {
				this.info(`asset changed: ${file}`);
				server.restart();
				return [];
			}
		}
	};
}

const extractAsset = (id: string) => {
	const matches = id.matchAll(MODULE_REGEXP);
	if (matches === null) return null;

	const { value } = matches.next();
	if (value === undefined) return null;

	const [, type, path] = value;
	return { type, path };
};

const postfixRE = /[?#].*$/;
const cleanUrl = (url: string): string => url.replace(postfixRE, '');

const hexCharset = '1234567890ABCDEF';
const randomHex = (length: number): string => {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += hexCharset.charAt(Math.floor(Math.random() * hexCharset.length));
	}
	return result;
};
