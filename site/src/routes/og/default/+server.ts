import * as meta from '$lib/meta';
import render from '$lib/server/og-image';

import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) =>
	render(url, { type: 'default', title: meta.siteName, description: meta.description });
