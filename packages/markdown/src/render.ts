import type { Plugin } from 'unified';
import type { Root, Node, RootContent, Element } from 'hast';
import { htmlVoidElements } from 'html-void-elements';
import { stringify as commas } from 'comma-separated-tokens';
import { stringify as spaces } from 'space-separated-tokens';
import { find, html } from 'property-information';
import { stringifyEntities } from 'stringify-entities';

export type ResultRoot = Result[];

export type Result = Html | CustomElement;

interface Html {
	type: 'html';
	html: string;
	key?: string;
}

interface CustomElement {
	type: 'custom-element';
	name: string;
	properties: Record<string, unknown>;
	children: Result[];
	key?: string;
}

const rehypeRender: Plugin<[], Root, ResultRoot> = function () {
	this.compiler = (tree: Node): ResultRoot => {
		const serializer = new HtmlSerializer();
		const root = tree as Root;
		return processNodes(root.children, serializer, root, '');
	};
};

export default rehypeRender;

const processNodes = (
	nodes: RootContent[],
	serializer: HtmlSerializer,
	parent?: Node,
	parentKey?: string
): ResultRoot => {
	const results: ResultRoot = [];

	for (let index = 0; index < nodes.length; index += 1) {
		const node = nodes[index];
		const nodeKeyBase = buildKeyBase(parentKey, index);
		appendResults(results, processNode(node, serializer, parent, nodeKeyBase));
	}

	return results;
};

const processNode = (
	node: RootContent,
	serializer: HtmlSerializer,
	parent: Node | undefined,
	nodeKeyBase: string
): Result[] => {
	switch (node.type) {
		case 'custom-element':
			return [
				{
					type: 'custom-element',
					name: node.name,
					properties: node.properties,
					children: processNodes(node.children as RootContent[], serializer, node, nodeKeyBase),
					key: `${nodeKeyBase}:custom`
				}
			];
		case 'element': {
			const children = serializer.getElementChildren(node);
			const attributes = serializer.serializeAttributes(node.properties);
			const tagName = node.tagName;
			const voidElement = serializer.settings.voids.includes(tagName.toLowerCase());
			const selfClosing = voidElement && children.length === 0;
			const open = serializer.serializeElementOpen(tagName, attributes, selfClosing);
			const close = selfClosing ? '' : `</${tagName}>`;
			const results: Result[] = [];

			appendHtml(results, open, `${nodeKeyBase}:open`);
			for (let index = 0; index < children.length; index += 1) {
				const child = children[index];
				const childKeyBase = buildKeyBase(nodeKeyBase, index);
				appendResults(results, processNode(child, serializer, node, childKeyBase));
			}
			appendHtml(results, close, `${nodeKeyBase}:close`);

			return results;
		}
		default:
			return [
				{
					type: 'html',
					html: serializer.serializeNode(node, parent),
					key: `${nodeKeyBase}:html`
				}
			];
	}
};

const appendResults = (results: Result[], next: Result[]): void => {
	for (const entry of next) {
		if (entry.type === 'html') {
			appendHtml(results, entry.html, entry.key);
		} else {
			results.push(entry);
		}
	}
};

const appendHtml = (results: Result[], html: string, key?: string): void => {
	if (!html) return;
	const last = results[results.length - 1];
	if (last?.type === 'html') {
		last.html += html;
	} else {
		results.push(key ? { type: 'html', html, key } : { type: 'html', html });
	}
};

const buildKeyBase = (parentKey: string | undefined, index: number): string =>
	parentKey ? `${parentKey}.${index}` : `${index}`;

class HtmlSerializer {
	settings = {
		allowDangerousHtml: false,
		allowParseErrors: false,
		allowDangerousCharacters: false,
		tightCommaSeparatedLists: false,
		closeSelfClosing: false,
		closeEmptyElements: false,
		tightSelfClosing: false,
		collapseEmptyAttributes: false,
		voids: htmlVoidElements,
		characterReferences: {}
	};

	serializeNode(node: RootContent | Root, parent?: Node): string {
		switch (node.type) {
			case 'root':
				return this.serializeChildren(node.children as RootContent[], node);
			case 'element':
				return this.serializeElement(node);
			case 'text':
				return this.serializeText(node.value, parent);
			case 'comment':
				return this.serializeComment(node.value);
			case 'doctype':
				return this.serializeDoctype();
			case 'raw':
				return this.settings.allowDangerousHtml
					? node.value
					: this.serializeText(node.value, parent);
			default:
				throw new Error(`Cannot compile unknown node '${node.type}'`);
		}
	}

	serializeChildren(children: RootContent[], parent?: Node): string {
		let result = '';
		for (const child of children) {
			result += this.serializeNode(child, parent);
		}
		return result;
	}

	serializeElement(node: Element): string {
		const attributes = this.serializeAttributes(node.properties);
		const children = this.getElementChildren(node);
		const content = this.serializeChildren(children, node);

		const tagName = node.tagName;
		const voidElement = this.settings.voids.includes(tagName.toLowerCase());
		const selfClosing = voidElement && children.length === 0 && !content;
		const open = this.serializeElementOpen(tagName, attributes, selfClosing);
		const close = selfClosing ? '' : `</${tagName}>`;

		return open + content + close;
	}

	serializeElementOpen(tagName: string, attributes: string, selfClosing: boolean): string {
		let open = '<' + tagName + (attributes ? ' ' + attributes : '');
		if (selfClosing && this.settings.closeSelfClosing) {
			if (!this.settings.tightSelfClosing) open += ' ';
			open += '/';
		}
		open += '>';
		return open;
	}

	serializeAttributes(properties: Record<string, unknown> | null | undefined): string {
		const values: string[] = [];
		if (properties) {
			for (const key in properties) {
				if (properties[key] !== null && properties[key] !== undefined) {
					const value = this.serializeAttribute(key, properties[key]);
					if (value) values.push(value);
				}
			}
		}

		return values.join(' ');
	}

	serializeAttribute(key: string, value: unknown): string {
		const info = find(html, key);

		if (info.overloadedBoolean && (value === info.attribute || value === '')) {
			value = true;
		} else if (
			(info.boolean || info.overloadedBoolean) &&
			(typeof value !== 'string' || value === info.attribute || value === '')
		) {
			value = Boolean(value);
		}

		if (
			value === null ||
			value === undefined ||
			value === false ||
			(typeof value === 'number' && Number.isNaN(value))
		) {
			return '';
		}

		const name = stringifyEntities(info.attribute, { subset: attributeNameSubset });

		if (value === true) return name;

		const stringValue = Array.isArray(value)
			? (info.commaSeparated ? commas : spaces)(value, {
					padLeft: !this.settings.tightCommaSeparatedLists
				})
			: String(value);

		if (this.settings.collapseEmptyAttributes && !stringValue) return name;

		const encoded = stringifyEntities(stringValue, { subset: attributeDoubleSubset });

		return `${name}="${encoded}"`;
	}

	serializeText(value: string, parent: Node | undefined): string {
		if (
			parent &&
			parent.type === 'element' &&
			((parent as Element).tagName === 'script' || (parent as Element).tagName === 'style')
		) {
			return value;
		}

		return stringifyEntities(value, {
			subset: ['<', '&']
		});
	}

	serializeComment(value: string): string {
		return (
			'<!--' +
			value.replace(htmlCommentRegex, (match) => stringifyEntities(match, { subset: ['<', '>'] })) +
			'-->'
		);
	}

	serializeDoctype(): string {
		return '<!doctype html>';
	}

	getElementChildren(node: Element): RootContent[] {
		if (node.tagName === 'template') {
			const content = (node as Element & { content?: Root }).content;
			if (content?.type === 'root') return content.children as RootContent[];
		}
		return node.children as RootContent[];
	}
}

// See: <https://html.spec.whatwg.org/#attribute-name-state>.
const attributeNameSubset = '\0\t\n\f\r "&\'/<=>`'.split('');
// See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
const attributeDoubleSubset = '\0"&\'`'.split('');

const htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
