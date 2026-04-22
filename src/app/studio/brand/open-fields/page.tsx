import { readBrand, sectionBySlug } from "../../../../lib/brand-md";
import { EMPTY_OPEN_FIELDS, parseOpenFields } from "../../../../lib/brand-sections/open-fields";
import { OpenFieldsEditor } from "./OpenFieldsEditor";

export const dynamic = "force-dynamic";

export default async function OpenFieldsPage() {
  const meta = sectionBySlug("open-fields")!;
  let data = EMPTY_OPEN_FIELDS;
  try {
    const parsed = await readBrand();
    const body = parsed.sections["open-fields"];
    if (body) data = parseOpenFields(body);
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
      <OpenFieldsEditor initial={data} />
    </div>
  );
}
