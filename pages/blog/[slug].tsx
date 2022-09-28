import type { ParsedUrlQuery } from 'querystring';

import { faArrowLeft, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';

import Button from '@/components/Button';
import Comments from '@/components/Comments';
import Layout from '@/components/Layout';
import Pill from '@/components/Pill';
import { MDX_COMPONENTS } from '@/lib';
import { getAllPostSlugs, getPost } from '@/lib/blog';
import type { Post } from '@/types';

interface PathProps extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPostSlugs();

  return { paths: posts.map((slug) => ({ params: { slug } })), fallback: false };
};

export const getStaticProps: GetStaticProps<Post, PathProps> = async ({ params }) => {
  const post = await getPost(params?.slug as string);
  return { props: post };
};

const Post = (post: Post): JSX.Element => (
  <Layout
    background={false}
    seo={{
      title: `Alex Krantz - Blog - ${post.frontmatter.title}`,
      description: post.frontmatter.description,
      openGraph: { title: post.frontmatter.title },
    }}
  >
    <style global jsx>
      {`
        .remark-code-title {
          @apply light:bg-white px-4 py-2 text-gray-300 dark:text-white font-medium border-2 border-b-0 border-gray-100 dark:border-gray-500 rounded-lg rounded-b-none;
        }
      `}
    </style>
    <div className="relative px-4 py-16 overflow-hidden">
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 max-w-prose mx-auto my-4 text-lg text-center">
          <div>
            {post.frontmatter.category && (
              <span className="block text-primary-600 font-semibold tracking-wide uppsercase text-base text-center">
                {post.frontmatter.category}
              </span>
            )}
            <span className="text-gray-900 dark:text-white sm:text-4xl text-3xl text-center leading-8 font-extrabold tracking-tight">
              {post.frontmatter.title}
            </span>
          </div>

          <span className="flex justify-center items-center">
            <Pill icon={faCalendarDays}>{post.frontmatter.date}</Pill>
          </span>

          <p className="mt-8 text-xl text-gray-400 leading-8">{post.frontmatter.description}</p>
        </div>

        <article className="max-w-prose mx-auto prose prose-primary prose-lg text-gray-500 mx-auto">
          <MDXRemote {...post.source} components={MDX_COMPONENTS} />

          <Comments />
        </article>

        <div className="max-w-prose mx-auto my-4">
          <Button className="-ml-8" href="/blog" outline small icon={faArrowLeft}>
            Back
          </Button>
        </div>
      </div>
    </div>
  </Layout>
);

export default Post;
