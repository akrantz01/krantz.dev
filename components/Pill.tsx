import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
  small?: boolean;
  icon?: string;
}

const Pill = ({ children, className, icon, small }: Props): JSX.Element => (
  <div
    className={classNames(
      'inline-flex bg-primary-500 bg-opacity-15 backdrop-filter backdrop-blur-sm filter saturate-200 text-primary-200 rounded-2xl default-transition default-focus',
      small ? 'px-2 py-1' : 'px-4 py-2',
      className,
    )}
  >
    {icon && <Icon className={classNames('mt-0.5', small ? 'mr-1.5' : 'mr-3', className)} icon={icon} />}
    {children}
  </div>
);

export default Pill;
