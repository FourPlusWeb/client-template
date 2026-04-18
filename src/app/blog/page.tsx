import type { Metadata } from "next";
import { Card, Container, FluidSection } from "@fourplusweb/ui";
import { siteConfig } from "../../../site.config";
import { getAllPosts } from "../../lib/blog";

export const metadata: Metadata = {
  title: "Блог",
  description: `Новини, идеи и статии от екипа на ${siteConfig.name}.`,
  openGraph: {
    title: `Блог · ${siteConfig.name}`,
    description: `Новини, идеи и статии от екипа на ${siteConfig.name}.`,
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <FluidSection size="lg" background="surface">
      <Container>
        <header className="mb-[var(--spacing-fluid-md)] max-w-prose">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
            Knowledge base
          </p>
          <h1 className="mt-3 font-display text-display">Блог</h1>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">
            Новини, идеи и статии, които лесно се адаптират към различен бранд и
            тон на комуникация.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.slug}
              image={post.image}
              imageAlt={post.title}
              title={post.title}
              description={post.description}
              href={`/blog/${post.slug}`}
            />
          ))}
        </div>
      </Container>
    </FluidSection>
  );
}
