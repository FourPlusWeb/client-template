import { describe, expect, it } from "vitest";
import {
  parsePositioning,
  renderPositioning,
  positioningDefaults,
} from "../positioning";

const VINR_POSITIONING = `## 2. Positioning

### Category claim

_What category does the brand own? What mental territory?_

| Competitor framing | Territory |
|---|---|
| Fast checkout | Speed |
| Low fees | Cost |
| **Our framing** | **Payments. Limitless.** |

### The moat

Global acquiring infrastructure with direct bank connections across 30+ countries eliminates intermediary risk and reduces failed transactions.

### The trust equation

_Three to five structural pillars that build merchant or buyer trust._

\`\`\`
Reliability + Completeness + Speed = Trust
\`\`\`

- **Global reach.** 30+ countries, direct bank connections in each.
- **Uptime SLA.** 99.99% uptime backed by financial SLA.
- **Speed.** Sub-200ms processing at p99.

### The value architecture

_Functional, emotional, transformational benefits. Moves the buyer from commodity mindset to partner mindset._

| Tier | Question | Our answer |
|---|---|---|
| Functional | What it is | Unified payment infrastructure connecting 30+ acquirers |
| Emotional | How it feels | Limitless — no transaction caps, no hidden fees |
| Transformational | What you become | A payments platform that scales with ambition |

### Structural comparison matrix

_Capability-by-capability grid against competitors or alternatives. Show where we uniquely clear every bar._

| Capability | Us | Competitor A | Competitor B |
|---|---|---|---|
| Global coverage | ✅ | ✅ | ❌ |
| Direct bank connections | ✅ | ❌ | ❌ |`;

describe("positioning", () => {
  it("parses VINR BRAND.md content", () => {
    const data = parsePositioning(VINR_POSITIONING);
    expect(data.categoryClaim.competitors).toHaveLength(2);
    expect(data.categoryClaim.ourFraming).toBe("Our framing");
    expect(data.categoryClaim.ourTerritory).toBe("Payments. Limitless.");
    expect(data.categoryClaim.competitors[0].framing).toBe("Fast checkout");
    expect(data.moat).toContain("Global acquiring infrastructure");
    expect(data.trustEquation.formula).toBe("Reliability + Completeness + Speed = Trust");
    expect(data.trustEquation.pillars).toHaveLength(3);
    expect(data.valueArchitecture).toHaveLength(3);
    expect(data.valueArchitecture[0].tier).toBe("Functional");
    expect(data.comparisonMatrix.columns).toEqual(["Us", "Competitor A", "Competitor B"]);
    expect(data.comparisonMatrix.rows[0].capability).toBe("Global coverage");
  });

  it("render → parse is stable", () => {
    const initial = parsePositioning(VINR_POSITIONING);
    const rendered = renderPositioning(initial);
    const again = parsePositioning(rendered);
    expect(again).toEqual(initial);
    expect(renderPositioning(again)).toBe(rendered);
  });

  it("renders canonical header without trailing separator", () => {
    const out = renderPositioning(positioningDefaults);
    expect(out.startsWith("## 2. Positioning")).toBe(true);
    expect(out).not.toContain("\n---\n");
  });

  it("tolerates empty section and returns defaults", () => {
    const data = parsePositioning("");
    expect(data.categoryClaim.competitors).toHaveLength(1);
    expect(data.valueArchitecture).toHaveLength(3);
    expect(data.comparisonMatrix.columns).toEqual(["Us", "Competitor A", "Competitor B"]);
  });

  it("round-trips real VINR content", () => {
    const parsed = parsePositioning(VINR_POSITIONING);
    const rendered = renderPositioning(parsed);
    const reparsed = parsePositioning(rendered);
    expect(reparsed).toEqual(parsed);
  });
});