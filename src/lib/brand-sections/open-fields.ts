import { z } from "zod";

export const OPEN_FIELD_STATUS = ["todo", "done", "na"] as const;
export type OpenFieldStatus = (typeof OPEN_FIELD_STATUS)[number];

export type OpenField = {
  label: string;
  status: OpenFieldStatus;
  note?: string;
};

export type OpenFieldsData = {
  items: OpenField[];
};

export const openFieldsSchema = z.object({
  items: z.array(
    z.object({
      label: z.string().min(1, "Label required"),
      status: z.enum(OPEN_FIELD_STATUS),
      note: z.string().optional(),
    }),
  ),
});

const DEFAULT_LABELS = [
  "URL (production domain)",
  "Contact email, phone, address",
  "Project lead / client contact",
  "Social handles",
  "Launch dates (soft, hard)",
  "Logo asset status",
  "Photography direction and asset status",
  "Case studies",
  "Font license status (if using licensed brand fonts)",
  "Sentry DSN",
  "GitHub repo confirmation",
  "Netlify site link",
];

export const EMPTY_OPEN_FIELDS: OpenFieldsData = {
  items: DEFAULT_LABELS.map((label) => ({ label, status: "todo" as OpenFieldStatus })),
};

const STATUS_PREFIX: Record<OpenFieldStatus, string> = {
  todo: "[ ]",
  done: "[x]",
  na: "[-]",
};

function parseStatus(prefix: string): OpenFieldStatus {
  const p = prefix.trim().toLowerCase();
  if (p === "x") return "done";
  if (p === "-" || p === "na") return "na";
  return "todo";
}

/**
 * Items are stored as checklist bullets:
 *   - [ ] Label — optional note
 *   - [x] Label
 *   - [-] Label (N/A)
 *
 * Plain `- Label` lines (legacy BRAND.md format) still parse as `todo`.
 */
export function parseOpenFields(markdown: string): OpenFieldsData {
  const items: OpenField[] = [];
  const bulletRe = /^\s*-\s+(?:\[([xX\s-])\]\s+)?(.+?)$/gm;
  let m: RegExpExecArray | null;
  while ((m = bulletRe.exec(markdown)) !== null) {
    const raw = m[2].trim();
    if (!raw) continue;
    const status = m[1] ? parseStatus(m[1]) : "todo";

    let label = raw;
    let note: string | undefined;
    const dashSplit = raw.split(/\s+—\s+/);
    if (dashSplit.length > 1) {
      label = dashSplit[0].trim();
      note = dashSplit.slice(1).join(" — ").trim();
    }
    items.push(note ? { label, status, note } : { label, status });
  }

  return { items };
}

export function renderOpenFields(data: OpenFieldsData): string {
  const lines: string[] = [];
  lines.push("## 11. Open fields (TBD, fill as data arrives)");
  lines.push("");
  if (data.items.length === 0) {
    lines.push("- [ ] TODO");
    return lines.join("\n");
  }
  for (const item of data.items) {
    const prefix = STATUS_PREFIX[item.status];
    const note = item.note?.trim();
    lines.push(note ? `- ${prefix} ${item.label} — ${note}` : `- ${prefix} ${item.label}`);
  }
  return lines.join("\n");
}
