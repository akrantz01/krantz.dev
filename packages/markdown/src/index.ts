import { unified, type Processor } from 'unified';
import type { Root as MdastRoot } from 'mdast';
import type { Root as HastRoot } from 'hast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkEmoji from 'remark-emoji';
import remarkRehype from 'remark-rehype';
import type { VFileMessage } from 'vfile-message';
import type { Point, Position } from 'unist';

import rehypeRender, { type ResultRoot } from './render';
import remarkRehypeOptions from './custom-elements';

const processor: Processor<MdastRoot, MdastRoot, HastRoot, HastRoot, ResultRoot> = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkDirective)
	.use(remarkEmoji, { accessible: true })
	.use(remarkRehype, remarkRehypeOptions)
	.use(rehypeRender)
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
	result: ResultRoot;
	messages: Message[];
}

export async function render(src: string): Promise<Rendered> {
	const { messages, result } = await processor.process(src);
	return { result, messages: messages.map(convertMessage) };
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
