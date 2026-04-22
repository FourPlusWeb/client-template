import { z } from "zod";

export const signatureRuleSchema = z.object({
  pattern: z.string().trim(),
  examples: z.array(z.string().trim()),
});

export const hierarchyRowSchema = z.object({
  level: z.string().trim(),
  length: z.string().trim(),
  purpose: z.string().trim(),
});

export const toneRowSchema = z.object({
  audience: z.string().trim(),
  tone: z.string().trim(),
  proof: z.string().trim(),
});

export const voiceSchema = z.object({
  bannedWords: z.array(z.string().trim()),
  bannedFormatting: z.array(z.string().trim()),
  signatureRule: signatureRuleSchema,
  competitorRule: z.string().trim(),
  outcomeRule: z.string().trim(),
  hierarchy: z.array(hierarchyRowSchema),
  personality: z.string().trim(),
  toneMatrix: z.array(toneRowSchema),
  internalTest: z.string().trim(),
});

export type VoiceData = z.infer<typeof voiceSchema>;
export type SignatureRule = z.infer<typeof signatureRuleSchema>;
export type HierarchyRow = z.infer<typeof hierarchyRowSchema>;
export type ToneRow = z.infer<typeof toneRowSchema>;

export const voiceDefaults: VoiceData = {
  bannedWords: [],
  bannedFormatting: [],
  signatureRule: { pattern: "", examples: [] },
  competitorRule: "",
  outcomeRule: "",
  hierarchy: [
    { level: "1. Hook", length: "3 to 5 words", purpose: "Stops the scroll" },
    { level: "2. Promise", length: "10 to 15 words", purpose: "Makes it concrete" },
    { level: "3. Proof", length: "25 to 35 words", purpose: "Closes with structural evidence" },
  ],
  personality: "",
  toneMatrix: [],
  internalTest: "",
};

type Subsection = { header: string; body: string };

function splitSubsections(raw: string): Subsection[] {
  const out: Subsection[] = [];
  const lines = raw.split(/\r?\n/);
  let header = "";
  let buffer: string[] = [];
  let seenHeader = false;

  const flush = () => {
    if (seenHeader) out.push({ header, body: buffer.join("\n").trim() });
    buffer = [];
  };

  for (const line of lines) {
    const m = line.match(/^###\s+(.+?)\s*$/);
    if (m) {
      flush();
      header = m[1];
      seenHeader = true;
    } else {
      buffer.push(line);
    }
  }
  flush();
  return out;
}

function findSubsection(subs: Subsection[], re: RegExp): Subsection | undefined {
  return subs.find((s) => re.test(s.header));
}

function parseBulletList(body: string): string[] {
  const items: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^-\s+(.+?)\s*$/);
    if (!m) continue;
    const v = m[1].trim();
    if (!v || /^TODO\b/i.test(v)) continue;
    items.push(v);
  }
  return items;
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

function isTodoRow(cells: string[]): boolean {
  return cells.every((c) => !c || /^TODO\b/i.test(c));
}

function stripBold(s: string): string {
  return s.replace(/^\*\*(.*)\*\*$/, "$1").trim();
}

export function parseVoice(raw: string): VoiceData {
  const subs = splitSubsections(raw);

  const bannedFmt = findSubsection(subs, /banned\s+(?:punctuation|formatting)|em\s+dash\s+ban/i);
  const bannedFormatting = bannedFmt
    ? parseBulletList(bannedFmt.body).filter((l) => !/^[❌✅]/.test(l))
    : [];
  // If no bullet items, take the first paragraph as a rule statement.
  if (bannedFmt && bannedFormatting.length === 0) {
    const firstPara = bannedFmt.body.split(/\n\s*\n/)[0]?.trim();
    if (firstPara && !/^_/.test(firstPara) && !/^TODO\b/i.test(firstPara)) {
      bannedFormatting.push(firstPara);
    }
  }

  const bannedWordsSub = findSubsection(
    subs,
    /banned\s+words|no\s+crypto|no\s+.+\s+language/i,
  );
  let bannedWords: string[] = [];
  if (bannedWordsSub) {
    const bulletItems = parseBulletList(bannedWordsSub.body);
    if (bulletItems.length) {
      bannedWords = bulletItems;
    } else {
      // VINR style: "Banned phrases: a, b, c." in a paragraph.
      const paraMatch = bannedWordsSub.body.match(/Banned[^:]*:\s*([^.]+)\.?/i);
      if (paraMatch) {
        bannedWords = paraMatch[1]
          .split(/,\s*/)
          .map((s) => s.trim())
          .filter((s) => s && !/^TODO\b/i.test(s));
      }
    }
  }

  const signatureSub = findSubsection(subs, /signature\s+rule|["“”]?limitless["“”]?\s+rule/i);
  const signatureRule: SignatureRule = { pattern: "", examples: [] };
  if (signatureSub) {
    const patternMatch = signatureSub.body.match(/Pattern[:*\s]+`([^`]+)`/i);
    if (patternMatch && !/^TODO\b/i.test(patternMatch[1].trim())) {
      signatureRule.pattern = patternMatch[1].trim();
    } else {
      const code = signatureSub.body.match(/```[^\n]*\n([\s\S]*?)```/);
      if (code && !/^TODO\b/i.test(code[1].trim())) {
        signatureRule.pattern = code[1].trim();
      }
    }
    const examplesMatch = signatureSub.body.match(/Examples?[:*\s]+(.+)$/im);
    if (examplesMatch) {
      const raw = examplesMatch[1].trim();
      if (raw && !/^TODO\b/i.test(raw)) {
        signatureRule.examples = raw
          .split(/,\s*/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } else {
      // Collect `...` code spans from bullets like ✅ `Payments. Limitless.`
      const codeSpans = [...signatureSub.body.matchAll(/`([^`]+)`/g)]
        .map((m) => m[1].trim())
        .filter((s) => s && s !== signatureRule.pattern);
      signatureRule.examples = codeSpans;
    }
  }

  const competitorSub = findSubsection(
    subs,
    /competitor\s+rule|system.not.competitor/i,
  );
  const competitorRule = competitorSub ? extractProse(competitorSub.body) : "";

  const outcomeSub = findSubsection(subs, /outcome/i);
  const outcomeRule = outcomeSub ? extractProse(outcomeSub.body) : "";

  const hierarchySub = findSubsection(subs, /hierarchy|three.level/i);
  let hierarchy: HierarchyRow[] = [];
  if (hierarchySub) {
    const rows = parseTable(hierarchySub.body).filter((r) => !isTodoRow(r));
    hierarchy = rows
      .filter((r) => r.length >= 3)
      .map((r) => ({
        level: stripBold(r[0]),
        length: stripBold(r[1]),
        purpose: stripBold(r[2]),
      }));
  }
  if (hierarchy.length === 0) hierarchy = voiceDefaults.hierarchy;

  const personalitySub = findSubsection(subs, /personality/i);
  let personality = "";
  let toneMatrix: ToneRow[] = [];
  if (personalitySub) {
    const personalityMatch = personalitySub.body.match(/^Personality[^:]*:\s*(.+)$/im);
    if (personalityMatch) {
      const raw = personalityMatch[1].trim().replace(/\.$/, "");
      if (!/^TODO\b/i.test(raw)) personality = raw;
    }
    toneMatrix = parseTable(personalitySub.body)
      .filter((r) => !isTodoRow(r) && r.length >= 3)
      .map((r) => ({
        audience: stripBold(r[0]),
        tone: stripBold(r[1]),
        proof: stripBold(r[2]),
      }));
  }

  const internalTestSub = findSubsection(subs, /internal\s+test|local\s+hero/i);
  const internalTest = internalTestSub ? extractProse(internalTestSub.body) : "";

  return {
    bannedWords,
    bannedFormatting,
    signatureRule,
    competitorRule,
    outcomeRule,
    hierarchy,
    personality,
    toneMatrix,
    internalTest,
  };
}

function extractProse(body: string): string {
  const lines = body.split(/\r?\n/);
  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (current.length) {
        paragraphs.push(current.join(" "));
        current = [];
      }
      continue;
    }
    if (t.startsWith("_") || t.startsWith("- ") || t.startsWith("|") || t.startsWith("#")) {
      if (current.length) {
        paragraphs.push(current.join(" "));
        current = [];
      }
      continue;
    }
    current.push(t);
  }
  if (current.length) paragraphs.push(current.join(" "));
  const first = paragraphs.find((p) => !/^TODO\b/i.test(p)) ?? "";
  return first;
}

export function renderVoice(data: VoiceData): string {
  const parts: string[] = [];
  parts.push("## 3. Voice guardrails (hard rules)");
  parts.push("");

  parts.push("### Banned words or phrases");
  parts.push("");
  if (data.bannedWords.length) {
    for (const w of data.bannedWords) parts.push(`- ${w}`);
  } else {
    parts.push("- TODO");
  }
  parts.push("");

  parts.push("### Banned punctuation or formatting");
  parts.push("");
  if (data.bannedFormatting.length) {
    for (const w of data.bannedFormatting) parts.push(`- ${w}`);
  } else {
    parts.push("- TODO");
  }
  parts.push("");

  parts.push("### Signature rule");
  parts.push("");
  parts.push(
    `- Pattern: ${data.signatureRule.pattern ? "`" + data.signatureRule.pattern + "`" : "`TODO`"}`,
  );
  parts.push(
    `- Examples: ${data.signatureRule.examples.length ? data.signatureRule.examples.join(", ") : "TODO"}`,
  );
  parts.push("");

  parts.push("### Competitor rule");
  parts.push("");
  parts.push(data.competitorRule || "TODO");
  parts.push("");

  parts.push("### Outcome vs. mechanism");
  parts.push("");
  parts.push(data.outcomeRule || "TODO");
  parts.push("");

  parts.push("### Content hierarchy");
  parts.push("");
  parts.push("| Level | Length | Purpose |");
  parts.push("|---|---|---|");
  const hRows = data.hierarchy.length ? data.hierarchy : voiceDefaults.hierarchy;
  for (const r of hRows) {
    parts.push(`| ${r.level || "TODO"} | ${r.length || "TODO"} | ${r.purpose || "TODO"} |`);
  }
  parts.push("");

  parts.push("### Personality (constant) and tone (flexes)");
  parts.push("");
  parts.push(`Personality: ${data.personality || "TODO"}`);
  parts.push("");
  parts.push("| Audience | Tone | Proof type |");
  parts.push("|---|---|---|");
  if (data.toneMatrix.length) {
    for (const r of data.toneMatrix) {
      parts.push(`| ${r.audience || "TODO"} | ${r.tone || "TODO"} | ${r.proof || "TODO"} |`);
    }
  } else {
    parts.push("| TODO | TODO | TODO |");
  }
  parts.push("");

  parts.push("### Internal test");
  parts.push("");
  parts.push(data.internalTest || "TODO");

  return parts.join("\n");
}
