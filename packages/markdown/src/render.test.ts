import type { Root } from 'hast';
import { unified } from 'unified';
import { describe, expect, test } from 'vitest';

import rehypeRender, { type ResultRoot } from './render';

describe('hast conversion', () => {
	const processor = unified().use(rehypeRender).freeze();
	const stringify = (node: Root): ResultRoot => processor.stringify(node);

	test('does nothing with empty root', () => {
		const rendered = stringify({ type: 'root', children: [] });
		expect(rendered).toStrictEqual([]);
	});

	test('passes through non-custom elements', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{ type: 'doctype' },
				{ type: 'comment', value: 'this is a test' },
				{
					type: 'element',
					tagName: 'p',
					properties: {},
					children: [{ type: 'text', value: 'hello world' }]
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<!doctype html><!--this is a test--><p>hello world</p>' }
		]);
	});

	test('handles custom elements', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{ type: 'custom-element', name: 'fancy', properties: { color: 'rainbow' }, children: [] }
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'custom-element', name: 'fancy', properties: { color: 'rainbow' }, children: [] }
		]);
	});
});
