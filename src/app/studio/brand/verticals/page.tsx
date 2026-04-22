import { readBrand, sectionBySlug } from "../../../../lib/brand-md";
import { parseVerticals, verticalsDefaults } from "../../../../lib/brand-sections/verticals";
import { VerticalsEditor } from "./VerticalsEditor";

export const dynamic = "force-dynamic";

export default async function VerticalsPage() {
  const meta = sectionBySlug("verticals")!;
  let data = verticalsDefaults;
  try {
    const parsed = await readBrand();
    const body = parsed.sections.verticals;
    if (body) data = parseVerticals(body);
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
      <VerticalsEditor initial={data} />
    </div>
  );
}
