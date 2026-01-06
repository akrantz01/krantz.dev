import { describe, test, expect } from 'vitest';
import { render } from './index';

describe('text directives', () => {
	test('unknown directives raise warning', async () => {
		const { messages, result } = await render('hello :fancy[there]!');
		expect(result).toStrictEqual([{ type: 'html', html: '<p>hello !</p>', key: '0:open' }]);
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
