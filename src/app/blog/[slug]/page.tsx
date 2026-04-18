import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  BlogList,
  BlogPost,
  Container,
  FluidSection,
  ResponsiveImage,
  type BlogListItem,
} from "@fourplusweb/ui";
import { siteConfig } from "../../../../site.config";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "../../../lib/blog";
import { JsonLdScript, articleJsonLd } from "../../../lib/jsonld";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bg-BG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { default: MDXContent } = await import(
    `../../../../content/blog/${slug}.mdx`
  );
  const related = getRelatedPosts(slug, 3);

  const jsonLd = articleJsonLd({
    site: siteConfig,
    title: post.title,
    description: post.description,
    date: post.date,
    author: post.author,
    image: post.image,
    url: `${siteConfig.url}/blog/${post.slug}`,
  });

  const meta = (
    <div className="flex items-center gap-3 text-caption text-[color:var(--color-text-muted)]">
      <span>{post.author}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span>{post.readingTime}</span>
    </div>
  );

  const cover = (
    <ResponsiveImage
      src={post.image}
      alt={post.title}
      sizes="full"
      aspectRatio="16/9"
      priority
    />
  );

  const relatedItems: BlogListItem[] = related.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.description,
    image: p.image,
    imageAlt: p.title,
    publishDate: p.date,
    readingTime: p.readingTime,
  }));

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <BlogPost
        title={post.title}
        lead={post.description}
        meta={
          <div className="flex flex-col gap-4">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
            {meta}
          </div>
        }
        cover={cover}
      >
        <MDXContent />
        <nav className="mt-8 border-t border-[color:var(--color-border)] pt-8">
          <Link
            href="/blog"
            className="text-label text-[color:var(--color-primary)] hover:underline"
          >
            ← Обратно към блога
          </Link>
        </nav>
      </BlogPost>

      {related.length > 0 && (
        <FluidSection role="detail" background="surface-alt">
          <Container>
            <h2 className="text-h2 mb-8">Свързани постове</h2>
            <BlogList posts={relatedItems} />
          </Container>
        </FluidSection>
      )}
    </>
  );
}
