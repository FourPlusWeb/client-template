import { z } from "zod";

export const narrativeSchema = z.object({
  title: z.string().trim(),
  leadMessage: z.string().trim(),
  audience: z.string().trim(),
  emotionalCore: z.string().trim(),
  proof: z.string().trim(),
  signature: z.string().trim(),
});

export const perPageMapEntrySchema = z.object({
  page: z.string().trim(),
  narrativeId: z.number().int().min(1),
  signature: z.string().trim(),
});

export const narrativesSchema = z.object({
  preamble: z.string(),
  narratives: z.array(narrativeSchema),
  perPageMap: z.array(perPageMapEntrySchema),
  signatureRulePattern: z.string(),
  signatureRuleNote: z.string(),
});

export type NarrativeRow = z.infer<typeof narrativeSchema>;
export type PerPageMapEntry = z.infer<typeof perPageMapEntrySchema>;
export type NarrativesData = z.infer<typeof narrativesSchema>;

const DEFAULT_PREAMBLE =
  "Three angles. Each signature closes with the Limitless full stop.";
const DEFAULT_PATTERN = "Your [context]. Limitless.";
const DEFAULT_NOTE =
  "One signature per page. Always period-prefixed. Always at the closing position.";

export const narrativesDefaults: NarrativesData = {
  preamble: DEFAULT_PREAMBLE,
  narratives: [],
  perPageMap: [],
  signatureRulePattern: DEFAULT_PATTERN,
  signatureRuleNote: DEFAULT_NOTE,
};

const NARRATIVE_RE = /^###\s+Narrative\s+\d+:\s+(.+?)\s*$/i;
const MAP_RE = /^-\s+\*\*(.+?)\.\*\*\s+Narrative\s+(\d+)\.\s+Signature:\s+`?(.+?)`?\s*$/i;
const FIELD_RE = (label: string) =>
  new RegExp(
    `^-\\s+\\*\\*${label}\\.\\*\\*\\s+(.+?)\\s*$`,
    "i",
  );

export function parseNarratives(raw: string): NarrativesData {
  const sections = splitByH3(raw);
  const narratives: NarrativeRow[] = [];
  const perPageMap: PerPageMapEntry[] = [];
  let signatureRulePattern = "";
  let signatureRuleNote = "";

  // Preamble = text before first H3
  const preamble = (sections[0]?.body ?? "")
    .replace(/^##\s+\d+\..*$/m, "")
    .trim();

  for (const s of sections.slice(1)) {
    const narrMatch = s.heading.match(NARRATIVE_RE);
    if (narrMatch) {
      const body = s.body;
      narratives.push({
        title: narrMatch[1].trim(),
        leadMessage: stripQuotes(grab(body, "Lead")),
        audience: grab(body, "For"),
        emotionalCore: grab(body, "Core"),
        proof: grab(body, "Proof"),
        signature: stripBackticks(grab(body, "Signature")),
      });
      continue;
    }
    if (/^Per-page narrative map/i.test(s.heading)) {
      for (const line of s.body.split(/\r?\n/)) {
        const m = line.match(MAP_RE);
        if (m) {
          perPageMap.push({
            page: m[1].trim(),
            narrativeId: Number(m[2]),
            signature: m[3].trim(),
          });
        }
      }
      continue;
    }
    if (/^Signature Rule/i.test(s.heading)) {
      const fenced = s.body.match(/```[^\n]*\n([\s\S]*?)```/);
      if (fenced) signatureRulePattern = fenced[1].trim();
      const after = s.body.replace(/```[\s\S]*?```/, "").trim();
      if (after) signatureRuleNote = after;
    }
  }

  return {
    preamble: preamble || DEFAULT_PREAMBLE,
    narratives,
    perPageMap,
    signatureRulePattern: signatureRulePattern || DEFAULT_PATTERN,
    signatureRuleNote: signatureRuleNote || DEFAULT_NOTE,
  };
}

export function renderNarratives(data: NarrativesData): string {
  const lines: string[] = ["## 5. Narratives", ""];
  lines.push((data.preamble.trim() || DEFAULT_PREAMBLE), "");

  data.narratives.forEach((n, i) => {
    lines.push(`### Narrative ${i + 1}: ${n.title.trim() || "TODO"}`);
    lines.push(`- **Lead.** ${quoted(n.leadMessage)}`);
    lines.push(`- **For.** ${n.audience || "TODO"}`);
    lines.push(`- **Core.** ${n.emotionalCore || "TODO"}`);
    lines.push(`- **Proof.** ${n.proof || "TODO"}`);
    lines.push(`- **Signature.** \`${n.signature || "TODO"}\``);
    lines.push("");
  });

  lines.push("### Per-page narrative map");
  for (const m of data.perPageMap) {
    lines.push(
      `- **${m.page}.** Narrative ${m.narrativeId}. Signature: \`${m.signature}\``,
    );
  }
  lines.push("");

  lines.push("### Signature Rule (global pattern)");
  lines.push("```");
  lines.push(data.signatureRulePattern.trim() || DEFAULT_PATTERN);
  lines.push("```");
  const note = data.signatureRuleNote.trim();
  if (note) lines.push(note);

  return lines.join("\n").replace(/\n+$/, "");
}

function splitByH3(raw: string): { heading: string; body: string }[] {
  const lines = raw.split(/\r?\n/);
  const out: { heading: string; body: string }[] = [{ heading: "", body: "" }];
  let current = out[0];
  const buf: string[] = [];
  const flush = () => {
    current.body = buf.join("\n").trim();
    buf.length = 0;
  };
  for (const line of lines) {
    const m = line.match(/^###\s+(.+?)\s*$/);
    if (m) {
      flush();
      current = { heading: m[1], body: "" };
      out.push(current);
    } else {
      buf.push(line);
    }
  }
  flush();
  return out;
}

function grab(body: string, label: string): string {
  const m = body.match(FIELD_RE(label));
  return m ? m[1].trim() : "";
}

function stripQuotes(s: string): string {
  return s.replace(/^"(.*)"$/s, "$1").trim();
}

function stripBackticks(s: string): string {
  return s.replace(/^`(.*)`$/s, "$1").trim();
}

function quoted(s: string): string {
  if (!s) return "TODO";
  if (s.startsWith('"') && s.endsWith('"')) return s;
  return `"${s}"`;
}
