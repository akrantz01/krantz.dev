import { describe, test, expect } from 'vitest';
import { render, renderToString } from './index';
import type { Position, Point } from 'unist';

const point = (line: number, column: number, offset: number | undefined = undefined): Point => ({
	line,
	column,
	offset
});
const position = (start: Point, end: Point): Position => ({ start, end });

describe('text directives', () => {
	test('unknown directives raise warning', async () => {
		const { ast, messages } = await render('hello :fancy[there]!');
		expect(ast).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'p',
					properties: {},
					children: [
						{
							type: 'text',
							value: 'hello ',
							position: position(point(1, 1, 0), point(1, 7, 6))
						},
						{
							type: 'text',
							value: '!',
							position: position(point(1, 20, 19), point(1, 21, 20))
						}
					],
					position: position(point(1, 1, 0), point(1, 21, 20))
				}
			],
			position: position(point(1, 1, 0), point(1, 21, 20))
		});
		expect(messages).toStrictEqual([
			{
				type: 'warning',
				text: "unsupported text directive 'fancy'",
				start: { line: 1, column: 7, offset: 6 },
				end: { line: 1, column: 20, offset: 19 }
			}
		]);
	});
});

describe('renderToString', () => {
	test('simple markup', async () => {
		const result = await renderToString('# heading\nhello **world**!');
		expect(result).toEqual('<h1>heading</h1>\n<p>hello <strong>world</strong>!</p>');
	});

	test('drops text custom elements', async () => {
		const result = await renderToString('hello :fancy[there]!');
		expect(result).toEqual('<p>hello !</p>');
	});

	test('drops leaf custom elements', async () => {
		const result = await renderToString('first\n::hr{.red}\nsecond');
		expect(result).toEqual('<p>first</p>\n<p>second</p>');
	});

	test('drops container custom elements', async () => {
		const result = await renderToString(
			'# heading\nhello there\n:::main\nsome main content\n:::\ngoodbye!'
		);
		expect(result).toEqual('<h1>heading</h1>\n<p>hello there</p>\n<p>goodbye!</p>');
	});
});
