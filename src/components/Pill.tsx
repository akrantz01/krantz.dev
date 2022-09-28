import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
  small?: boolean;
  icon?: IconDefinition;
}

const Pill = ({ children, className, icon, small }: Props): JSX.Element => (
  <div
    className={classNames(
      'inline-flex bg-primary-300 bg-opacity-15 backdrop-filter backdrop-blur-sm filter saturate-200 text-primary-600 rounded-2xl default-transition default-focus',
      small ? 'px-2 py-1' : 'px-4 py-2',
      className,
    )}
  >
    {icon && (
      <FontAwesomeIcon className={classNames('mt-1 h-4 w-4', small ? 'mr-1.5' : 'mr-3', className)} icon={icon} />
    )}
    {children}
  </div>
);

export default Pill;
