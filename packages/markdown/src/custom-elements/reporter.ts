import { Node } from 'mdast';
import type { State } from 'mdast-util-to-hast';
import { VFile } from 'vfile';

export default class Reporter {
	private readonly file: VFile;

	constructor(state: State) {
		const file = state.options.file;
		if (file === null || file === undefined) throw new Error('invalid assumption: vfile missing');

		this.file = file;
	}

	info(message: string, node: Node) {
		this.file.info(message, { place: node.position });
	}

	warn(message: string, node: Node) {
		this.file.message(message, { place: node.position });
	}

	error(message: string, node: Node) {
		const msg = this.file.message(message, { place: node.position });
		msg.fatal = true;
	}
}
