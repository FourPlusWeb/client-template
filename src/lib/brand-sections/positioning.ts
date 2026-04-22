import { z } from "zod";

export const categoryClaimSchema = z.object({
  competitors: z.array(
    z.object({
      framing: z.string().trim(),
      territory: z.string().trim(),
    }),
  ),
  ourFraming: z.string().trim(),
  ourTerritory: z.string().trim(),
});

export const pillarSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim(),
});

export const trustEquationSchema = z.object({
  formula: z.string().trim(),
  pillars: z.array(pillarSchema),
});

export const valueRowSchema = z.object({
  tier: z.enum(["Functional", "Emotional", "Transformational"]),
  question: z.string().trim(),
  answer: z.string().trim(),
});

export const comparisonMatrixSchema = z.object({
  columns: z.array(z.string().trim()),
  rows: z.array(
    z.object({
      capability: z.string().trim(),
      values: z.array(z.enum(["yes", "no", "na"])),
    }),
  ),
});

export const positioningSchema = z.object({
  categoryClaim: categoryClaimSchema,
  moat: z.string().trim(),
  trustEquation: trustEquationSchema,
  valueArchitecture: z.array(valueRowSchema).length(3),
  comparisonMatrix: comparisonMatrixSchema,
});

export type PositioningData = z.infer<typeof positioningSchema>;
export type CategoryClaim = z.infer<typeof categoryClaimSchema>;
export type Pillar = z.infer<typeof pillarSchema>;
export type TrustEquation = z.infer<typeof trustEquationSchema>;
export type ValueRow = z.infer<typeof valueRowSchema>;
export type ComparisonMatrix = z.infer<typeof comparisonMatrixSchema>;

const FIXED_TIERS: ValueRow["tier"][] = [
  "Functional",
  "Emotional",
  "Transformational",
];

export const positioningDefaults: PositioningData = {
  categoryClaim: {
    competitors: [{ framing: "", territory: "" }],
    ourFraming: "",
    ourTerritory: "",
  },
  moat: "",
  trustEquation: {
    formula: "",
    pillars: [
      { name: "Pillar 1", description: "" },
      { name: "Pillar 2", description: "" },
      { name: "Pillar 3", description: "" },
    ],
  },
  valueArchitecture: FIXED_TIERS.map((tier) => ({
    tier,
    question: defaultQuestionFor(tier),
    answer: "",
  })),
  comparisonMatrix: {
    columns: ["Us", "Competitor A", "Competitor B"],
    rows: [{ capability: "", values: ["yes", "no", "no"] }],
  },
};

function defaultQuestionFor(tier: ValueRow["tier"]): string {
  if (tier === "Functional") return "What it is";
  if (tier === "Emotional") return "How it feels";
  return "What you become";
}

type Subsection = { header: string; body: string };

function splitSubsections(raw: string): Subsection[] {
  const out: Subsection[] = [];
  const lines = raw.split(/\r?\n/);
  let header = "";
  let buffer: string[] = [];
  let seen = false;

  const flush = () => {
    if (seen) out.push({ header, body: buffer.join("\n").trim() });
    buffer = [];
  };

  for (const line of lines) {
    const m = line.match(/^###\s+(.+?)\s*$/);
    if (m) {
      flush();
      header = m[1];
      seen = true;
    } else {
      buffer.push(line);
    }
  }
  flush();
  return out;
}

function findSubsection(
  subs: Subsection[],
  re: RegExp,
): Subsection | undefined {
  return subs.find((s) => re.test(s.header));
}

function parseTable(body: string): string[][] {
  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  if (lines.length < 3) return [];
  const splitRow = (line: string) =>
    line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());
  return lines.slice(2).map(splitRow);
}

function parseTableWithHeader(body: string): { cols: string[]; rows: string[][] } | null {
  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  if (lines.length < 2) return null;
  const splitRow = (line: string) =>
    line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());
  const cols = splitRow(lines[0]);
  const rows = lines.slice(2).map(splitRow);
  return { cols, rows };
}

function stripBold(s: string): string {
  return s.replace(/^\*\*([\s\S]*)\*\*$/, "$1").trim();
}

function isTodo(v: string): boolean {
  return !v || /^TODO\b/i.test(v);
}

function cleanRow(r: string[]): string[] {
  return r.map(stripBold);
}

function parseYesNo(cell: string): "yes" | "no" | "na" {
  const t = cell.trim().toLowerCase();
  if (/✅|yes|✓/.test(t)) return "yes";
  if (/n\/?a/.test(t)) return "na";
  return "no";
}

function renderYesNo(v: "yes" | "no" | "na"): string {
  if (v === "yes") return "✅";
  if (v === "na") return "n/a";
  return "❌";
}

function parseCategoryClaim(body: string): CategoryClaim {
  const table = parseTable(body)
    .map(cleanRow)
    .filter((r) => r.length >= 2 && r.some((c) => c && !isTodo(c)));
  if (table.length === 0) return positioningDefaults.categoryClaim;
  const ours = table[table.length - 1];
  const competitors = table.slice(0, -1).map((r) => ({
    framing: r[0] || "",
    territory: r[1] || "",
  }));
  return {
    competitors: competitors.length
      ? competitors
      : positioningDefaults.categoryClaim.competitors,
    ourFraming: ours[0] || "",
    ourTerritory: ours[1] || "",
  };
}

function parseMoat(body: string): string {
  // Return body minus italic description and any heading, as concatenated prose.
  const lines = body.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      out.push("");
      continue;
    }
    if (/^_.+_$/.test(t)) continue;
    out.push(line);
  }
  const trimmed = out.join("\n").trim();
  if (isTodo(trimmed)) return "";
  return trimmed;
}

function parseTrustEquation(body: string): TrustEquation {
  const codeMatch = body.match(/```[^\n]*\n([\s\S]*?)```/);
  const formula = codeMatch && !isTodo(codeMatch[1].trim()) ? codeMatch[1].trim() : "";

  const pillars: Pillar[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^-\s*\*\*([^*]+?)\.\*\*\s*(.*)$/);
    if (!m) continue;
    const name = m[1].trim();
    const description = m[2].trim();
    if (isTodo(description) && isTodo(name)) continue;
    pillars.push({
      name,
      description: isTodo(description) ? "" : description,
    });
  }
  if (pillars.length === 0) {
    return positioningDefaults.trustEquation;
  }
  return { formula, pillars };
}

function parseValueArchitecture(body: string): ValueRow[] {
  const rows = parseTable(body).map(cleanRow);
  const byTier = new Map<ValueRow["tier"], { question: string; answer: string }>();
  for (const r of rows) {
    if (r.length < 3) continue;
    const tierKey = FIXED_TIERS.find((t) => new RegExp(t, "i").test(r[0]));
    if (!tierKey) continue;
    byTier.set(tierKey, {
      question: isTodo(r[1]) ? defaultQuestionFor(tierKey) : r[1],
      answer: isTodo(r[2]) ? "" : r[2],
    });
  }
  return FIXED_TIERS.map((tier) => {
    const existing = byTier.get(tier);
    return {
      tier,
      question: existing?.question ?? defaultQuestionFor(tier),
      answer: existing?.answer ?? "",
    };
  });
}

function parseComparisonMatrix(body: string): ComparisonMatrix {
  const table = parseTableWithHeader(body);
  if (!table) return positioningDefaults.comparisonMatrix;
  const headerCols = table.cols.map(stripBold);
  // First column is "Capability" label; rest are competitors.
  const columns = headerCols.slice(1).length
    ? headerCols.slice(1)
    : positioningDefaults.comparisonMatrix.columns;

  const rows = table.rows
    .map(cleanRow)
    .filter((r) => r.length >= 2 && !(r[0] === "" || /^TODO\b/i.test(r[0])))
    .map((r) => ({
      capability: r[0],
      values: columns.map((_, i) => parseYesNo(r[i + 1] ?? "")),
    }));

  return {
    columns,
    rows: rows.length
      ? rows
      : positioningDefaults.comparisonMatrix.rows,
  };
}

export function parsePositioning(raw: string): PositioningData {
  const subs = splitSubsections(raw);

  const catSub = findSubsection(subs, /category\s+claim/i);
  const moatSub = findSubsection(subs, /\bmoat\b/i);
  const trustSub = findSubsection(subs, /trust\s+equation|differentiator/i);
  const valueSub = findSubsection(subs, /value\s+architecture/i);
  const matrixSub = findSubsection(
    subs,
    /comparison\s+matrix|structural\s+comparison/i,
  );

  return {
    categoryClaim: catSub
      ? parseCategoryClaim(catSub.body)
      : positioningDefaults.categoryClaim,
    moat: moatSub ? parseMoat(moatSub.body) : "",
    trustEquation: trustSub
      ? parseTrustEquation(trustSub.body)
      : positioningDefaults.trustEquation,
    valueArchitecture: valueSub
      ? parseValueArchitecture(valueSub.body)
      : positioningDefaults.valueArchitecture,
    comparisonMatrix: matrixSub
      ? parseComparisonMatrix(matrixSub.body)
      : positioningDefaults.comparisonMatrix,
  };
}

function renderCategoryClaim(c: CategoryClaim): string[] {
  const parts: string[] = [];
  parts.push("### Category claim");
  parts.push("");
  parts.push("| Competitor framing | Territory |");
  parts.push("|---|---|");
  const comps = c.competitors.length
    ? c.competitors
    : positioningDefaults.categoryClaim.competitors;
  for (const row of comps) {
    parts.push(`| ${row.framing || "TODO"} | ${row.territory || "TODO"} |`);
  }
  parts.push(
    `| **${c.ourFraming || "TODO"}** | **${c.ourTerritory || "TODO"}** |`,
  );
  return parts;
}

function renderMoat(moat: string): string[] {
  const parts: string[] = [];
  parts.push("### The moat");
  parts.push("");
  parts.push(moat || "TODO");
  return parts;
}

function renderTrustEquation(t: TrustEquation): string[] {
  const parts: string[] = [];
  parts.push("### The trust equation");
  parts.push("");
  if (t.formula) {
    parts.push("```");
    parts.push(t.formula);
    parts.push("```");
    parts.push("");
  }
  const pillars = t.pillars.length ? t.pillars : positioningDefaults.trustEquation.pillars;
  for (const p of pillars) {
    parts.push(`- **${p.name || "Pillar"}.** ${p.description || "TODO"}`);
  }
  return parts;
}

function renderValueArchitecture(rows: ValueRow[]): string[] {
  const parts: string[] = [];
  parts.push("### The value architecture");
  parts.push("");
  parts.push("| Tier | Question | Our answer |");
  parts.push("|---|---|---|");
  const byTier = new Map(rows.map((r) => [r.tier, r]));
  for (const tier of FIXED_TIERS) {
    const r = byTier.get(tier) ?? {
      tier,
      question: defaultQuestionFor(tier),
      answer: "",
    };
    parts.push(
      `| ${r.tier} | ${r.question || defaultQuestionFor(tier)} | ${r.answer || "TODO"} |`,
    );
  }
  return parts;
}

function renderComparisonMatrix(m: ComparisonMatrix): string[] {
  const parts: string[] = [];
  parts.push("### Structural comparison matrix");
  parts.push("");
  const cols = m.columns.length
    ? m.columns
    : positioningDefaults.comparisonMatrix.columns;
  parts.push(`| Capability | ${cols.join(" | ")} |`);
  parts.push(`|${"---|".repeat(cols.length + 1)}`);
  const rows = m.rows.length ? m.rows : positioningDefaults.comparisonMatrix.rows;
  for (const r of rows) {
    const vals = cols.map((_, i) => renderYesNo(r.values[i] ?? "no"));
    parts.push(`| ${r.capability || "TODO"} | ${vals.join(" | ")} |`);
  }
  return parts;
}

export function renderPositioning(data: PositioningData): string {
  const parts: string[] = [];
  parts.push("## 2. Positioning");
  parts.push("");
  parts.push(...renderCategoryClaim(data.categoryClaim));
  parts.push("");
  parts.push(...renderMoat(data.moat));
  parts.push("");
  parts.push(...renderTrustEquation(data.trustEquation));
  parts.push("");
  parts.push(...renderValueArchitecture(data.valueArchitecture));
  parts.push("");
  parts.push(...renderComparisonMatrix(data.comparisonMatrix));
  return parts.join("\n");
}
