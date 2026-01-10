import type { ElementContent } from 'hast';
import type { ContainerDirective } from 'mdast-util-directive';

import Reporter from './reporter';

const containerDirectives = (
	reporter: Reporter,
	node: ContainerDirective
): ElementContent | undefined => {
	switch (node.name) {
		default:
			reporter.warn(`unsupported container directive '${node.name}'`, node);
			return undefined;
	}
};
export default containerDirectives;
