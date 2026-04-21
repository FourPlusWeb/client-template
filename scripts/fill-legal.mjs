#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import * as p from "@clack/prompts";

const FILES = [
  "src/app/privacy-policy/page.mdx",
  "src/app/terms/page.mdx",
];

// Descriptions for common placeholders. Extend as templates evolve.
const DESCRIPTIONS = {
  COMPANY_NAME: "Legal name of the company (e.g., 'Акме ООД')",
  COMPANY_ADDRESS: "Registered address (street, city, postcode)",
  CONTACT_EMAIL: "Data-protection contact email (often hello@<domain>)",
  DOMAIN: "Primary domain without protocol (e.g., 'acme.bg')",
  ANALYTICS_PROVIDER: "Which analytics provider (Plausible / GA4 / Fathom / none)",
  RETENTION: "Analytics data retention period (e.g., '14 months' per provider default)",
  HOSTING: "Which host (Netlify / Vercel / Cloudflare / self-host)",
  DATE: "Today's date in YYYY-MM-DD",
};

async function main() {
  p.intro("📜 Fill privacy-policy + terms from client brief");

  const fileContents = await Promise.all(
    FILES.map(async (f) => ({ path: f, body: await readFile(f, "utf8") })),
  );

  const allPlaceholders = new Set();
  for (const { body } of fileContents) {
    for (const match of body.matchAll(/\{\{([A-Z_]+)\}\}/g)) {
      allPlaceholders.add(match[1]);
    }
  }

  if (allPlaceholders.size === 0) {
    p.log.info("No {{PLACEHOLDER}} markers found. Files already customized? Nothing to do.");
    return;
  }

  p.log.info(`Found ${allPlaceholders.size} placeholder(s): ${[...allPlaceholders].join(", ")}`);

  const values = {};
  for (const placeholder of allPlaceholders) {
    const description = DESCRIPTIONS[placeholder] ?? "Value for this placeholder";
    const defaultValue = placeholder === "DATE" ? new Date().toISOString().slice(0, 10) : undefined;
    const answer = await p.text({
      message: placeholder,
      placeholder: description,
      initialValue: defaultValue,
      validate: (v) => v.trim().length > 0 ? undefined : "Required (use 'не е приложимо' if truly N/A)",
    });
    if (p.isCancel(answer)) {
      p.cancel("Cancelled. Files not modified.");
      process.exit(0);
    }
    values[placeholder] = answer;
  }

  for (const file of fileContents) {
    let updated = file.body;
    for (const [placeholder, value] of Object.entries(values)) {
      updated = updated.replaceAll(`{{${placeholder}}}`, value);
    }
    await writeFile(file.path, updated, "utf8");
    p.log.success(`Updated ${file.path}`);
  }

  p.note(
    "Тези документи са STILL DRAFT — не publish-ирай преди:\n" +
    "  1. Legal counsel review (client's lawyer OR shared legal resource)\n" +
    "  2. Verify all facts (retention periods per actual providers, DPA links current)\n" +
    "  3. Update 'Последна актуализация' date if content changes post-review\n\n" +
    "Studio НЕ носи отговорност за legal adequacy of these templates.",
    "⚠️ Legal disclaimer",
  );

  p.outro("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
