import { readBrand, sectionBySlug } from "../../../../lib/brand-md";
import { EMPTY_ARCHITECTURE, parseArchitecture } from "../../../../lib/brand-sections/architecture";
import { ArchitectureEditor } from "./ArchitectureEditor";

export const dynamic = "force-dynamic";

export default async function ArchitecturePage() {
  const meta = sectionBySlug("architecture")!;
  let data = EMPTY_ARCHITECTURE;
  try {
    const parsed = await readBrand();
    const body = parsed.sections.architecture;
    if (body) data = parseArchitecture(body);
  } catch {
    // BRAND.md missing — template defaults.
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          Section {String(meta.number).padStart(2, "0")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
      </header>
      <ArchitectureEditor initial={data} />
    </div>
  );
}
