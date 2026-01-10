import type { RequestHandler } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

const OIDC_ISSUER_REL = 'http://openid.net/specs/connect/1.0/issuer';

export const GET: RequestHandler = ({ url }) => {
	const resource = parseResource(url.searchParams.get('resource'));
	if (resource === null)
		return Response.json({ error: 'missing or invalid resource' }, { status: 400 });

	if (resource.scheme !== 'acct') return Response.json({}, { status: 404 });
	if (!resource.name.endsWith('@' + url.hostname)) return Response.json({}, { status: 404 });

	const descriptor: JsonResourceDescriptor = {
		subject: `${resource.scheme}:${resource.name}`,
		links: []
	};

	const rels = url.searchParams.getAll('rel');
	if (rels.length === 0 || rels.includes(OIDC_ISSUER_REL)) {
		descriptor.links.push({ rel: OIDC_ISSUER_REL, href: env.OIDC_ISSUER_URL });
	}

	return Response.json(descriptor, {
		status: 200,
		headers: { 'Content-Type': 'application/jrd+json' }
	});
};

interface Resource {
	scheme: string;
	name: string;
}

function parseResource(raw: string | null): Resource | null {
	if (raw === null) return null;

	try {
		const resource = new URL(raw);
		return {
			scheme: resource.protocol.slice(0, -1),
			name: resource.hostname || resource.pathname
		};
	} catch {
		console.warn(`invalid resource: ${raw}`);
		return null;
	}
}

interface JsonResourceDescriptor {
	subject: string;
	links: Link[];
}

interface Link {
	rel: string;
	href: string;
}
