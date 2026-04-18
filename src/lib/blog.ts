import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
};

export type Post = PostFrontmatter & {
  slug: string;
  readingTime: string;
  content: string;
};

const BLOG_DIR = join(process.cwd(), "content", "blog");

function readPost(filename: string): Post {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = readFileSync(join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    author: fm.author,
    image: fm.image,
    tags: fm.tags ?? [],
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllPosts(): Post[] {
  const files = readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
  return files
    .map(readPost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const files = readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
  const match = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!match) return null;
  return readPost(match);
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, limit);
}
