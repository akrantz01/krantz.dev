import * as z from 'zod';
import type { RequestHandler } from './$types';
import makeImage from '$lib/server/og-image';

export const GET: RequestHandler = ({ url }) => {
	const debug = z.parse(z.stringbool().catch(false), url.searchParams.get('debug'));

	return makeImage({ debug });
};
