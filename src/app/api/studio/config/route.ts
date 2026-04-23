import { NextResponse } from "next/server";
import type { SiteConfig } from "@fourplusweb/config";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-dynamic";

function prodBlock(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Studio routes are dev-only." }, { status: 404 });
  }
  return null;
}

function escapeString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function renderConfig(config: SiteConfig): string {
  const colors = Object.entries(config.colors)
    .map(([k, v]) => `    ${k}: "${escapeString(v)}",`)
    .join("\n");
  
  const fonts = `    sans: "${escapeString(config.fonts.sans)}",
    display: "${escapeString(config.fonts.display)}",`;
  
  const nav = config.nav
    .map((item) => `    { label: "${escapeString(item.label)}", href: "${escapeString(item.href)}" },`)
    .join("\n");
  
  const contact = `    email: "${escapeString(config.contact.email)}",` +
    (config.contact.phone ? `\n    phone: "${escapeString(config.contact.phone)}",` : "") +
    (config.contact.address ? `\n    address: "${escapeString(config.contact.address)}",` : "");
  
  const social = config.social && Object.keys(config.social).length > 0
    ? Object.entries(config.social!)
      .map(([k, v]) => `    ${k}: "${escapeString(v)}",`)
      .join("\n")
    : "";

  return `import type { SiteConfig } from "@fourplusweb/config";

export const siteConfig: SiteConfig = {
  name: "${escapeString(config.name)}",
  description: "${escapeString(config.description)}",
  url: "${escapeString(config.url)}",
  locale: "${escapeString(config.locale)}",
  colors: {
${colors}
  },
  fonts: {
${fonts}
  },
  style: {
    radius: "${config.style.radius}",
    shadow: "${config.style.shadow}",
    buttonStyle: "${config.style.buttonStyle}",
  },
  contact: {
${contact}
  },
  social: {
${social}
  },
  nav: [
${nav}
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

  // Uncomment and fill to enable hCaptcha bot challenge on the contact form.
  // captcha: {
  //   provider: "hcaptcha",
  //   siteKey: "10000000-ffff-ffff-ffff-000000000001",
  //   secret: process.env.HCAPTCHA_SECRET ?? "",
  // },
};
`;
}

export async function GET() {
  const blocked = prodBlock();
  if (blocked) return blocked;

  try {
    const src = await readFile(join(process.cwd(), "site.config.ts"), "utf8");
    return NextResponse.json({ source: src });
  } catch {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const blocked = prodBlock();
  if (blocked) return blocked;

  try {
    const config = await request.json();
    const source = renderConfig(config);
    
    // Backup existing
    try {
      const existing = await readFile(join(process.cwd(), "site.config.ts"), "utf8");
      await writeFile(join(process.cwd(), "site.config.ts.bak"), existing, "utf8");
    } catch {
      // No existing file
    }
    
    await writeFile(join(process.cwd(), "site.config.ts"), source, "utf8");
    return NextResponse.json({ success: true });
  } catch {
    const msg = "Failed to write config";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}