export function dedent(text: string): string {
	const lines = text.split('\n');
	if (lines.length <= 1) return text;

	const leading = lines[1].length - lines[1].trimStart().length;
	return lines.map((l, i) => (i === 0 ? l : l.substring(leading))).join('\n');
}
