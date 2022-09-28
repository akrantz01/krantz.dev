import classNames from 'classnames';
import Link from 'next/link';
import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from 'react';

import { isExternal } from './url';

type Props<T> = DetailedHTMLProps<HTMLAttributes<T>, T>;

export const MDX_COMPONENTS = {
  h1: (props: Props<HTMLHeadingElement>) => (
    <h1 className={classNames('dark:text-white', props.className)}>{props.children}</h1>
  ),
  h2: (props: Props<HTMLHeadingElement>) => (
    <h2 className={classNames('dark:text-white', props.className)}>{props.children}</h2>
  ),
  h3: (props: Props<HTMLHeadingElement>) => (
    <h3 className={classNames('dark:text-white', props.className)}>{props.children}</h3>
  ),
  h4: (props: Props<HTMLHeadingElement>) => (
    <h4 className={classNames('dark:text-white', props.className)}>{props.children}</h4>
  ),
  h5: (props: Props<HTMLHeadingElement>) => (
    <h5 className={classNames('dark:text-white', props.className)}>{props.children}</h5>
  ),
  h6: (props: Props<HTMLHeadingElement>) => (
    <h6 className={classNames('dark:text-white', props.className)}>{props.children}</h6>
  ),
  a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const style = classNames(
      'dark:text-white no-underline rounded transition duration-300 ease-in-out focus:(outline-none ring-4 ring-primary-500 ring-offset-2 opacity-100 no-underline) hover:(opacity-100 no-underline)',
      props.className,
    );

    if (href && !isExternal(href)) {
      return (
        <Link href={href} passHref>
          <a className={style} {...props}>
            {props.children}
          </a>
        </Link>
      );
    } else {
      return (
        <a className={style} target="_blank" rel="noreferrer" {...props}>
          {props.children}
        </a>
      );
    }
  },
  p: (props: Props<HTMLParagraphElement>) => (
    <p className={classNames('text-gray-400', props.className)} {...props}>
      {props.children}
    </p>
  ),
  ul: (props: Props<HTMLUListElement>) => (
    <ul className={classNames('text-gray-400', props.className)} {...props}>
      {props.children}
    </ul>
  ),
  li: (props: Props<HTMLLIElement>) => (
    <li className={classNames('text-gray-400 before:dark:text-gray-300', props.className)} {...props}>
      {props.children}
    </li>
  ),
  strong: (props: Props<HTMLElement>) => (
    <strong className={classNames('dark:text-white', props.className)} {...props}>
      {props.children}
    </strong>
  ),
  hr: (props: Props<HTMLHRElement>) => (
    <hr className={classNames('my-4 dark:border-gray-400', props.className)} {...props} />
  ),
  code: (props: Props<HTMLElement>) => (
    <code
      className={classNames(
        'bg-gray-1000 dark:bg-gray-700 p-1 text-gray-400 border-2 border-gray-100 dark:border-gray-500 rounded-lg rounded-t-none before:hidden after:hidden',
        props.className,
      )}
      {...props}
    >
      {props.children}
    </code>
  ),
  pre: (props: Props<HTMLPreElement>) => (
    <pre
      className={classNames(
        'bg-gray-200 dark:bg-gray-800 m-0 dark:text-white border-2 border-gray-100 dark:border-gray-500 rounded-lg rounded-t-none',
        props.className,
      )}
      {...props}
    >
      {props.children}
    </pre>
  ),
  th: (props: Props<HTMLTableHeaderCellElement>) => (
    <th className={classNames('dark:text-white', props.className)} {...props}>
      {props.children}
    </th>
  ),
  td: (props: Props<HTMLTableDataCellElement>) => (
    <td className={classNames('dark:text-gray-400', props.className)} {...props}>
      {props.children}
    </td>
  ),
  ol: (props: Props<HTMLOListElement>) => (
    <ol className={classNames('dark:text-gray-300', props.className)} {...props}>
      {props.children}
    </ol>
  ),
};
