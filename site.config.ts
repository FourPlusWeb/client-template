import type { SiteConfig } from "@fourplusweb/config";

export const siteConfig: SiteConfig = {
  name: "Studio Name",
  description:
    "Production-ready websites and product pages with a polished, conversion-focused foundation.",
  url: "https://example.com",
  locale: "bg",
  colors: {
    primary: "#4F46E5",
    primaryLight: "#818CF8",
    primaryDark: "#3730A3",
    accent: "#F59E0B",
    surface: "#FFFFFF",
    surfaceAlt: "#F8FAFC",
    text: "#0F172A",
    textMuted: "#52606F",
    border: "#CBD5E1",
  },
  fonts: {
    sans: "Inter Variable",
    display: "Plus Jakarta Sans",
  },
  style: {
    radius: "md",
    shadow: "md",
    buttonStyle: "solid",
  },
  contact: {
    email: "hello@example.com",
    phone: "+359 2 000 0000",
    address: "София, ул. Примерна 1",
  },
  social: {},
  nav: [
    { label: "Начало", href: "/" },
    { label: "За нас", href: "/about" },
    { label: "Услуги", href: "/services" },
    { label: "Блог", href: "/blog" },
    { label: "Контакти", href: "/contact" },
  ],

  // Uncomment and fill to enable analytics. Requires user consent via
  // CookieBanner (already wired in layout.tsx).
  // analytics: {
  //   plausible: { domain: "example.com" },
  //   // ga4: { id: "G-XXXXXXXXXX" },
  //   // fathom: { id: "ABCDEFGH" },
  // },

  // Uncomment and fill to enable Sentry. Requires installing @sentry/nextjs
  // as a direct dep (it's an optional peer of @fourplusweb/ui).
  // monitoring: {
  //   sentry: {
  //     dsn: "https://xxx@sentry.io/xxx",
  //     tracesSampleRate: 0.1,
  //   },
  // },
};
