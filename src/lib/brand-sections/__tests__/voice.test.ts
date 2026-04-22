import { describe, expect, it } from "vitest";
import {
  parseVoice,
  renderVoice,
  voiceDefaults,
} from "../voice";

const VINR_VOICE = `## 3. Voice guardrails (hard rules)

### Banned words or phrases

_Phrases that signal the wrong category, trigger compliance risk, or off-brand tone._

- Payment processor
- Gateway
- Middleman

### Banned punctuation or formatting

_Em dash ban, capitalization rules, signature patterns._

- Em dashes (—)
- ALL CAPS headings
- Multiple exclamation marks

### Signature rule

- Pattern: \`Payments. Limitless.\`
- Examples: \`Payments. Limitless.\`

### Competitor rule

Never mention competitors by name. Position us as the natural choice without reference.

### Outcome vs. mechanism

Lead with what the buyer gets (outcome), not how we deliver it (mechanism).

### Content hierarchy

| Level | Length | Purpose |
|---|---|---|
| 1. Hook | 3 to 5 words | Stops the scroll |
| 2. Promise | 10 to 15 words | Makes it concrete |
| 3. Proof | 25 to 35 words | Closes with structural evidence |

### Personality (constant) and tone (flexes)

Personality: Direct, Confident, Human

| Audience | Tone | Proof type |
|---|---|---|
| SMB | Approachable | Case studies |
| Enterprise | Formal | Analyst reports |

### Internal test

Does this line pass the "Payments. Limitless." test?`;

describe("voice", () => {
  it("parses VINR BRAND.md content", () => {
    const data = parseVoice(VINR_VOICE);
    expect(data.bannedWords).toContain("Payment processor");
    expect(data.bannedFormatting).toContain("Em dashes (—)");
    expect(data.signatureRule.pattern).toBe("Payments. Limitless.");
    expect(data.signatureRule.examples).toContain("`Payments. Limitless.`");
    expect(data.competitorRule).toContain("Never mention competitors");
    expect(data.hierarchy).toHaveLength(3);
    expect(data.hierarchy[0].level).toBe("1. Hook");
    expect(data.personality).toBe("Direct, Confident, Human");
    expect(data.toneMatrix).toHaveLength(2);
    expect(data.internalTest).toContain("Payments. Limitless.");
  });

  it("render → parse is stable", () => {
    const initial = parseVoice(VINR_VOICE);
    const rendered = renderVoice(initial);
    const again = parseVoice(rendered);
    expect(again).toEqual(initial);
    expect(renderVoice(again)).toBe(rendered);
  });

  it("renders canonical header without trailing separator", () => {
    const out = renderVoice(voiceDefaults);
    expect(out.startsWith("## 3. Voice guardrails")).toBe(true);
    expect(out).not.toContain("\n---\n");
  });

  it("tolerates empty section and returns defaults", () => {
    const data = parseVoice("");
    expect(data.bannedWords).toEqual([]);
    expect(data.hierarchy).toHaveLength(3);
    expect(data.toneMatrix).toEqual([]);
  });

  it("round-trips real VINR content", () => {
    const parsed = parseVoice(VINR_VOICE);
    const rendered = renderVoice(parsed);
    const reparsed = parseVoice(rendered);
    expect(reparsed).toEqual(parsed);
  });
});