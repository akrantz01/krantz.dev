import { prerender } from '$app/server';
import { highlight } from '@krantz-dev/highlight';
import * as z from 'zod';

// TODO: register languages for highlighting

const Schema = z.object({
	language: z.string(),
	text: z.string()
});

const highlighter = prerender(Schema, async ({ language, text }) => highlight(language, text));

export default highlighter;
