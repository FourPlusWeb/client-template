/**
 * Regex-based rewriter for site.config.ts. The studio editor uses this to
 * mirror edits made in the Visual and Site Architecture sections of BRAND.md
 * back into the runtime config.
 *
 * Deliberately regex-only. The template's site.config.ts has a flat,
 * predictable shape; an AST pass would be overkill and would pull in a TS
 * parser just for two fields. If a future shape change breaks the regex, we
 * want it to fail loudly rather than silently mangle the file.
 */

import { readFile, writeFile, copyFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";

export type ColorsData = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
};

export type FontsData = {
  sans: string;
  display: string;
  mono?: string;
};

export type NavItem = { label: string; href: string };

const SITE_CONFIG = "site.config.ts";
const SITE_CONFIG_BAK = "site.config.ts.bak";

const COLOR_KEYS: (keyof ColorsData)[] = [
  "primary",
  "primaryLight",
  "primaryDark",
  "accent",
  "surface",
  "surfaceAlt",
  "text",
  "textMuted",
  "border",
];

/**
 * Match the `colors: { ... }` block, non-greedy. The closing `}` is followed
 * by a comma because the block is never the last property in SiteConfig.
 */
const COLORS_BLOCK_RE = /colors\s*:\s*\{[\s\S]*?\},/m;
const FONTS_BLOCK_RE = /fonts\s*:\s*\{[\s\S]*?\},/m;
const NAV_BLOCK_RE = /nav\s*:\s*\[[\s\S]*?\],/m;
const VARIATION_RE = /variation\s*:\s*"[^"]*",?/m;

function escapeString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function renderColorsBlock(colors: ColorsData, indent = "  "): string {
  const inner = COLOR_KEYS
    .map((k) => `${indent}  ${k}: "${escapeString(colors[k])}",`)
    .join("\n");
  return `colors: {\n${inner}\n${indent}},`;
}

function renderFontsBlock(fonts: FontsData, indent = "  "): string {
  const lines = [`${indent}  sans: "${escapeString(fonts.sans)}",`, `${indent}  display: "${escapeString(fonts.display)}",`];
  if (fonts.mono && fonts.mono.trim()) {
    lines.push(`${indent}  mono: "${escapeString(fonts.mono)}",`);
  }
  return `fonts: {\n${lines.join("\n")}\n${indent}},`;
}

function renderNavBlock(nav: NavItem[], indent = "  "): string {
  if (nav.length === 0) return `nav: [],`;
  const inner = nav
    .map(
      (item) =>
        `${indent}  { label: "${escapeString(item.label)}", href: "${escapeString(item.href)}" },`,
    )
    .join("\n");
  return `nav: [\n${inner}\n${indent}],`;
}

function readSource(cwd: string): Promise<string> {
  return readFile(join(cwd, SITE_CONFIG), "utf8");
}

async function backupAndWrite(cwd: string, next: string): Promise<void> {
  const path = join(cwd, SITE_CONFIG);
  const bak = join(cwd, SITE_CONFIG_BAK);
  try {
    await access(path);
    await copyFile(path, bak);
  } catch {
    // file missing — nothing to back up. writeFile will still create it.
  }
  await writeFile(path, next, "utf8");
}

export async function writeColorsAndFonts(
  colors: ColorsData,
  fonts: FontsData,
  cwd: string = process.cwd(),
): Promise<void> {
  const src = await readSource(cwd);

  if (!COLORS_BLOCK_RE.test(src)) {
    throw new Error(
      "site-config-writer: could not find `colors: { ... },` block in site.config.ts",
    );
  }
  if (!FONTS_BLOCK_RE.test(src)) {
    throw new Error(
      "site-config-writer: could not find `fonts: { ... },` block in site.config.ts",
    );
  }

  let next = src.replace(COLORS_BLOCK_RE, renderColorsBlock(colors));
  next = next.replace(FONTS_BLOCK_RE, renderFontsBlock(fonts));

  await backupAndWrite(cwd, next);
}

export async function writeNavAndVariation(
  nav: NavItem[],
  variation: string | undefined,
  cwd: string = process.cwd(),
): Promise<void> {
  const src = await readSource(cwd);

  if (!NAV_BLOCK_RE.test(src)) {
    throw new Error(
      "site-config-writer: could not find `nav: [ ... ],` block in site.config.ts",
    );
  }

  let next = src.replace(NAV_BLOCK_RE, renderNavBlock(nav));

  if (variation && variation.trim()) {
    const variationLine = `variation: "${escapeString(variation)}",`;
    if (VARIATION_RE.test(next)) {
      next = next.replace(VARIATION_RE, variationLine);
    } else {
      // Insert after the nav block. Matches the closing `],` of the nav array
      // we just rewrote and appends a new line immediately after.
      next = next.replace(NAV_BLOCK_RE, (match) => `${match}\n  ${variationLine}`);
    }
  }

  await backupAndWrite(cwd, next);
}

export type ParsedSiteConfig = {
  colors?: ColorsData;
  fonts?: FontsData;
  nav?: NavItem[];
  variation?: string;
};

export async function parseSiteConfig(cwd: string = process.cwd()): Promise<ParsedSiteConfig> {
  const src = await readSource(cwd);
  const out: ParsedSiteConfig = {};

  const colorsBlock = src.match(COLORS_BLOCK_RE)?.[0];
  if (colorsBlock) {
    const partial: Partial<ColorsData> = {};
    for (const k of COLOR_KEYS) {
      const m = colorsBlock.match(new RegExp(`${k}\\s*:\\s*"([^"]*)"`));
      if (m) partial[k] = m[1];
    }
    if (COLOR_KEYS.every((k) => typeof partial[k] === "string")) {
      out.colors = partial as ColorsData;
    }
  }

  const fontsBlock = src.match(FONTS_BLOCK_RE)?.[0];
  if (fontsBlock) {
    const sans = fontsBlock.match(/sans\s*:\s*"([^"]*)"/)?.[1];
    const display = fontsBlock.match(/display\s*:\s*"([^"]*)"/)?.[1];
    const mono = fontsBlock.match(/mono\s*:\s*"([^"]*)"/)?.[1];
    if (typeof sans === "string" && typeof display === "string") {
      out.fonts = { sans, display, ...(mono ? { mono } : {}) };
    }
  }

  const navBlock = src.match(NAV_BLOCK_RE)?.[0];
  if (navBlock) {
    const items: NavItem[] = [];
    const itemRe = /\{\s*label\s*:\s*"([^"]*)"\s*,\s*href\s*:\s*"([^"]*)"\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(navBlock)) !== null) {
      items.push({ label: m[1], href: m[2] });
    }
    out.nav = items;
  }

  const variation = src.match(VARIATION_RE)?.[0].match(/"([^"]*)"/)?.[1];
  if (variation) out.variation = variation;

  return out;
}

export function resolveSiteConfigCwd(): string {
  return resolve(process.cwd());
}
