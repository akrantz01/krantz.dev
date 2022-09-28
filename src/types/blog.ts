import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface FrontMatter {
  slug: string;
  title: string;
  description: string;
  category?: string;
  date: string;
  timestamp: number;
}

export interface Post {
  frontmatter: FrontMatter;
  source: MDXRemoteSerializeResult;
}
