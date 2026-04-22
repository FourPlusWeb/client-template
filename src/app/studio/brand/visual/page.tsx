import { readBrand, sectionBySlug } from "../../../../lib/brand-md";
import { EMPTY_VISUAL, parseVisual } from "../../../../lib/brand-sections/visual";
import { VisualEditor } from "./VisualEditor";

export const dynamic = "force-dynamic";

export default async function VisualPage() {
  const meta = sectionBySlug("visual")!;
  let data = EMPTY_VISUAL;
  try {
    const parsed = await readBrand();
    const body = parsed.sections.visual;
    if (body) data = parseVisual(body);
  } catch {
    // BRAND.md missing — start from template defaults.
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          Section {String(meta.number).padStart(2, "0")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
      </header>
      <VisualEditor initial={data} />
    </div>
  );
}
