import { describe, expect, it } from "vitest";
import { EMPTY_VISUAL, parseVisual, renderVisual } from "../visual";

describe("visual", () => {
  it("render → parse round-trips stable for filled data", () => {
    const data = {
      ...EMPTY_VISUAL,
      colors: {
        primary: "#4F46E5",
        primaryLight: "#818CF8",
        primaryDark: "#3730A3",
        accent: "#F59E0B",
        surface: "#FFFFFF",
        surfaceAlt: "#F8FAFC",
        text: "#0F172A",
        textMuted: "#52606F",
        border: "#CBD5E1",
      },
      extendedRamps: "Some free-form note.\nLine two.",
      typography: { licensedTarget: "GT Walsheim", sans: "Inter Variable", display: "Plus Jakarta Sans", mono: "JetBrains Mono" },
      radii: { sm: "4px", md: "8px", lg: "16px", full: "9999px" },
      motion: { durations: "fast 120ms, base 200ms", easings: "standard cubic-bezier(0.2,0,0,1)" },
    };
    const md = renderVisual(data);
    const parsed = parseVisual(md);
    expect(parsed.colors).toEqual(data.colors);
    expect(parsed.typography.sans).toBe(data.typography.sans);
    expect(parsed.typography.display).toBe(data.typography.display);
    expect(parsed.typography.mono).toBe(data.typography.mono);
    expect(parsed.typography.licensedTarget).toBe(data.typography.licensedTarget);
    expect(parsed.radii).toEqual(data.radii);
    expect(parsed.motion.durations).toBe(data.motion.durations);
    expect(parsed.motion.easings).toBe(data.motion.easings);
    expect(parsed.extendedRamps).toMatch(/free-form note/);
  });

  it("renders header and color table", () => {
    const md = renderVisual(EMPTY_VISUAL);
    expect(md.startsWith("## 9. Visual system")).toBe(true);
    expect(md).toMatch(/\| primary \|/);
    expect(md).toMatch(/### Extended ramps/);
  });

  it("second render is idempotent", () => {
    const once = renderVisual(EMPTY_VISUAL);
    const twice = renderVisual(parseVisual(once));
    const a = parseVisual(once);
    const b = parseVisual(twice);
    expect(a.colors).toEqual(b.colors);
    expect(a.radii).toEqual(b.radii);
  });
});
