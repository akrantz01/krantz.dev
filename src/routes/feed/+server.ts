import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { resolve } from '$app/paths';

export const prerender = true;

export const GET: RequestHandler = () =>
	redirect(308, resolve('/feed.[format=feed]', { format: 'atom' }));
