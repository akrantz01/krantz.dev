import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { ComponentProps } from 'react';

type SeoProps = Partial<ComponentProps<typeof NextSeo>>;

export const useSeo = (props: SeoProps = {}): SeoProps => {
  const router = useRouter();

  const title = 'Alex Krantz';
  const description = "Hey 👋 I'm Alex, a quiet developer";
  const url = `https://krantz.dev/${router.asPath}`;

  return {
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      url,
      site_name: 'krantz.dev',
      type: 'website',
      // TODO: add banner image
    },
    twitter: {
      cardType: 'summary_large_image',
      handle: '@akrantz_01',
      site: '@akrantz_01',
    },
    ...props,
  };
};
