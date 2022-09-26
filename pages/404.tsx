import { Icon } from '@iconify/react';

import Button from '@/components/Button';
import DefaultLayout from '@/layout/Default';

const NotFound = (): JSX.Element => (
  <DefaultLayout>
    <div className="relative h-screen pt-24 sm:pt-16 pb-20 px-4 sm:px-6 lg:pb-28 lg:px-8">
      <div className="flex flex-grow min-h-full pt-16 pb-12">
        <div className="flex flex-grow flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-shrink-0 justify-center">
            <Icon icon="feather:alert-triangle" className="h-12 text-primary-500 w-auto" />
          </div>
          <div className="py-4 text-center">
            <h1 className="mt-2 text-4xl font-extrabold text-gray-500 dark:text-white tracking-tight sm:text-5xl">
              Whoops!
            </h1>
            <p className="mt-8 text-sm font-medium text-gray-300 dark:text-gray-400">
              We searched everywhere for the requested page, but we couldn&apos;t find anything.
            </p>
            <div className="mt-6 flex justify-center items-center space-x-4">
              <Button onClick={() => history.go(-1)} icon="feather:arrow-left">
                Back
              </Button>
              <Button href="/" icon="feather:home">
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
);

export default NotFound;
