import { PUBLIC_BASE_URL } from '$env/static/public';

export const PUBLIC_URL = new URL(PUBLIC_BASE_URL).toString();

export const publicUrl = (path: string): string => {
	const base = new URL(PUBLIC_URL);
	base.pathname = path;
	return base.toString();
};
