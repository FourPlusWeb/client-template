import { z } from "zod";

export const localeSchema = z.enum(["bg", "en", "other"]);

export const identitySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  tagline: z.string().trim().min(1, "Tagline is required"),
  oneLine: z.string().trim().min(1, "One-line promise is required"),
  locale: localeSchema,
  market: z.string().trim(),
});

export type IdentityData = z.infer<typeof identitySchema>;

export const identityDefaults: IdentityData = {
  name: "",
  tagline: "",
  oneLine: "",
  locale: "bg",
  market: "",
};

function extractField(raw: string, prefix: string): string {
  const re = new RegExp(
    `^-\\s*\\*\\*${escapeRegex(prefix)}[^*]*\\*\\*\\s*(.*)$`,
    "m",
  );
  const m = raw.match(re);
  return m ? m[1].trim() : "";
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isTodo(v: string): boolean {
  return !v || /^TODO\b/i.test(v);
}

export function parseIdentity(raw: string): IdentityData {
  const name = extractField(raw, "Name");
  const tagline = extractField(raw, "Tagline");
  const oneLine = extractField(raw, "One-line");
  const localeRaw = extractField(raw, "Locale");
  const market = extractField(raw, "Market");

  let locale: IdentityData["locale"] = "bg";
  if (!isTodo(localeRaw)) {
    if (/\ben\b/i.test(localeRaw) && !/\bbg\b/i.test(localeRaw)) locale = "en";
    else if (/\bbg\b/i.test(localeRaw)) locale = "bg";
    else if (/^(bg|en|other)\s*\/\s*(bg|en|other)/i.test(localeRaw))
      locale = "bg";
    else locale = "other";
  }

  return {
    name: isTodo(name) ? "" : name,
    tagline: isTodo(tagline) ? "" : tagline,
    oneLine: isTodo(oneLine) ? "" : oneLine,
    locale,
    market: isTodo(market) ? "" : market,
  };
}

export function renderIdentity(data: IdentityData): string {
  const v = (s: string) => (s.trim() ? s.trim() : "TODO");
  return [
    "## 1. Identity",
    "",
    `- **Name.** ${v(data.name)}`,
    `- **Tagline (category claim).** ${v(data.tagline)}`,
    `- **One-line (Level 2 promise, 10-15 words).** ${v(data.oneLine)}`,
    `- **Locale.** ${data.locale}`,
    `- **Market.** ${v(data.market)}`,
  ].join("\n");
}
