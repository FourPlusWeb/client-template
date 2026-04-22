import { readBrand, sectionBySlug } from "../../../../lib/brand-md";
import { parsePositioning, positioningDefaults } from "../../../../lib/brand-sections/positioning";
import { PositioningEditor } from "./PositioningEditor";

export const dynamic = "force-dynamic";

export default async function PositioningPage() {
  const meta = sectionBySlug("positioning")!;
  let data = positioningDefaults;
  try {
    const parsed = await readBrand();
    const body = parsed.sections.positioning;
    if (body) data = parsePositioning(body);
  } catch {
    // BRAND.md missing — editor starts with defaults.
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          Section {String(meta.number).padStart(2, "0")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
      </header>
      <PositioningEditor initial={data} />
    </div>
  );
}