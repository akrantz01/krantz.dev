import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string): param is 'atom' | 'json' | 'rss' =>
	param === 'atom' || param === 'json' || param === 'rss';
