import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Container,
  FluidSection,
  Card,
  Badge,
  ResponsiveImage,
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

  return (
    <main>
      <JsonLdScript data={jsonLd} />
      <FluidSection size="lg" background="surface">
        <Container>
          <article className="max-w-prose mx-auto">
            <header className="mb-[var(--spacing-fluid-sm)]">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-display font-display">{post.title}</h1>
              <p className="text-lg text-[var(--color-text-muted)] mt-4">
                {post.description}
              </p>
              <div className="flex items-center gap-4 mt-6 text-sm text-[var(--color-text-muted)]">
                <span>{post.author}</span>
                <span>·</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </header>

            <div className="mb-[var(--spacing-fluid-md)]">
              <ResponsiveImage
                src={post.image}
                alt={post.title}
                sizes="full"
                aspectRatio="16/9"
                priority
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <MDXContent />
            </div>

            <nav className="mt-[var(--spacing-fluid-md)] pt-8 border-t border-[var(--color-border)]">
              <Link
                href="/blog"
                className="text-[var(--color-primary)] hover:underline"
              >
                ← Обратно към блога
              </Link>
            </nav>
          </article>
        </Container>
      </FluidSection>

      {related.length > 0 && (
        <FluidSection size="md" background="surface-alt">
          <Container>
            <h2 className="text-2xl font-display mb-[var(--spacing-fluid-sm)]">
              Свързани постове
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Card
                  key={p.slug}
                  image={p.image}
                  imageAlt={p.title}
                  title={p.title}
                  description={p.description}
                  href={`/blog/${p.slug}`}
                />
              ))}
            </div>
          </Container>
        </FluidSection>
      )}
    </main>
  );
}
