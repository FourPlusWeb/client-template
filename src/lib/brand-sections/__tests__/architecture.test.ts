import { describe, expect, it } from "vitest";
import {
  parseArchitecture,
  renderArchitecture,
  EMPTY_ARCHITECTURE,
} from "../architecture";

const VINR_ARCHITECTURE = `## 10. Site architecture (initial)

### Primary nav (recommended)

- [Home](/)
- [About](/about)
- [Services](/services)
- [Contact](/contact)

### Pages to build

- Home
- About
- Services
- Contact

### Archetype and variation (from playbook)

- **Archetype.** A3 (see \`studio-factory/playbook/archetypes.md\`)
- **Variation.** P2 (see \`studio-factory/playbook/variations.md\`)`;

describe("architecture", () => {
  it("parses VINR BRAND.md content", () => {
    const data = parseArchitecture(VINR_ARCHITECTURE);
    expect(data.nav).toHaveLength(4);
    expect(data.nav[0]).toEqual({ label: "Home", href: "/" });
    expect(data.nav[3]).toEqual({ label: "Contact", href: "/contact" });
    expect(data.pages).toEqual(["Home", "About", "Services", "Contact"]);
    expect(data.archetype).toBe("A3");
    expect(data.variation).toBe("P2");
  });

  it("render → parse is stable", () => {
    const initial = parseArchitecture(VINR_ARCHITECTURE);
    const rendered = renderArchitecture(initial);
    const again = parseArchitecture(rendered);
    expect(again).toEqual(initial);
    expect(renderArchitecture(again)).toBe(rendered);
  });

  it("renders canonical header without trailing separator", () => {
    const out = renderArchitecture(EMPTY_ARCHITECTURE);
    expect(out.startsWith("## 10. Site architecture")).toBe(true);
    expect(out).not.toContain("\n---\n");
  });

  it("tolerates empty section and returns empty arrays", () => {
    const data = parseArchitecture("");
    expect(data.nav).toEqual([]);
    expect(data.pages).toEqual([]);
    expect(data.archetype).toBeUndefined();
    expect(data.variation).toBeUndefined();
  });

  it("round-trips real VINR content", () => {
    const parsed = parseArchitecture(VINR_ARCHITECTURE);
    const rendered = renderArchitecture(parsed);
    const reparsed = parseArchitecture(rendered);
    expect(reparsed).toEqual(parsed);
  });
});