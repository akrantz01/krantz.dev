import type { ElementContent } from 'hast';
import type { LeafDirective } from 'mdast-util-directive';

import Reporter from './reporter';

const leafDirectives = (reporter: Reporter, node: LeafDirective): ElementContent | undefined => {
	switch (node.name) {
		default:
			reporter.warn(`unsupported leaf directive '${node.name}'`, node);
			return undefined;
	}
};
export default leafDirectives;
