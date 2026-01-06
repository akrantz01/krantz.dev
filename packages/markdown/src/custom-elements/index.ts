import type { ElementContent, Parent, Properties } from 'hast';
import type { Node } from 'mdast';
import type { Handler } from 'mdast-util-to-hast';
import type { Options } from 'remark-rehype';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';

import containerDirectives from './container-directive';
import leafDirectives from './leaf-directive';
import textDirectives from './text-directives';
import Reporter from './reporter';

export interface CustomElement extends Parent {
	type: 'custom-element';
	name: string;
	properties: Properties;
}

export const unknownHandler: Handler = (state, node: Node): ElementContent | undefined => {
	const reporter = new Reporter(state);

	switch (node.type) {
		case 'textDirective':
			return textDirectives(reporter, node as TextDirective);

		case 'leafDirective':
			return leafDirectives(reporter, node as LeafDirective);

		case 'containerDirective':
			return containerDirectives(reporter, node as ContainerDirective);

		default:
			return undefined;
	}
};

const options: Options = { clobberPrefix: 'md-', unknownHandler };
export default options;
