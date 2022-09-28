import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import { ForwardedRef, MouseEvent, ReactNode, forwardRef } from 'react';

import { isExternal } from '@/lib';

interface Props {
  className?: string;
  icon?: IconDefinition;
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

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  ({ className, children, icon, onClick, href, outline = false, small = false }, ref) => {
    const classes = classNames(
      outline ? outlinedStyle : filledStyle,
      small ? 'px-4 py-1 text-sm' : 'px-8 py-4',
      className,
    );
    const iconClasses = classNames('mr-2', small ? 'w-4 h-4' : 'w-6 h-6');

    if (href) {
      if (isExternal(href)) {
        return (
          <a
            ref={ref as ForwardedRef<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={classes}
          >
            {icon && <FontAwesomeIcon className={iconClasses} icon={icon} />}
            {children}
          </a>
        );
      } else {
        return (
          <Link ref={ref as ForwardedRef<HTMLAnchorElement>} href={href} passHref>
            <a href={href} className={classes}>
              {icon && <FontAwesomeIcon className={iconClasses} icon={icon} />}
              {children}
            </a>
          </Link>
        );
      }
    }

    if (onClick) {
      return (
        <button ref={ref as ForwardedRef<HTMLButtonElement>} className={classes} onClick={onClick} type="button">
          {icon && <FontAwesomeIcon className={iconClasses} icon={icon} />}
          {children}
        </button>
      );
    }

    throw new Error('one of onClick or href is required');
  },
);
Button.displayName = 'Button';

export default Button;
