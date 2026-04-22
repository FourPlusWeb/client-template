import { describe, expect, it } from "vitest";
import {
  parseOpenFields,
  renderOpenFields,
  EMPTY_OPEN_FIELDS,
} from "../open-fields";

const VINR_OPEN_FIELDS = `## 11. Open fields (TBD, fill as data arrives)

- [x] URL (production domain) — https://vinr.io
- [ ] Contact email, phone, address
- [x] Project lead / client contact — Maria Georgieva, maria@fourplusweb.bg
- [-] Social handles — N/A until launch
- [ ] Launch dates (soft, hard)
- [ ] Logo asset status
- [x] Photography direction and asset status — Studio shoot scheduled
- [ ] Case studies
- [x] Sentry DSN — https://sentry.io/organizations/fourplusweb/issues/?project=12345678
- [x] GitHub repo confirmation — github.com/FourPlusWeb/vinr
- [x] Netlify site link — https://vinr.netlify.app`;

describe("open-fields", () => {
  it("parses VINR BRAND.md content", () => {
    const data = parseOpenFields(VINR_OPEN_FIELDS);
    expect(data.items).toHaveLength(11);
    const url = data.items.find((i) => i.label.includes("URL"));
    expect(url?.status).toBe("done");
    expect(url?.note).toBe("https://vinr.io");
    const sentry = data.items.find((i) => i.label.includes("Sentry"));
    expect(sentry?.status).toBe("done");
    const social = data.items.find((i) => i.label.includes("Social"));
    expect(social?.status).toBe("na");
  });

  it("render → parse is stable", () => {
    const initial = parseOpenFields(VINR_OPEN_FIELDS);
    const rendered = renderOpenFields(initial);
    const again = parseOpenFields(rendered);
    expect(again).toEqual(initial);
    expect(renderOpenFields(again)).toBe(rendered);
  });

  it("renders canonical header without trailing separator", () => {
    const out = renderOpenFields(EMPTY_OPEN_FIELDS);
    expect(out.startsWith("## 11. Open fields")).toBe(true);
    expect(out).not.toContain("\n---\n");
  });

  it("tolerates empty section and returns empty list", () => {
    const data = parseOpenFields("");
    expect(data.items).toEqual([]);
  });

  it("round-trips real VINR content", () => {
    const parsed = parseOpenFields(VINR_OPEN_FIELDS);
    const rendered = renderOpenFields(parsed);
    const reparsed = parseOpenFields(rendered);
    expect(reparsed).toEqual(parsed);
  });
});