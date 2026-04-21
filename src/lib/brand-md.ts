/**
 * Parse and render the studio BRAND.md file.
 *
 * BRAND.md is the single source of truth for a client's brand profile.
 * The /studio/brand route reads it, lets you edit per-section, and writes
 * it back. Roundtrip (parse → render) must be stable.
 *
 * The file is structured as 11 numbered sections (## 1. Identity, ## 2.
 * Positioning, etc). This module splits on those headers and renders
 * each section's content back.
 *
 * v1 model: sections are stored as raw Markdown blocks. Per-field editing
 * lives inside each section's page.tsx (Identity has 5 text inputs, etc).
 * Parsing into structured objects (e.g. Identity → { name, tagline, ... })
 * is per-section and lives next to the form.
 */

import { readFile, writeFile, copyFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";

export type SectionSlug =
  | "identity"
  | "positioning"
  | "voice"
  | "personas"
  | "narratives"
  | "competitive"
  | "sales"
  | "verticals"
  | "visual"
  | "architecture"
  | "open-fields";

export type Section = {
  slug: SectionSlug;
  number: number;
  title: string;
};

export const SECTIONS: Section[] = [
  { slug: "identity", number: 1, title: "Identity" },
  { slug: "positioning", number: 2, title: "Positioning" },
  { slug: "voice", number: 3, title: "Voice guardrails" },
  { slug: "personas", number: 4, title: "Personas and ICPs" },
  { slug: "narratives", number: 5, title: "Narratives" },
  { slug: "competitive", number: 6, title: "Competitive positioning" },
  { slug: "sales", number: 7, title: "Sales plays" },
  { slug: "verticals", number: 8, title: "Vertical overlays" },
  { slug: "visual", number: 9, title: "Visual system" },
  { slug: "architecture", number: 10, title: "Site architecture" },
  { slug: "open-fields", number: 11, title: "Open fields" },
];

export function sectionBySlug(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

/**
 * Parsed BRAND.md: frontmatter (above section 1) + one raw Markdown block
 * per numbered section, indexed by slug.
 */
export type ParsedBrand = {
  preamble: string;
  sections: Record<SectionSlug, string>;
};

const SECTION_HEADER_RE = /^##\s+(\d+)\.\s+(.+?)\s*$/;

export function parseBrandMd(source: string): ParsedBrand {
  const lines = source.split(/\r?\n/);
  const sections: Partial<Record<SectionSlug, string>> = {};
  let preamble = "";
  let current: SectionSlug | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) sections[current] = buffer.join("\n").trim();
    else preamble = buffer.join("\n").trim();
    buffer = [];
  };

  for (const line of lines) {
    const m = line.match(SECTION_HEADER_RE);
    if (m) {
      flush();
      const num = Number(m[1]);
      const match = SECTIONS.find((s) => s.number === num);
      current = match?.slug ?? null;
      buffer.push(line);
    } else {
      buffer.push(line);
    }
  }
  flush();

  const filled: Record<SectionSlug, string> = {} as Record<SectionSlug, string>;
  for (const s of SECTIONS) filled[s.slug] = sections[s.slug] ?? "";
  return { preamble, sections: filled };
}

export function renderBrandMd(parsed: ParsedBrand): string {
  const parts: string[] = [];
  if (parsed.preamble.trim()) parts.push(parsed.preamble.trim());
  for (const s of SECTIONS) {
    const body = parsed.sections[s.slug]?.trim();
    if (body) parts.push(body);
  }
  return parts.join("\n\n---\n\n") + "\n";
}

const BRAND_MD = "BRAND.md";
const BRAND_BAK = "BRAND.md.bak";

export async function readBrand(cwd: string = process.cwd()): Promise<ParsedBrand> {
  const src = await readFile(join(cwd, BRAND_MD), "utf8");
  return parseBrandMd(src);
}

export async function writeBrandSection(
  slug: SectionSlug,
  nextContent: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const path = join(cwd, BRAND_MD);
  const bak = join(cwd, BRAND_BAK);

  let parsed: ParsedBrand;
  try {
    await access(path);
    parsed = await readBrand(cwd);
    await copyFile(path, bak);
  } catch {
    parsed = { preamble: "", sections: SECTIONS.reduce((acc, s) => {
      acc[s.slug] = "";
      return acc;
    }, {} as Record<SectionSlug, string>) };
  }

  parsed.sections[slug] = nextContent.trim();
  await writeFile(path, renderBrandMd(parsed), "utf8");
}

export async function clearBackups(cwd: string = process.cwd()): Promise<string[]> {
  const { rm } = await import("node:fs/promises");
  const cleaned: string[] = [];
  for (const name of [BRAND_BAK, "BRIEF.md.bak", "site.config.ts.bak"]) {
    const p = join(cwd, name);
    try {
      await access(p);
      await rm(p);
      cleaned.push(name);
    } catch {
      // not present, skip
    }
  }
  return cleaned;
}

export function resolveTargetCwd(): string {
  // Studio routes run in the client site's own Next.js dev server.
  // cwd === the client site directory (the one that has BRAND.md next to package.json).
  return resolve(process.cwd());
}
