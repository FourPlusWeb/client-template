import type { Metadata } from "next";
import { Container, FluidSection, Card } from "@fourplusweb/ui";
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
    <main>
      <FluidSection size="lg" background="surface">
        <Container>
          <header className="mb-[var(--spacing-fluid-md)] max-w-prose">
            <h1 className="text-display font-display">Блог</h1>
            <p className="text-lg text-[var(--color-text-muted)] mt-4">
              Новини, идеи и статии от екипа.
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
    </main>
  );
}
