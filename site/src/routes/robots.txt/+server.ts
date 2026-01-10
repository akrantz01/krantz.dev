import { publicUrl } from '$lib/urls';

import type { RequestHandler } from './$types';

import { resolve } from '$app/paths';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(
		generate({
			rules: { name: '*' },
			sitemap: publicUrl(resolve('/sitemap.xml'))
		}),
		{ headers: { 'Content-Type': 'text/plain' } }
	);

interface Robots {
	rules: OneOrMore<UserAgent>;
	sitemap?: string;
}

interface UserAgent {
	name: OneOrMore<string>;
	allow?: OneOrMore<string>;
	disallow?: OneOrMore<string>;
}

const generate = (schema: Robots): string => {
	const lines = oneOrMore(schema.rules).map(generateGroup);
	if (schema.sitemap !== undefined) lines.push(`Sitemap: ${schema.sitemap}`);

	return lines.join('\n\n');
};

const generateGroup = (ua: UserAgent): string => {
	const names = oneOrMore(ua.name);
	const allow = oneOrMore(ua.allow);
	const disallow = oneOrMore(ua.disallow);

	if (names.length === 0) throw new Error('group must have at least one user agent');

	const lines = names.map((name) => `User-Agent: ${name}`);
	if (allow.length === 0 && disallow.length === 0) {
		lines.push('Disallow:');
	} else {
		lines.push(...allow.map((rule) => `Allow: ${rule}`));
		lines.push(...disallow.map((rule) => `Disallow: ${rule}`));
	}

	return lines.join('\n');
};

type OneOrMore<T> = T | T[];

const oneOrMore = <T>(value?: OneOrMore<T>): T[] => {
	if (value === undefined) return [];
	else if (Array.isArray(value)) return value;
	else return [value];
};
