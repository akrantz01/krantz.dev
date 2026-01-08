import { prerender } from '$app/server';
import { highlight, setHostWasmModule } from '@krantz-dev/highlight';
import host from '@krantz-dev/highlight/host.wasm?module';
import * as z from 'zod';
import { once } from './once';

once(Symbol.for('highlighter'), () => {
	// TODO: register languages for highlighting
	setHostWasmModule(host);
});

const Schema = z.object({
	language: z.string(),
	text: z.string()
});

export const highlighter = prerender(
	Schema,
	async ({ language, text }) => highlight(language, text),
	{ dynamic: true }
);
