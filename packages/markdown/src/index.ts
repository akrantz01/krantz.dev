import { unified, type Processor } from 'unified';
import type { Root as MdastRoot } from 'mdast';
import type { Root as HastRoot } from 'hast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';

import rehypeRender, { type ResultRoot } from './render';
import remarkRehypeOptions from './custom-elements';

const processor: Processor<MdastRoot, MdastRoot, HastRoot, HastRoot, ResultRoot> = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkDirective)
	.use(remarkRehype, remarkRehypeOptions)
	.use(rehypeRender)
	.freeze();

export async function render(src: string): Promise<ResultRoot> {
	const { result } = await processor.process(src);
	return result;
}
