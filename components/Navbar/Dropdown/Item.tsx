import { Icon } from '@iconify/react';
import classNames from 'classnames';
import Link from 'next/link';

import { NavigationItem } from '@/types';

const isExternal = /^http(s)?:\/\//;

const styles = (active: boolean, group: boolean) =>
  classNames(
    'flex items-center px-4 py-3 text-sm font-medium tracking-wide default-transition',
    active
      ? 'bg-gray-100 bg-opacity-50 text-gray-900 dark:(bg-gray-700 bg-opacity-50 text-white)'
      : 'text-gray-300 hover:text-gray-700 dark:hover:text-white',
    group ? 'group' : '',
  );

interface Props {
  active: boolean;
  item: NavigationItem;
}

const Item = ({ active, item }: Props): JSX.Element => {
  switch (item.type) {
    case 'divider':
      return <hr className="mt-2 pb-2 border-gray-100 dark:border-gray-500" />;

    case 'action':
      return (
        <button type="button" className={styles(active, true)} onClick={item.onClick}>
          <Icon icon={item.icon} className="w-5 h-5 mr-3" aria-hidden="true" />
          {item.text}
          {item.endIcon && (
            <>
              <span className="flex-1" />
              <Icon icon={item.endIcon} className="w-4 h-4 ml-3" aria-hidden="true" />
            </>
          )}
        </button>
      );

    case 'link':
      if (isExternal.test(item.href)) {
        return (
          <a href={item.href} className={styles(active, true)} rel="noreferrer" target="_blank">
            <Icon icon={item.icon} className="w-5 h-5 mr-3" aria-hidden="true" />
            {item.text}
            <span className="flex-1" />
            <Icon icon="feather:external-link" className="w-4 h-4 ml-3" aria-hidden="true" />
          </a>
        );
      } else {
        return (
          <Link href={item.href} passHref>
            <a className={styles(active, false)}>
              <Icon icon={item.icon} className="w-5 h-5 mr-3" aria-hidden="true" />
              {item.text}
            </a>
          </Link>
        );
      }
  }
};

export default Item;
