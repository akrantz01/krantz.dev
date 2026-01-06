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
			{ type: 'html', html: '<p>hello ' },
			{ type: 'custom-element', name: 'fancy', properties: {}, children: [] },
			{ type: 'html', html: 'world</p>' }
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
				html: '<input class="a b" disabled title="a&#x22;b &#x26; c">'
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
		expect(rendered).toStrictEqual([{ type: 'html', html: '<p>&#x3C;&#x26;</p>' }]);
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
			{ type: 'html', html: '<script><&</script><style><&</style>' }
		]);
	});

	test('escapes raw nodes when dangerous html is disabled', () => {
		const rendered = stringify({
			type: 'root',
			children: [{ type: 'raw', value: '<&' }]
		});
		expect(rendered).toStrictEqual([{ type: 'html', html: '&#x3C;&#x26;' }]);
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
			{ type: 'html', html: '<img alt="x">oops</img>' }
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
		expect(rendered).toStrictEqual([{ type: 'html', html: '<template>hi</template>' }]);
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
		expect(rendered).toStrictEqual([{ type: 'html', html: '<!doctype html>' }]);
	});

	test('escapes comments per html rules', () => {
		const rendered = stringify({
			type: 'root',
			children: [{ type: 'comment', value: '-->' }]
		});
		expect(rendered).toStrictEqual([{ type: 'html', html: '<!----&#x3E;-->' }]);
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
		expect(rendered).toStrictEqual([{ type: 'html', html: '<input disabled>' }]);
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
			{ type: 'html', html: '<div class="a b" accept="a, b"></div>' }
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
			{ type: 'html', html: '<input tabindex="0" value="0">' }
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
			{ type: 'html', html: '<div title="a<&#x26;&#x22;b"></div>' }
		]);
	});
});
