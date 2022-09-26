import { Icon } from '@iconify/react';
import classNames from 'classnames';
import Link from 'next/link';
import { MouseEvent, ReactNode } from 'react';

interface Props {
  className?: string;
  icon?: string;
  children?: ReactNode;
  onClick?: (e: MouseEvent) => void;
  href?: string;
  outline?: boolean;
  small?: boolean;
}

const filledStyle =
  'flex justify-center items-center h-12 bg-gray-50 hover:(bg-gray-100 bg-opacity-50 text-primary-400) dark:(bg-gray-900 hover:bg-gray-800) font-bold text-primary-300 rounded-lg default-transition default-focus';
const outlinedStyle =
  'inline-flex items-center justify-center w-full sm:w-auto bg-gray-50 bg-opacity-75 hover:(bg-gray-100 bg-opacity-75 text-gray-500) dark:(bg-gray-900 bg-opacity-75 hover:bg-gray-800 hover:bg-opacity-75 border-gray-700 text-primary-500 hover:text-primary-400) backdrop-filter backdrop-blur-sm saturate-200 text-gray-400 font-medium border-2 border-gray-200 rounded-lg cursor-pointer default-transition default-focus';

const isExternal = /^http(s)?:\/\//;

const Button = ({ className, children, icon, onClick, href, outline = false, small = false }: Props): JSX.Element => {
  const classes = classNames(
    outline ? outlinedStyle : filledStyle,
    small ? 'px-4 py-1 text-sm' : 'px-8 py-4',
    className,
  );

  if (href) {
    if (isExternal.test(href)) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
          {icon && <Icon className="mr-2" icon={icon} />}
          {children}
        </a>
      );
    } else {
      return (
        <Link href={href} passHref>
          <a href={href} className={classes}>
            {icon && <Icon className="mr-2" icon={icon} />}
            {children}
          </a>
        </Link>
      );
    }
  }

  if (onClick) {
    return (
      <button className={classes} onClick={onClick} type="button">
        {icon && <Icon className="mr-2" icon={icon} />}
        {children}
      </button>
    );
  }

  throw new Error('one of onClick or href is required');
};

export default Button;