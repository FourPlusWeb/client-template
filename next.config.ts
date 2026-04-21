import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm", {}]],
    rehypePlugins: [["rehype-slug", {}], ["rehype-autolink-headings", {}]],
  },
});

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  outputFileTracingRoot: path.resolve(process.cwd(), ".."),
  // Standalone output for the committed Dockerfile fallback path.
  // Netlify (blessed default) ignores this; Docker/self-host consume
  // .next/standalone/. Safe to leave enabled across hosts.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // CSP NOT set at framework level — client-specific (analytics provider
          // domains, embedded maps, embedded YouTube/Vimeo differ per client).
          // Add per-client via site.config.ts once a .security.csp field is
          // introduced OR via host-level header config (Netlify _headers / Vercel
          // rewrites). Setting a default here would break iframe embeds and
          // analytics for any client that uses them.
        ],
      },
    ];
  },
};

export default withMDX(config) as NextConfig;
