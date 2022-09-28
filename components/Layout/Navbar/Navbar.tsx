import { Disclosure } from '@headlessui/react';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';

import Button from '@/components/Button';
import { NavigationItem, Theme } from '@/types';

import Dropdown from './Dropdown';

const menuItems: NavigationItem[] = [
  {
    type: 'link',
    icon: 'feather:home',
    text: 'Home',
    href: '/',
  },
  {
    type: 'link',
    icon: 'feather:edit-3',
    text: 'Blog',
    href: '/blog',
  },
  {
    type: 'link',
    icon: 'feather:code',
    text: 'Projects',
    href: '/projects',
  },
  {
    type: 'link',
    icon: 'feather:clock',
    text: 'Timeline',
    href: '/timeline',
  },
  { type: 'divider' },
  {
    type: 'link',
    icon: 'feather:github',
    text: 'GitHub',
    href: 'https://github.com/akrantz01',
  },
  {
    type: 'link',
    icon: 'feather:linkedin',
    text: 'LinkedIn',
    href: 'https://www.linkedin.com/in/akrantz01',
  },
  {
    type: 'link',
    icon: 'feather:file-text',
    text: 'Resume',
    href: 'https://krantz.to/resume',
  },
];

export const Navbar = (): JSX.Element => {
  const { theme, setTheme } = useTheme();
  const settingsItems: NavigationItem[] = [
    {
      type: 'action',
      icon: 'feather:monitor',
      endIcon: theme === Theme.SYSTEM ? 'feather:check-circle' : undefined,
      text: 'System Theme',
      onClick: () => setTheme(Theme.SYSTEM),
    },
    {
      type: 'action',
      icon: 'feather:sun',
      endIcon: theme === Theme.LIGHT ? 'feather:check-circle' : undefined,
      text: 'Light Theme',
      onClick: () => setTheme(Theme.LIGHT),
    },
    {
      type: 'action',
      icon: 'feather:moon',
      endIcon: theme === Theme.DARK ? 'feather:check-circle' : undefined,
      text: 'Dark Theme',
      onClick: () => setTheme(Theme.DARK),
    },
  ];

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 w-full z-10">
      <div className="mx-auto px-2">
        <div className="relative flex items-center justify-between h-16">
          <Dropdown items={menuItems} position="left">
            <Button aria-label="Menu" small>
              <Icon className="w-4 h-4 my-1" icon="feather:menu" />
            </Button>
          </Dropdown>
          <Dropdown items={settingsItems} position="right">
            <Button aria-label="Settings" small>
              <Icon className="w-4 h-4 my-1" icon="feather:settings" />
            </Button>
          </Dropdown>
        </div>
      </div>
    </Disclosure>
  );
};
