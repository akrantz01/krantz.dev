import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

import type { FrontMatter } from '@/types';

import Pill from './Pill';

const H2 = (props: HTMLAttributes<HTMLHeadingElement>): JSX.Element => <h2 {...props}>{props.children}</h2>;
const H4 = (props: HTMLAttributes<HTMLHeadingElement>): JSX.Element => <h4 {...props}>{props.children}</h4>;

interface Props extends FrontMatter {
  latest?: boolean;
}

const BlogPostCard = ({ latest, ...frontmatter }: Props): JSX.Element => {
  const label = `Read blog post: ${frontmatter.title}`;
  const href = `/blog/${frontmatter.slug}`;

  const Heading = latest ? H2 : H4;

  return (
    <Link aria-label={label} href={href} passHref>
      <a
        aria-label={label}
        className={classNames(
          'flex flex-col bg-white bg-opacity-75 dark:(bg-gray-900 bg-opacity-75 border-gray-500) backdrop-filter backdrop-blur-sm rounded-2xl hover:shadow-xl cursor-pointer border-2 border-gray-100 transform motion-safe:hover:-translate-y-1 default-transition default-focus',
          latest ? 'lg:flex-row mt-12' : 'overflow-hidden',
        )}
      >
        <div className="flex-1 flex flex-col justify-between p-6 bg-transparent rounded-2xl bg-transparent">
          <div className="flex flex-col flex-1 justify-around rounded-lg text-gray-400 dark:text-gray-300 default-focus">
            <Heading
              className={classNames(
                'font-bold text-gray-900 dark:text-gray-100',
                latest ? 'py-4 text-3xl lg:text-5xl' : 'text-xl',
              )}
            >
              {frontmatter.title}
            </Heading>
            <p className={classNames(latest ? 'mt-6 lg:mt-0 text-lg line-clamp-3' : 'mt-3 text-base line-clamp-2')}>
              {frontmatter.description}
            </p>
            <div className={classNames('flex items-start space-x-1 mt-4', { 'text-sm': !latest })}>
              <Pill icon={faCalendarDays}>{frontmatter.date}</Pill>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default BlogPostCard;
