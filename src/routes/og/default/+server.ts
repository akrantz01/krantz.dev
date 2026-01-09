import type { RequestHandler } from './$types';
import render from '$lib/server/og-image';
import * as meta from '$lib/meta';

export const prerender = true;

export const GET: RequestHandler = ({ url }) =>
	render(url, { type: 'default', title: meta.siteName, description: meta.description });
