import { PUBLIC_BASE_URL } from '$env/static/public';

export const PUBLIC_URL = new URL(PUBLIC_BASE_URL);

export const PUBLIC_URL_STRING = PUBLIC_URL.toString();

export const publicUrl = (path: string): string => new URL(path, PUBLIC_URL).toString();
