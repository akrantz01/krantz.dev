import { Parent } from 'unist';
import { visit } from 'unist-util-visit';

const style =
  'light:bg-white px-4 py-2 text-gray-300 dark:text-white font-medium border-2 border-b-0 border-gray-100 dark:border-gray-500 rounded-lg';

interface Node extends Parent {
  lang?: string;
}

const remarkCodeTitles = () => (tree: Node) =>
  visit(tree, 'code', (node: Node, index: number, parent: Parent) => {
    if (!node.lang || !node.lang.includes(':')) return;

    const colon = node.lang.search(':');
    const language = node.lang.slice(0, colon);
    const title = node.lang.slice(colon + 1);

    const titleNode = {
      type: 'mdxJsxFlowElement',
      name: 'div',
      attributes: [{ type: 'mdxJsxAttribute', name: 'className', value: style }],
      children: [{ type: 'text', value: title }],
      data: { _xdmExplicitJsx: true },
    };

    parent.children.splice(index, 0, titleNode);
    node.lang = language;
  });

export default remarkCodeTitles;
