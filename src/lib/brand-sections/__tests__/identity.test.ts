import { describe, expect, it } from "vitest";
import {
  parseIdentity,
  renderIdentity,
  identityDefaults,
} from "../identity";

const VINR_IDENTITY = `## 1. Identity

- **Name.** VINR
- **Tagline (category claim).** Payments. Limitless.
- **One-line (Level 2 promise, 10-15 words).** The payments platform built for ambitious businesses ready to scale without limits.
- **Locale.** bg
- **Market.** EU digital commerce market`;

describe("identity", () => {
  it("parses VINR BRAND.md content", () => {
    const data = parseIdentity(VINR_IDENTITY);
    expect(data.name).toBe("VINR");
    expect(data.tagline).toBe("Payments. Limitless.");
    expect(data.oneLine).toBe(
      "The payments platform built for ambitious businesses ready to scale without limits.",
    );
    expect(data.locale).toBe("bg");
    expect(data.market).toBe("EU digital commerce market");
  });

  it("render → parse is stable", () => {
    const initial = parseIdentity(VINR_IDENTITY);
    const rendered = renderIdentity(initial);
    const again = parseIdentity(rendered);
    expect(again).toEqual(initial);
    expect(renderIdentity(again)).toBe(rendered);
  });

  it("renders canonical header without trailing separator", () => {
    const out = renderIdentity(identityDefaults);
    expect(out.startsWith("## 1. Identity")).toBe(true);
    expect(out).not.toContain("\n---\n");
  });

  it("tolerates missing fields and returns defaults", () => {
    const data = parseIdentity("");
    expect(data.name).toBe("");
    expect(data.locale).toBe("bg");
  });

  it("tolerates TODO placeholders", () => {
    const data = parseIdentity(`## 1. Identity

- **Name.** TODO
- **Tagline (category claim).** TODO
- **One-line (Level 2 promise, 10-15 words).** TODO
- **Locale.** bg
- **Market.** TODO`);
    expect(data.name).toBe("");
    expect(data.tagline).toBe("");
    expect(data.oneLine).toBe("");
    expect(data.market).toBe("");
    expect(data.locale).toBe("bg");
  });
});