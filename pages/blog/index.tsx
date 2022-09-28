import type { GetStaticProps } from 'next';

import BlogPostCard from '@/components/BlogPostCard';
import Layout from '@/components/Layout';
import { getAllPostMetadata } from '@/lib/blog';
import type { FrontMatter } from '@/types';

interface Props {
  metadata: FrontMatter[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const metadata = await getAllPostMetadata();
  return { props: { metadata } };
};

const Blog = ({ metadata }: Props): JSX.Element => {
  const latest = metadata[0];
  const rest = metadata.slice(1);

  return (
    <Layout seo={{ title: 'Alex Krantz - Blog' }}>
      <div className="mt-8 sm:mt-16 mb-20 mx-0 sm:mx-6 lg:mb-28 lg:mx-8">
        <div className="relative max-w-6xl mx-auto">
          <BlogPostCard latest {...latest} />
          <div className="mt-4 lg:mt-12 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:max-w-none">
            {rest.map((post, i) => (
              <BlogPostCard key={i} {...post} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
