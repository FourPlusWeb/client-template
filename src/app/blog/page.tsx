import type { Metadata } from "next";
import {
  BlogList,
  Container,
  FluidSection,
  SectionHeading,
  type BlogListItem,
} from "@fourplusweb/ui";
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

  const items: BlogListItem[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.description,
    image: p.image,
    imageAlt: p.title,
    publishDate: p.date,
    readingTime: p.readingTime,
  }));

  return (
    <FluidSection role="pillar">
      <Container>
        <SectionHeading
          as="h1"
          overline="Блог"
          title="Блог"
          description="Добавете ваши статии тук. Променете заглавието и описанието."
        />

        <div className="mt-12">
          <BlogList posts={items} />
        </div>
      </Container>
    </FluidSection>
  );
}
