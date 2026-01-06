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
			{
				type: 'html',
				html: '<!doctype html><!--this is a test--><p>hello world</p>',
				key: '0:html'
			}
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
			{
				type: 'custom-element',
				name: 'fancy',
				properties: { color: 'rainbow' },
				children: [],
				key: '0:custom'
			}
		]);
	});

	test('splits html around nested custom elements', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'p',
					properties: {},
					children: [
						{ type: 'text', value: 'hello ' },
						{ type: 'custom-element', name: 'fancy', properties: {}, children: [] },
						{ type: 'text', value: 'world' }
					]
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<p>hello ', key: '0:open' },
			{ type: 'custom-element', name: 'fancy', properties: {}, children: [], key: '0.1:custom' },
			{ type: 'html', html: 'world</p>', key: '0.2:html' }
		]);
	});

	test('serializes attributes and escapes values', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'input',
					properties: { className: ['a', 'b'], disabled: true, title: 'a"b & c' },
					children: []
				}
			]
		});
		expect(rendered).toStrictEqual([
			{
				type: 'html',
				html: '<input class="a b" disabled title="a&#x22;b &#x26; c">',
				key: '0:open'
			}
		]);
	});

	test('escapes text nodes by default', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'p',
					properties: {},
					children: [{ type: 'text', value: '<&' }]
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<p>&#x3C;&#x26;</p>', key: '0:open' }
		]);
	});

	test('does not escape text in script/style', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'script',
					properties: {},
					children: [{ type: 'text', value: '<&' }]
				},
				{
					type: 'element',
					tagName: 'style',
					properties: {},
					children: [{ type: 'text', value: '<&' }]
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<script><&</script><style><&</style>', key: '0:open' }
		]);
	});

	test('escapes raw nodes when dangerous html is disabled', () => {
		const rendered = stringify({
			type: 'root',
			children: [{ type: 'raw', value: '<&' }]
		});
		expect(rendered).toStrictEqual([{ type: 'html', html: '&#x3C;&#x26;', key: '0:html' }]);
	});

	test('serializes void elements with unexpected children', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'img',
					properties: { alt: 'x' },
					children: [{ type: 'text', value: 'oops' }]
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<img alt="x">oops</img>', key: '0:open' }
		]);
	});

	test('uses template content as children', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'template',
					properties: {},
					children: [],
					content: {
						type: 'root',
						children: [{ type: 'text', value: 'hi' }]
					}
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<template>hi</template>', key: '0:open' }
		]);
	});
});

describe('HtmlSerializer parity', () => {
	const processor = unified().use(rehypeRender).freeze();
	const stringify = (node: Root): ResultRoot => processor.stringify(node);

	test('serializes doctype with defaults', () => {
		const rendered = stringify({
			type: 'root',
			children: [{ type: 'doctype' }]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<!doctype html>', key: '0:html' }
		]);
	});

	test('escapes comments per html rules', () => {
		const rendered = stringify({
			type: 'root',
			children: [{ type: 'comment', value: '-->' }]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<!----&#x3E;-->', key: '0:html' }
		]);
	});

	test('collapses boolean attributes', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'input',
					properties: { disabled: true, checked: '' },
					children: []
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<input disabled>', key: '0:open' }
		]);
	});

	test('serializes space and comma separated attribute values', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'div',
					properties: { className: ['a', 'b'], accept: ['a', 'b'] },
					children: []
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<div class="a b" accept="a, b"></div>', key: '0:open' }
		]);
	});

	test('handles numeric and zero attributes', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'input',
					properties: { tabIndex: 0, value: 0 },
					children: []
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<input tabindex="0" value="0">', key: '0:open' }
		]);
	});

	test('escapes attribute names and values', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'div',
					properties: { title: 'a<&"b' },
					children: []
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<div title="a<&#x26;&#x22;b"></div>', key: '0:open' }
		]);
	});
});

describe('key generation', () => {
	const processor = unified().use(rehypeRender).freeze();
	const stringify = (node: Root): ResultRoot => processor.stringify(node);

	test('assigns path keys for nested elements and custom nodes', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'div',
					properties: {},
					children: [
						{ type: 'text', value: 'a' },
						{ type: 'custom-element', name: 'x', properties: {}, children: [] },
						{
							type: 'element',
							tagName: 'span',
							properties: {},
							children: [{ type: 'text', value: 'b' }]
						}
					]
				}
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: '<div>a', key: '0:open' },
			{ type: 'custom-element', name: 'x', properties: {}, children: [], key: '0.1:custom' },
			{ type: 'html', html: '<span>b</span></div>', key: '0.2:open' }
		]);
	});

	test('keeps distinct keys for sibling nodes', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{ type: 'text', value: 'hi' },
				{ type: 'custom-element', name: 'mid', properties: {}, children: [] },
				{ type: 'text', value: 'bye' }
			]
		});
		expect(rendered).toStrictEqual([
			{ type: 'html', html: 'hi', key: '0:html' },
			{ type: 'custom-element', name: 'mid', properties: {}, children: [], key: '1:custom' },
			{ type: 'html', html: 'bye', key: '2:html' }
		]);
	});

	test('assigns keys within custom element children', () => {
		const rendered = stringify({
			type: 'root',
			children: [
				{
					type: 'custom-element',
					name: 'outer',
					properties: {},
					children: [
						{ type: 'text', value: 'a' },
						{ type: 'custom-element', name: 'inner', properties: {}, children: [] },
						{ type: 'text', value: 'b' }
					]
				}
			]
		});
		expect(rendered).toStrictEqual([
			{
				type: 'custom-element',
				name: 'outer',
				properties: {},
				children: [
					{ type: 'html', html: 'a', key: '0.0:html' },
					{ type: 'custom-element', name: 'inner', properties: {}, children: [], key: '0.1:custom' },
					{ type: 'html', html: 'b', key: '0.2:html' }
				],
				key: '0:custom'
			}
		]);
	});
});
