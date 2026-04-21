import { notFound } from "next/navigation";
import { readBrand, sectionBySlug } from "../../../../lib/brand-md";
import { SectionEditor } from "./SectionEditor";

export const dynamic = "force-dynamic";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const meta = sectionBySlug(section);
  if (!meta) notFound();

  let body = "";
  try {
    const parsed = await readBrand();
    body = parsed.sections[meta.slug] ?? "";
  } catch {
    // BRAND.md missing — editor starts empty.
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          Section {String(meta.number).padStart(2, "0")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
      </header>
      <SectionEditor slug={meta.slug} initial={body} />
    </div>
  );
}
