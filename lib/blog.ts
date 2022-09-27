import { promises as fs } from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import RehypeAutolinkHeadings from 'rehype-autolink-headings';
import RehypeSlug from 'rehype-slug';
import RemarkEmoji from 'remark-emoji';
import RemarkGfm from 'remark-gfm';
import RemarkPrism from 'remark-prism';

import remarkCodeTitles from '@/lib/remark-code-titles';
import { FrontMatter, Post } from '@/types';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

interface RawFrontMatter {
  title: string;
  description: string;
  category?: string;
  date: string;
}

const getOrdinal = (day: number): string => {
  if (day === 11 || day === 12 || day === 13) return 'th';

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

/**
 * Get all the available posts
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(POSTS_DIRECTORY);
  return files.map((f) => f.replace('.md', ''));
}

const buildMetadata = (slug: string, frontmatter: RawFrontMatter): FrontMatter => {
  const date = new Date(frontmatter.date);
  const month = MONTHS[date.getMonth()];
  const ordinal = getOrdinal(date.getDate());

  return {
    ...frontmatter,
    slug,
    date: `${month} ${date.getDate()}${ordinal}, ${date.getFullYear()}`,
    timestamp: date.getTime(),
  };
};

/**
 * Get the metadata for a post
 * @param file the path to the post
 */
async function getPostMetadata(file: string): Promise<FrontMatter> {
  const post = await fs.readFile(path.join(POSTS_DIRECTORY, file), { encoding: 'utf-8' });

  const { data } = matter(post);
  return buildMetadata(file.replace('.md', ''), data as RawFrontMatter);
}

/**
 * Get all the metadata about a post
 */
export async function getAllPostMetadata(): Promise<FrontMatter[]> {
  const files = await fs.readdir(POSTS_DIRECTORY);
  const posts = await Promise.all(files.map(getPostMetadata));

  posts.sort((a, b) => b.timestamp - a.timestamp);

  return posts;
}

/**
 * Get all the data for a post
 * @param slug the post's slug
 */
export async function getPost(slug: string): Promise<Post> {
  const post = await fs.readFile(path.join(POSTS_DIRECTORY, `${slug}.md`), { encoding: 'utf-8' });

  const { content, data } = matter(post);
  const frontmatter = buildMetadata(slug, data as RawFrontMatter);

  const source = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [RehypeAutolinkHeadings, {}],
        [RehypeSlug, {}],
      ],
      remarkPlugins: [remarkCodeTitles, RemarkEmoji, RemarkGfm, RemarkPrism],
    },
  });

  return { frontmatter, source };
}
