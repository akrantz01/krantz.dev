import { NextSeo } from 'next-seo';
import { ReactNode } from 'react';
import { useMedia } from 'react-use';

import Background from '@/components/Background';
import Navbar from '@/components/Navbar';
import { useSeo } from '@/lib';
import { WithProps } from '@/types';

interface Props {
  background?: boolean;
  children: ReactNode;
  seo?: Partial<WithProps<typeof NextSeo>>;
}

const DefaultLayout = ({ background = true, children, seo: extra }: Props): JSX.Element => {
  const disableBackground = useMedia('(prefers-reduced-motion)', true) || !background;
  const seo = useSeo(extra);

  return (
    <>
      <NextSeo {...seo} />
      <Navbar />
      <main className="flex flex-col justify-center px-8">
        {!disableBackground && <Background />}
        {children}
      </main>
    </>
  );
};

export default DefaultLayout;
