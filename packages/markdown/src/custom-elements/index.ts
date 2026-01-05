import type { ElementContent, Parent, Properties } from 'hast';
import type { Node } from 'mdast';
import { type Handler } from 'mdast-util-to-hast';
import type { Options } from 'remark-rehype';

import textDirectives from './text-directives';
import { TextDirective } from 'mdast-util-directive';

export interface CustomElement extends Parent {
	type: 'custom-element';
	name: string;
	properties: Properties;
}

export const unknownHandler: Handler = (_state, node: Node): ElementContent | undefined => {
	switch (node.type) {
		case 'textDirective':
			// return textDirectives(node as TextDirective);
			throw new Error('not yet implemented');

		case 'leafDirective':
			throw new Error('not yet implemented');

		case 'containerDirective':
			throw new Error('not yet implemented');

		default:
			return undefined;
	}
};

const options: Options = { clobberPrefix: 'md-', unknownHandler };
export default options;
