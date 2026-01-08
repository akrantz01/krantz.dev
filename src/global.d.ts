declare module 'hast' {
	interface RootContentMap {
		customElement: import('@krantz-dev/markdown').CustomElement;
	}

	interface ElementContentMap {
		customElement: import('@krantz-dev/markdown').CustomElement;
	}
}

// This can be removed once the @cloudflare/vite-plugin is being used
declare module '*.wasm?module' {
	const wasm: WebAssembly.Module;
	export default wasm;
}
