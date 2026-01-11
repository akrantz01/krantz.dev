import type { ElementContent } from 'hast';
import type { TextDirective } from 'mdast-util-directive';

import Reporter from './reporter';

const textDirectives = (reporter: Reporter, node: TextDirective): ElementContent | undefined => {
	switch (node.name) {
		default:
			reporter.warn(`unsupported text directive '${node.name}'`, node);
			return undefined;
	}
};
export default textDirectives;
