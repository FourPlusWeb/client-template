import { z } from "zod";

export const verticalRowSchema = z.object({
  name: z.string().trim(),
  hook: z.string().trim(),
  signatureEmphasis: z.string().trim(),
});

export const verticalsSchema = z.object({
  preamble: z.string(),
  verticals: z.array(verticalRowSchema),
});

export type VerticalRow = z.infer<typeof verticalRowSchema>;
export type VerticalsData = z.infer<typeof verticalsSchema>;

const DEFAULT_PREAMBLE =
  "Specificity wins. Per-vertical hooks layered on top of the core message.";

export const verticalsDefaults: VerticalsData = {
  preamble: DEFAULT_PREAMBLE,
  verticals: [],
};

export function parseVerticals(raw: string): VerticalsData {
  const { preamble, tables } = splitOnTables(raw);
  const rows: VerticalRow[] = [];
  if (tables[0]) {
    for (const cells of tables[0].rows) {
      rows.push({
        name: cells[0] ?? "",
        hook: cells[1] ?? "",
        signatureEmphasis: cells[2] ?? "",
      });
    }
  }
  return {
    preamble: preamble || DEFAULT_PREAMBLE,
    verticals: rows,
  };
}

export function renderVerticals(data: VerticalsData): string {
  const lines: string[] = ["## 8. Vertical overlays", ""];
  const preamble = data.preamble.trim() || DEFAULT_PREAMBLE;
  lines.push(preamble, "");
  lines.push("| Vertical | Hook | Signature emphasis |");
  lines.push("|---|---|---|");
  for (const v of data.verticals) {
    lines.push(`| ${cell(v.name)} | ${cell(v.hook)} | ${cell(v.signatureEmphasis)} |`);
  }
  return lines.join("\n");
}

function cell(s: string): string {
  return (s ?? "").replace(/\|/g, "\\|").trim();
}

function splitRow(line: string): string[] {
  const t = line.trim();
  if (!t.startsWith("|")) return [];
  const inner = t.slice(1);
  const clean = inner.endsWith("|") ? inner.slice(0, -1) : inner;
  return clean.split("|").map((c) => c.trim());
}

function splitOnTables(raw: string): {
  preamble: string;
  tables: { header: string[]; rows: string[][] }[];
} {
  const lines = raw.split(/\r?\n/);
  const tables: { header: string[]; rows: string[][] }[] = [];
  const preambleLines: string[] = [];
  let i = 0;
  let sawH2 = false;
  while (i < lines.length) {
    const line = lines[i];
    if (/^##\s+\d+\./.test(line.trim())) {
      sawH2 = true;
      i++;
      continue;
    }
    const isPipe = line.trim().startsWith("|");
    const next = lines[i + 1];
    const isDivider = next && /^\|[\s\-:|]+\|?\s*$/.test(next.trim());
    if (isPipe && isDivider) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      tables.push({ header, rows });
      continue;
    }
    if (sawH2 && tables.length === 0 && !/^###\s/.test(line)) {
      preambleLines.push(line);
    }
    i++;
  }
  return { preamble: preambleLines.join("\n").trim(), tables };
}
