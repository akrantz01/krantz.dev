import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import { ForwardedRef, forwardRef } from 'react';

import { isExternal } from '@/lib';
import { NavigationItem } from '@/types';

const styles = (active: boolean, group: boolean) =>
  classNames(
    'flex items-center px-4 py-3 text-sm font-medium tracking-wide default-transition',
    active
      ? 'bg-gray-100 bg-opacity-50 text-gray-900 dark:(bg-gray-700 bg-opacity-50 text-white)'
      : 'text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white',
    group ? 'group' : '',
  );

interface Props {
  active: boolean;
  item: NavigationItem;
}

const Item = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLHRElement, Props>(
  ({ active, item }, ref): JSX.Element => {
    switch (item.type) {
      case 'divider':
        return (
          <hr ref={ref as ForwardedRef<HTMLHRElement>} className="mt-2 pb-2 border-gray-100 dark:border-gray-500" />
        );

      case 'action':
        return (
          <button
            ref={ref as ForwardedRef<HTMLButtonElement>}
            type="button"
            className={styles(active, true)}
            onClick={item.onClick}
          >
            <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" aria-hidden="true" />
            {item.text}
            {item.endIcon && (
              <>
                <span className="flex-1" />
                <FontAwesomeIcon icon={item.endIcon} className="w-4 h-4 ml-3" aria-hidden="true" />
              </>
            )}
          </button>
        );

      case 'link':
        if (isExternal(item.href)) {
          return (
            <a
              ref={ref as ForwardedRef<HTMLAnchorElement>}
              href={item.href}
              className={styles(active, true)}
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" aria-hidden="true" />
              {item.text}
              <span className="flex-1" />
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-4 h-4 ml-3" aria-hidden="true" />
            </a>
          );
        } else {
          return (
            <Link ref={ref as ForwardedRef<HTMLAnchorElement>} href={item.href} passHref>
              <a className={styles(active, false)}>
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" aria-hidden="true" />
                {item.text}
              </a>
            </Link>
          );
        }
    }
  },
);
Item.displayName = 'Item';

export default Item;
