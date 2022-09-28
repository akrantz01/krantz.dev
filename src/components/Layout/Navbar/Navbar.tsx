import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faBars,
  faCircleCheck,
  faClock,
  faCode,
  faDesktop,
  faFileLines,
  faHouse,
  faMoon,
  faPalette,
  faPenNib,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure } from '@headlessui/react';
import { useTheme } from 'next-themes';

import Button from '@/components/Button';
import { NavigationItem, Theme } from '@/types';

import Dropdown from './Dropdown';

const menuItems: NavigationItem[] = [
  {
    type: 'link',
    icon: faHouse,
    text: 'Home',
    href: '/',
  },
  {
    type: 'link',
    icon: faPenNib,
    text: 'Blog',
    href: '/blog',
  },
  {
    type: 'link',
    icon: faCode,
    text: 'Projects',
    href: '/projects',
  },
  {
    type: 'link',
    icon: faClock,
    text: 'Timeline',
    href: '/timeline',
  },
  { type: 'divider' },
  {
    type: 'link',
    icon: faGithub,
    text: 'GitHub',
    href: 'https://github.com/akrantz01',
  },
  {
    type: 'link',
    icon: faLinkedin,
    text: 'LinkedIn',
    href: 'https://www.linkedin.com/in/akrantz01',
  },
  {
    type: 'link',
    icon: faFileLines,
    text: 'Resume',
    href: 'https://krantz.to/resume',
  },
];

export const Navbar = (): JSX.Element => {
  const { theme, setTheme } = useTheme();
  const settingsItems: NavigationItem[] = [
    {
      type: 'action',
      icon: faDesktop,
      endIcon: theme === Theme.SYSTEM ? faCircleCheck : undefined,
      text: 'System Theme',
      onClick: () => setTheme(Theme.SYSTEM),
    },
    {
      type: 'action',
      icon: faSun,
      endIcon: theme === Theme.LIGHT ? faCircleCheck : undefined,
      text: 'Light Theme',
      onClick: () => setTheme(Theme.LIGHT),
    },
    {
      type: 'action',
      icon: faMoon,
      endIcon: theme === Theme.DARK ? faCircleCheck : undefined,
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
              <FontAwesomeIcon className="w-4 h-4 my-1" icon={faBars} />
            </Button>
          </Dropdown>
          <Dropdown items={settingsItems} position="right">
            <Button aria-label="Settings" small>
              <FontAwesomeIcon className="w-4 h-4 my-1" icon={faPalette} />
            </Button>
          </Dropdown>
        </div>
      </div>
    </Disclosure>
  );
};
