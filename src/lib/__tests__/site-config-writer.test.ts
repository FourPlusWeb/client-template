import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { writeColorsAndFonts, writeNavAndVariation, parseSiteConfig } from "../site-config-writer";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const TEST_DIR = join(process.cwd(), ".test-site-config-" + Date.now());

const SITE_CONFIG_TEMPLATE = `import type { SiteConfig } from "@fourplusweb/config";

const siteConfig: SiteConfig = {
  name: "Test Site",
  tagline: "A test site",
  colors: {
    primary: "#000000",
    primaryLight: "#111111",
    primaryDark: "#222222",
    accent: "#333333",
    surface: "#ffffff",
    surfaceAlt: "#f0f0f0",
    text: "#000000",
    textMuted: "#666666",
    border: "#dddddd",
  },
  fonts: {
    sans: "Helvetica",
    display: "Arial",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ],
  variation: "P1",
  contact: { email: "test@test.com" },
};

export default siteConfig;
`;

beforeEach(async () => {
  await mkdir(TEST_DIR, { recursive: true });
  await writeFile(join(TEST_DIR, "site.config.ts"), SITE_CONFIG_TEMPLATE, "utf8");
});

afterEach(async () => {
  try {
    await rm(TEST_DIR, { recursive: true, force: true });
  } catch {
    // ignore
  }
});

describe("site-config-writer", () => {
  it("writeColorsAndFonts updates colors and fonts blocks", async () => {
    await writeColorsAndFonts(
      {
        primary: "#FF0000",
        primaryLight: "#FF3333",
        primaryDark: "#CC0000",
        accent: "#00FF00",
        surface: "#FFFFFF",
        surfaceAlt: "#F8F8F8",
        text: "#111111",
        textMuted: "#777777",
        border: "#EEEEEE",
      },
      { sans: "Inter", display: "Roboto" },
      TEST_DIR,
    );
    const parsed = await parseSiteConfig(TEST_DIR);
    expect(parsed.colors).toEqual({
      primary: "#FF0000",
      primaryLight: "#FF3333",
      primaryDark: "#CC0000",
      accent: "#00FF00",
      surface: "#FFFFFF",
      surfaceAlt: "#F8F8F8",
      text: "#111111",
      textMuted: "#777777",
      border: "#EEEEEE",
    });
    expect(parsed.fonts).toEqual({ sans: "Inter", display: "Roboto" });
  });

  it("writeNavAndVariation updates nav and variation", async () => {
    await writeNavAndVariation(
      [
        { label: "New Page", href: "/new" },
        { label: "Another", href: "/another" },
      ],
      "P3",
      TEST_DIR,
    );
    const parsed = await parseSiteConfig(TEST_DIR);
    expect(parsed.nav).toEqual([
      { label: "New Page", href: "/new" },
      { label: "Another", href: "/another" },
    ]);
    expect(parsed.variation).toBe("P3");
  });

  it("writeColorsAndFonts does not touch nav/variation", async () => {
    await writeColorsAndFonts(
      {
        primary: "#AABBCC",
        primaryLight: "#DDEEFF",
        primaryDark: "#001122",
        accent: "#FF8800",
        surface: "#FFFFFF",
        surfaceAlt: "#F4F4F4",
        text: "#000000",
        textMuted: "#999999",
        border: "#AAAAAA",
      },
      { sans: "Comic Sans", display: "Times" },
      TEST_DIR,
    );
    const parsed = await parseSiteConfig(TEST_DIR);
    expect(parsed.nav).toEqual([
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ]);
    expect(parsed.variation).toBe("P1");
  });

  it("parseSiteConfig tolerates missing blocks", async () => {
    const minimal = `const siteConfig = { name: "Minimal" }; export default siteConfig;`;
    await writeFile(join(TEST_DIR, "site.config.ts"), minimal, "utf8");
    const parsed = await parseSiteConfig(TEST_DIR);
    expect(parsed.colors).toBeUndefined();
    expect(parsed.fonts).toBeUndefined();
    expect(parsed.nav).toBeUndefined();
    expect(parsed.variation).toBeUndefined();
  });

  it("backup file is created", async () => {
    await writeNavAndVariation([{ label: "X", href: "/x" }], "P5", TEST_DIR);
    const { readFile } = await import("node:fs/promises");
    const bak = await readFile(join(TEST_DIR, "site.config.ts.bak"), "utf8");
    expect(bak).toContain("Home");
    expect(bak).toContain("P1");
  });
});