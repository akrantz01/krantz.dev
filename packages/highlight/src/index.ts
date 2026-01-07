import { spansToHtml } from '@arborium/arborium';
import loadHost from './host';
import { loadLanguage } from './languages';

export { setHostWasmModule } from './host';
export { registerLanguage, hasLanguage } from './languages';

export async function highlight(language: string, source: string): Promise<string> {
	const host = await loadHost();
	if (host !== null) {
		try {
			return host.highlight(language, source);
		} catch (e) {
			console.warn('Host highlight failed, falling back to JS:', e);
		}
	}

	const plugin = await loadLanguage(language);
	if (plugin === null) return escapeHtml(source);

	const result = plugin.parse(source);
	return spansToHtml(source, result.spans);
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
