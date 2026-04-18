import type { Metadata } from "next";
import { themeToCSS } from "@fourplusweb/config";
import { siteConfig } from "../../site.config";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.locale}>
      <body style={themeToCSS(siteConfig)}>{children}</body>
    </html>
  );
}
