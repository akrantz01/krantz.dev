// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { CustomElement } from '@krantz-dev/markdown';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'hast' {
	interface RootContentMap {
		customElement: CustomElement;
	}

	interface ElementContentMap {
		customElement: CustomElement;
	}
}

export {};
