import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, test, expect, beforeEach, beforeAll, vi } from 'vitest';
import * as typescriptGrammar from '@arborium/typescript/grammar.js';
import * as rustGrammar from '@arborium/rust/grammar.js';
import * as svelteGrammar from '@arborium/svelte/grammar.js';
import * as cssGrammar from '@arborium/css/grammar.js';

import { resetHandles, setHostWasmModule } from './host';
import { hasLanguage, resetLanguages } from './languages';
import { registerLanguage, highlight } from './index';

const wasmModule = async (id: string): Promise<WebAssembly.Module> => {
	const url = import.meta.resolve(`@arborium/${id}/grammar_bg.wasm`);
	const wasm = await readFile(fileURLToPath(url));
	return WebAssembly.compile(wasm);
};

const arborium = import.meta.resolve('@arborium/arborium');
vi.mock('/src/arborium_host.js', () => {
	const host = new URL('arborium_host.js', arborium);
	return vi.importActual(fileURLToPath(host));
});

beforeAll(async () => {
	const url = new URL('arborium_host_bg.wasm', arborium);
	const wasm = await readFile(fileURLToPath(url));
	setHostWasmModule(await WebAssembly.compile(wasm));
});

beforeEach(() => {
	resetHandles();
	resetLanguages();
});

beforeEach(() => {
	vi.stubGlobal('console', {
		debug: vi.fn(),
		log: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	});

	return () => {
		vi.unstubAllGlobals();
	};
});

test('language registered twice', async () => {
	const module = await wasmModule('typescript');
	registerLanguage('typescript', typescriptGrammar, module);

	expect(() => registerLanguage('typescript', typescriptGrammar, module)).toThrow(
		'language typescript is already registered'
	);
});

test.each(['rust', 'typescript', 'python'])('unregistered language/%s', async (language) => {
	const highlighted = await highlight(language, 'let a = 3;');
	expect(highlighted).toStrictEqual('let a = 3;');
});

describe('alias handling', () => {
	test('can load through alias', async () => {
		registerLanguage('typescript', typescriptGrammar, await wasmModule('typescript'), {
			aliases: ['ts']
		});

		const highlighted = await highlight(
			'ts',
			'interface Response<Data> { status: number; data: Data; }'
		);
		expect(highlighted).toStrictEqual(
			'<a-k>interface</a-k> <a-t>Response</a-t><a-o>&lt;</a-o><a-t>Data</a-t><a-o>&gt;</a-o> <a-p>{</a-p> <a-pr>status</a-pr>: <a-t>number</a-t><a-p>;</a-p> <a-pr>data</a-pr>: <a-t>Data</a-t><a-p>;</a-p> <a-p>}</a-p>'
		);
	});

	test('mismatch aliases are rejected', async () => {
		registerLanguage('typescript', typescriptGrammar, await wasmModule('typescript'), {
			aliases: ['banana']
		});

		const cssWasm = await wasmModule('css');
		expect(() => registerLanguage('css', cssGrammar, cssWasm, { aliases: ['banana'] })).toThrow(
			'language alias banana is already defined for typescript'
		);
	});
});

test('mismatch language ids print warning', async () => {
	registerLanguage('scss', cssGrammar, await wasmModule('css'));

	const highlighted = await highlight('scss', 'p { background-color: blue; }');
	expect(highlighted).toStrictEqual(
		'<a-tg>p</a-tg> <a-p>{</a-p> <a-pr>background-color</a-pr><a-p>:</a-p> blue<a-p>;</a-p> <a-p>}</a-p>'
	);

	expect(console.warn).toHaveBeenCalledExactlyOnceWith(
		"[highlight] language id mismatch: expected 'scss', got 'css'"
	);
});

describe('single language highlight', () => {
	test('with one language registered', async () => {
		registerLanguage('typescript', typescriptGrammar, await wasmModule('typescript'));
		expect(hasLanguage('typescript')).toBe(true);

		const highlighted = await highlight('typescript', `const variable = true;`);
		expect(vi.mocked(console.error).mock.calls).toEqual([]);
		expect(highlighted).toEqual(
			'<a-k>const</a-k> <a-v>variable</a-v> <a-o>=</a-o> <a-co>true</a-co><a-p>;</a-p>'
		);
	});

	test('with multiple languages registered', async () => {
		registerLanguage('typescript', typescriptGrammar, await wasmModule('typescript'));
		registerLanguage('rust', rustGrammar, await wasmModule('rust'));

		const highlighted = await highlight('rust', `println!("hello world");`);
		expect(highlighted).toEqual(
			'<a-m>println!</a-m><a-p>(</a-p><a-s>&quot;hello world&quot;</a-s><a-p>);</a-p>'
		);

		expect(console.debug).toHaveBeenCalledWith("[highlight] language 'rust' loaded successfully");
		expect(console.debug).not.toHaveBeenCalledWith(
			"[highlight] language 'typescript' loaded successfully"
		);
	});

	test('repeated highlights', async () => {
		registerLanguage('rust', rustGrammar, await wasmModule('rust'));

		for (let i = 0; i < 3; i++) {
			const highlighted = await highlight('rust', '// this is a comment');
			expect(highlighted).toEqual('<a-c>// this is a comment</a-c>');
		}

		expect(vi.mocked(console.debug).mock.calls).toStrictEqual([
			["[highlight] loading language 'rust'"],
			["[highlight] language 'rust' loaded successfully"],
			["[highlight] language 'rust' already loaded"],
			["[highlight] language 'rust' already loaded"]
		]);
	});
});

describe('highlight with injections', () => {
	const injectionSource = `
<script lang="ts">
    let count = $state(0);
</script>

<p>Count: {count}</p>

<style>
  p {
    color: red;
  }
</style>
`.trim();

	test('injection languages not loaded', async () => {
		registerLanguage('svelte', svelteGrammar, await wasmModule('svelte'));

		const highlighted = await highlight('svelte', injectionSource);
		expect(highlighted).toStrictEqual(
			[
				'<a-p>&lt;</a-p><a-tg>script</a-tg> <a-at>lang</a-at>=&quot;<a-s>ts</a-s>&quot;<a-p>&gt;</a-p>',
				'    let count = $state(0);',
				'<a-p>&lt;/</a-p><a-tg>script</a-tg><a-p>&gt;</a-p>',
				'',
				'<a-p>&lt;</a-p><a-tg>p</a-tg><a-p>&gt;</a-p>Count: <a-p>{</a-p>count<a-p>}&lt;/</a-p><a-tg>p</a-tg><a-p>&gt;</a-p>',
				'',
				'<a-p>&lt;</a-p><a-tg>style</a-tg><a-p>&gt;</a-p>',
				'  p {',
				'    color: red;',
				'  }',
				'<a-p>&lt;/</a-p><a-tg>style</a-tg><a-p>&gt;</a-p>'
			].join('\n')
		);

		expect(console.debug).toHaveBeenCalledWith("[highlight] language 'svelte' loaded successfully");
		expect(console.debug).not.toHaveBeenCalledWith(
			"[highlight] language 'typescript' loaded successfully"
		);
		expect(console.debug).not.toHaveBeenCalledWith(
			"[highlight] language 'css' loaded successfully"
		);
	});

	test('all injection languages loaded', async () => {
		registerLanguage('svelte', svelteGrammar, await wasmModule('svelte'));
		registerLanguage('typescript', typescriptGrammar, await wasmModule('typescript'));
		registerLanguage('css', cssGrammar, await wasmModule('css'));

		const highlighted = await highlight('svelte', injectionSource);
		expect(highlighted).toStrictEqual(
			[
				'<a-p>&lt;</a-p><a-tg>script</a-tg> <a-at>lang</a-at>=&quot;<a-s>ts</a-s>&quot;<a-p>&gt;</a-p>',
				'    <a-k>let</a-k> <a-v>count</a-v> <a-o>=</a-o> <a-v>$state</a-v><a-p>(</a-p><a-n>0</a-n><a-p>);</a-p>',
				'<a-p>&lt;/</a-p><a-tg>script</a-tg><a-p>&gt;</a-p>',
				'',
				'<a-p>&lt;</a-p><a-tg>p</a-tg><a-p>&gt;</a-p>Count: <a-p>{</a-p>count<a-p>}&lt;/</a-p><a-tg>p</a-tg><a-p>&gt;</a-p>',
				'',
				'<a-p>&lt;</a-p><a-tg>style</a-tg><a-p>&gt;</a-p>',
				'  <a-tg>p</a-tg> <a-p>{</a-p>',
				'    <a-pr>color</a-pr><a-p>:</a-p> red<a-p>;</a-p>',
				'  <a-p>}</a-p>',
				'<a-p>&lt;/</a-p><a-tg>style</a-tg><a-p>&gt;</a-p>'
			].join('\n')
		);

		expect(console.debug).toHaveBeenCalledWith("[highlight] language 'svelte' loaded successfully");
		expect(console.debug).toHaveBeenCalledWith(
			"[highlight] language 'typescript' loaded successfully"
		);
		expect(console.debug).toHaveBeenCalledWith("[highlight] language 'css' loaded successfully");
	});
});
