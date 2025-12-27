import { unified, type Plugin, type Processor, type Transformer } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import type { Root as MdastRoot } from 'mdast';
import type { Root as HastRoot, Nodes as HastNode } from 'hast';
import { map } from 'unist-util-map';
import type { Node } from 'unist';
import type { Directives as DirectiveNode } from 'mdast-util-directive';

export type { MdastRoot, HastRoot, HastNode };

export default class Parser {
	private readonly processor: Processor<MdastRoot, MdastRoot, HastRoot, undefined, undefined>;

	constructor() {
		this.processor = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkDirective)
			.use(remarkDirectiveToElement)
			.use(remarkRehype)
			.freeze();
	}

	async parse(src: string): Promise<HastRoot> {
		const parsed = this.processor.parse(src);
		return this.processor.run(parsed);
	}
}

const remarkDirectiveToElement: Plugin = (): Transformer => (nodeTree) =>
	map(nodeTree, (node) => {
		if (!isDirectiveNode(node)) return node;

		// TODO: safely convert directive nodes to hast nodes
		return {
			...node,
			data: {
				hName: `d-${node.name}`,
				hProperties: node.attributes
			}
		};
	});

const isDirectiveNode = (node: Node): node is DirectiveNode => {
	const { type } = node;
	return type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective';
};
