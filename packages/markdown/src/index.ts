import { unified, type Processor } from 'unified';
import type { Root as MdastRoot, Nodes as MdastNode } from 'mdast';
import type { Root as HastRoot, Nodes as HastNode } from 'hast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkEmoji from 'remark-emoji';
import remarkRehype from 'remark-rehype';
import type { Point, Position } from 'unist';
import { VFile } from 'vfile';
import type { VFileMessage } from 'vfile-message';
import { remove } from 'unist-util-remove';

import remarkRehypeOptions from './custom-elements';
import { toHtml } from 'hast-util-to-html';

const processor: Processor<MdastRoot, MdastRoot, HastRoot, undefined, undefined> = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkDirective)
	.use(remarkEmoji, { accessible: true })
	.use(remarkRehype, remarkRehypeOptions)
	.freeze();

export type MessageStatus = 'error' | 'warning' | 'info';

export interface Location {
	line: number;
	column: number;
	offset?: number;
}

export interface Message {
	type: MessageStatus;
	text: string;
	start: Location;
	end?: Location;
}

export interface Rendered {
	ast: HastRoot;
	messages: Message[];
}

export type { CustomElement } from './custom-elements';
export type { HastRoot, HastNode, MdastRoot, MdastNode };

export async function render(src: string): Promise<Rendered> {
	const file = new VFile(src);
	const ast = processor.parse(file);
	const html = await processor.run(ast, file);

	return { ast: html, messages: file.messages.map(convertMessage) };
}

export async function renderToString(src: string): Promise<string> {
	const { ast } = await render(src);
	remove(ast, 'custom-element');
	return toHtml(ast);
}

const convertMessage = (vmsg: VFileMessage): Message => {
	const place = vmsg.place;
	if (place === undefined) throw new Error('invalid assumption: place cannot be undefined');

	const hasEnd = isPosition(place);

	return {
		type: toStatus(vmsg),
		text: vmsg.reason,
		start: hasEnd ? place.start : place,
		end: hasEnd ? place.end : undefined
	};
};

const isPosition = (value: Point | Position): value is Position => {
	const maybePosition = value as Position;
	return typeof maybePosition.start === 'object' && typeof maybePosition.end === 'object';
};

const toStatus = (vmsg: VFileMessage): MessageStatus => {
	switch (vmsg.fatal) {
		case true:
			return 'error';
		case false:
			return 'warning';
		case undefined:
		case null:
			return 'info';
	}
};
