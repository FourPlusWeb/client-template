import { describe, expect, it } from "vitest";
import {
  parseVerticals,
  renderVerticals,
  verticalsDefaults,
  type VerticalsData,
} from "../verticals";

const VINR_VERTICALS = `## 8. Vertical overlays

Specificity wins. Per-vertical hooks layered on top of the core message.

| Vertical | Hook | Signature emphasis |
|---|---|---|
| HoReCa | Automated tip distribution and peak-hour analytics. | Your restaurant. Limitless. |
| E-commerce | Improving approval rates through multi-acquirer failover. | Your checkout. Limitless. |
| Health | Managing recurring memberships and high-ticket treatments in one view. | Your practice. Limitless. |`;

describe("verticals", () => {
  it("parses VINR BRAND.md content", () => {
    const data = parseVerticals(VINR_VERTICALS);
    expect(data.verticals).toHaveLength(3);
    expect(data.verticals[0]).toEqual({
      name: "HoReCa",
      hook: "Automated tip distribution and peak-hour analytics.",
      signatureEmphasis: "Your restaurant. Limitless.",
    });
    expect(data.verticals[2].name).toBe("Health");
  });

  it("render → parse is stable", () => {
    const initial = parseVerticals(VINR_VERTICALS);
    const rendered = renderVerticals(initial);
    const again = parseVerticals(rendered);
    expect(again).toEqual(initial);
    expect(renderVerticals(again)).toBe(rendered);
  });

  it("renders canonical header with no trailing separator", () => {
    const out = renderVerticals(verticalsDefaults);
    expect(out.startsWith("## 8. Vertical overlays")).toBe(true);
    expect(out.endsWith("---")).toBe(false);
  });

  it("handles empty verticals list", () => {
    const data: VerticalsData = { preamble: "Intro.", verticals: [] };
    const rendered = renderVerticals(data);
    const parsed = parseVerticals(rendered);
    expect(parsed.verticals).toEqual([]);
    expect(parsed.preamble).toBe("Intro.");
  });
});
