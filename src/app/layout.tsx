import type { Metadata } from "next";
import {
  Analytics,
  ConsentProvider,
  CookieBanner,
  Footer,
  Header,
  SentryInit,
  type FooterSocialItem,
} from "@fourplusweb/ui";
import { themeToCSS } from "@fourplusweb/config";
import { siteConfig } from "../../site.config";
import { ScrollReveal } from "../components/ScrollReveal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

const socialItems: FooterSocialItem[] = Object.entries(siteConfig.social ?? {}).map(
  ([label, href]) => ({ label, href }),
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.locale} style={themeToCSS(siteConfig)}>
      <body className="antialiased">
        <ConsentProvider>
          <SentryInit config={siteConfig.monitoring} />
          <Header
            logo={<span className="font-display text-lg">{siteConfig.name}</span>}
            nav={siteConfig.nav}
          />
          <ScrollReveal />
          <main className="relative">{children}</main>
          <Footer
            logo={<span className="font-display text-lg">{siteConfig.name}</span>}
            nav={siteConfig.nav}
            contact={siteConfig.contact}
            social={socialItems}
            copyright={`© ${new Date().getFullYear()} ${siteConfig.name}. Всички права запазени.`}
          />
          <CookieBanner />
          <Analytics config={siteConfig.analytics} />
        </ConsentProvider>
      </body>
    </html>
  );
}
