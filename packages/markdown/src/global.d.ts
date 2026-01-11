import type { CustomElement } from './custom-elements';

declare module 'hast' {
	interface RootContentMap {
		customElement: CustomElement;
	}

	interface ElementContentMap {
		customElement: CustomElement;
	}
}
