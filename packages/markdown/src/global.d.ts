import type { CustomElement } from './custom-elements';
import type { ResultRoot } from './render';

declare module 'hast' {
	interface RootContentMap {
		customElement: CustomElement;
	}

	interface ElementContentMap {
		customElement: CustomElement;
	}
}

declare module 'unified' {
	interface CompileResultMap {
		ResultRoot: ResultRoot;
	}
}
