import type { Plugin } from 'unified';
import type { Root, Node, RootContent } from 'hast';
import { toHtml } from 'hast-util-to-html';

export type ResultRoot = Result[];

export type Result = Html | CustomElement;

interface Html {
	type: 'html';
	html: string;
}

interface CustomElement {
	type: 'custom-element';
	name: string;
	properties: Record<string, unknown>;
	children: Result[];
}

const rehypeRender: Plugin<[], Root, ResultRoot> = function () {
	const isRoot = (node: Node): node is Root => node.type === 'root';

	this.compiler = (tree: Node): ResultRoot => {
		if (!isRoot(tree)) throw new Error('root node expected');
		return processNodes(tree.children);
	};
};

export default rehypeRender;

const processNodes = (nodes: RootContent[]): ResultRoot => {
	const results: Result[] = [];
	let htmlParts: string[] = [];

	const flushParts = () => {
		if (htmlParts.length > 0) {
			const html = htmlParts.join('');
			if (html) results.push({ type: 'html', html });
			htmlParts = [];
		}
	};

	for (const node of nodes) {
		if (node.type === 'custom-element') {
			throw new Error('not yet implemented');
		} else {
			htmlParts.push(toHtml(node));
		}
	}

	flushParts();
	return results;
};
