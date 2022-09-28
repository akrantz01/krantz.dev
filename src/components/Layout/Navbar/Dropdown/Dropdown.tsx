import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, ReactNode } from 'react';

import type { NavigationItem } from '@/types';

import Item from './Item';

interface Props {
  children: ReactNode;
  items: NavigationItem[];
  position?: 'left' | 'right';
}

export const Dropdown = ({ children, items, position = 'left' }: Props): JSX.Element => (
  <Menu as="div" className="relative inline-block text-left">
    {({ open }) => (
      <>
        <Menu.Button as={Fragment}>{children}</Menu.Button>

        <Transition
          appear={true}
          enter="transition ease-in-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition ease-in-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
          show={open}
        >
          <Menu.Items
            className={classNames(
              'absolute w-[calc(100vw-1rem)] sm:w-56 mt-2 bg-gray-50 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 backdrop-filter backdrop-blur-sm border border-gray-100 dark:border-gray-500 rounded-md shadow-lg divide-y divide-gray-100 dark:divide-gray-500 focus:outline-none',
              {
                'origin-top-left left-0': position === 'left',
                'origin-top-right right-0': position === 'right',
              },
            )}
          >
            <div className="py-2">
              {items.map((item, i) => (
                <Menu.Item key={i}>{({ active }) => <Item active={active} item={item} />}</Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </>
    )}
  </Menu>
);
