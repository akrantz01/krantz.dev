import { prerender } from '$app/server';
import { highlight, registerLanguage, setHostWasmModule } from '@krantz-dev/highlight';
import host from '@krantz-dev/highlight/host.wasm?module';
import * as z from 'zod';

import * as bashGrammar from '@arborium/bash/grammar.js';
import bashWasm from '@arborium/bash/grammar_bg.wasm?module';
import * as diffGrammar from '@arborium/diff/grammar.js';
import diffWasm from '@arborium/diff/grammar_bg.wasm?module';
import * as fishGrammar from '@arborium/fish/grammar.js';
import fishWasm from '@arborium/fish/grammar_bg.wasm?module';
import * as jsonGrammar from '@arborium/json/grammar.js';
import jsonWasm from '@arborium/json/grammar_bg.wasm?module';
import * as nixGrammar from '@arborium/nix/grammar.js';
import nixWasm from '@arborium/nix/grammar_bg.wasm?module';
import * as pythonGrammar from '@arborium/python/grammar.js';
import pythonWasm from '@arborium/python/grammar_bg.wasm?module';
import * as rustGrammar from '@arborium/rust/grammar.js';
import rustWasm from '@arborium/rust/grammar_bg.wasm?module';
import * as tomlGrammar from '@arborium/toml/grammar.js';
import tomlWasm from '@arborium/toml/grammar_bg.wasm?module';
import * as yamlGrammar from '@arborium/yaml/grammar.js';
import yamlWasm from '@arborium/yaml/grammar_bg.wasm?module';

import { once } from './once';

once(Symbol.for('highlighter'), () => {
	setHostWasmModule(host);
	registerLanguage('bash', bashGrammar, bashWasm);
	registerLanguage('diff', diffGrammar, diffWasm);
	registerLanguage('fish', fishGrammar, fishWasm);
	registerLanguage('json', jsonGrammar, jsonWasm);
	registerLanguage('nix', nixGrammar, nixWasm);
	registerLanguage('python', pythonGrammar, pythonWasm);
	registerLanguage('rust', rustGrammar, rustWasm);
	registerLanguage('toml', tomlGrammar, tomlWasm);
	registerLanguage('yaml', yamlGrammar, yamlWasm);
});

const Schema = z.object({
	language: z.string(),
	text: z.string()
});

export const highlighter = prerender(
	Schema,
	async ({ language, text }) => highlight(language, text),
	{ dynamic: true }
);
