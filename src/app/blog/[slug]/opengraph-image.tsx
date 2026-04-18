import { ImageResponse } from "next/og";
import { siteConfig } from "../../../../site.config";
import { getAllPosts, getPostBySlug } from "../../../lib/blog";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return getAllPosts().map((p) => ({
    id: p.slug,
    alt: p.title,
    size,
    contentType,
  }));
}

export default async function BlogPostOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? siteConfig.name;
  const description = post?.description ?? siteConfig.description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
          color: siteConfig.colors.text,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: siteConfig.colors.primary,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {siteConfig.name} · Блог
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: siteConfig.colors.textMuted,
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
