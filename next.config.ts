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
};

export default withMDX(config) as NextConfig;
