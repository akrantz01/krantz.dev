import { test, expect } from 'vitest';
import { render } from './index';

test.todo('handles text directives', async () => {
	const result = await render('hello :fancy[there]!');
	console.log(result);
});
