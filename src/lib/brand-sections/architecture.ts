import { z } from "zod";

export type NavItem = { label: string; href: string };

export const ARCHETYPES = ["A1", "A2", "A3", "A4", "A5", "A6"] as const;
export const VARIATIONS = ["P1", "P2", "P3", "P4", "P5", "P6"] as const;
export type ArchetypeId = (typeof ARCHETYPES)[number];
export type VariationId = (typeof VARIATIONS)[number];

export const COMMON_PAGES = [
  "Home",
  "About",
  "Services",
  "Work",
  "Case studies",
  "Blog",
  "Pricing",
  "Contact",
  "Legal",
];

export type ArchitectureData = {
  nav: NavItem[];
  pages: string[];
  archetype?: ArchetypeId;
  variation?: VariationId;
};

export const architectureSchema = z.object({
  nav: z.array(
    z.object({
      label: z.string().min(1, "Label required"),
      href: z.string().min(1, "Href required"),
    }),
  ),
  pages: z.array(z.string().min(1)),
  archetype: z.enum(ARCHETYPES).optional(),
  variation: z.enum(VARIATIONS).optional(),
});

export const EMPTY_ARCHITECTURE: ArchitectureData = {
  nav: [],
  pages: ["Home", "Contact"],
  archetype: undefined,
  variation: undefined,
};

export function parseArchitecture(markdown: string): ArchitectureData {
  const data: ArchitectureData = {
    nav: [],
    pages: [],
    archetype: undefined,
    variation: undefined,
  };

  // Primary nav: list items after the "### Primary nav" heading.
  const navSection = markdown.match(/###\s+Primary nav[^\n]*\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/);
  if (navSection) {
    const bulletRe = /^\s*-\s+(.+?)$/gm;
    let m: RegExpExecArray | null;
    while ((m = bulletRe.exec(navSection[1])) !== null) {
      const raw = m[1].trim();
      if (!raw || raw === "TODO") continue;
      // Accept either "Label | /href" or "[Label](/href)" or bare "Label /href".
      const mdLink = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (mdLink) {
        data.nav.push({ label: mdLink[1].trim(), href: mdLink[2].trim() });
        continue;
      }
      const pipe = raw.match(/^(.+?)\s*\|\s*(\S+)$/);
      if (pipe) {
        data.nav.push({ label: pipe[1].trim(), href: pipe[2].trim() });
        continue;
      }
      // Fallback: bare label, no href.
      data.nav.push({ label: raw, href: "" });
    }
  }

  const pagesSection = markdown.match(/###\s+Pages to build[^\n]*\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/);
  if (pagesSection) {
    const bulletRe = /^\s*-\s+(.+?)$/gm;
    let m: RegExpExecArray | null;
    while ((m = bulletRe.exec(pagesSection[1])) !== null) {
      const raw = m[1].trim();
      if (!raw || raw === "TODO") continue;
      data.pages.push(raw);
    }
  }

  const archetype = markdown.match(/\*\*Archetype\.\*\*\s*(A[1-6])\b/);
  if (archetype) data.archetype = archetype[1] as ArchetypeId;
  const variation = markdown.match(/\*\*Variation\.\*\*\s*(P[1-6])\b/);
  if (variation) data.variation = variation[1] as VariationId;

  return data;
}

export function renderArchitecture(data: ArchitectureData): string {
  const lines: string[] = [];
  lines.push("## 10. Site architecture (initial)");
  lines.push("");
  lines.push("### Primary nav (recommended)");
  lines.push("");
  if (data.nav.length === 0) {
    lines.push("- TODO");
  } else {
    for (const item of data.nav) {
      const href = item.href?.trim() || "";
      lines.push(href ? `- [${item.label}](${href})` : `- ${item.label}`);
    }
  }
  lines.push("");
  lines.push("### Pages to build");
  lines.push("");
  if (data.pages.length === 0) {
    lines.push("- Home");
    lines.push("- Contact");
  } else {
    for (const p of data.pages) lines.push(`- ${p}`);
  }
  lines.push("");
  lines.push("### Archetype and variation (from playbook)");
  lines.push("");
  lines.push(
    `- **Archetype.** ${data.archetype ?? "A1 / A2 / A3 / A4 / A5 / A6"} (see \`studio-factory/playbook/archetypes.md\`)`,
  );
  lines.push(
    `- **Variation.** ${data.variation ?? "P1 / P2 / P3 / P4 / P5 / P6"} (see \`studio-factory/playbook/variations.md\`)`,
  );
  return lines.join("\n");
}
