import { unified, type Plugin, type Processor, type Transformer } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import type { Root as MdastRoot } from 'mdast';
import type { Root as HastRoot, Nodes as HastNode, Properties } from 'hast';
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Directives as DirectiveNode } from 'mdast-util-directive';
import { VFile } from 'vfile';

export type { MdastRoot, HastRoot, HastNode };

export interface ParseOptions {
	stripDirectives?: boolean;
}

export default class Parser {
	private readonly processor: Processor<MdastRoot, MdastRoot, HastRoot, HastRoot, string>;

	constructor() {
		this.processor = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkDirective)
			.use(remarkDirectiveHandler)
			.use(remarkRehype)
			.use(rehypeStringify)
			.freeze();
	}

	async parse(
		src: string,
		{ stripDirectives }: ParseOptions = { stripDirectives: false }
	): Promise<HastRoot> {
		const file = new VFile({ value: src, data: { stripDirectives } });
		const parsed = this.processor.parse(file);
		return this.processor.run(parsed, file);
	}

	async render(src: string): Promise<string> {
		const ast = await this.parse(src, { stripDirectives: true });
		return this.processor.stringify(ast);
	}
}

const remarkDirectiveHandler: Plugin = (): Transformer => (tree, file) => {
	if (file.data.stripDirectives) {
		visit(
			tree,
			['textDirective', 'leafDirective', 'containerDirective'],
			(_node, index, parent) => {
				if (parent && index !== undefined) {
					// @ts-expect-error type of parent is Node, but it can't be resolved for whatever reason
					parent.children.splice(index, 1);
					return index;
				}
			}
		);
	} else {
		visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], (node) => {
			if (isDirectiveNode(node)) {
				node.data = {
					hName: `d-${node.name}`,
					hProperties: node.attributes as Properties
				};
			}
		});
	}
};

const isDirectiveNode = (node: Node): node is DirectiveNode => {
	const { type } = node;
	return type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective';
};
