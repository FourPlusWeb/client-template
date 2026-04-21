import Link from "next/link";
import { readBrand, SECTIONS } from "../../../lib/brand-md";

export const dynamic = "force-dynamic";

export default async function BrandIndex() {
  let filled: Record<string, boolean> = {};
  try {
    const parsed = await readBrand();
    filled = Object.fromEntries(
      SECTIONS.map((s) => [
        s.slug,
        // Treat a section as "filled" if it has any non-TODO body beyond the header.
        hasContent(parsed.sections[s.slug]),
      ]),
    );
  } catch {
    // BRAND.md missing — all sections empty.
  }

  const total = SECTIONS.length;
  const done = Object.values(filled).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-10">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          Brand Profile
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">
          Edit this site&apos;s brand
        </h1>
        <p className="text-neutral-600">
          Each section below maps to a block in <code>BRAND.md</code>. Saves
          overwrite the file with a <code>.bak</code> alongside. This page is
          dev-only and blocked in production by middleware.
        </p>
        <p className="mt-4 text-sm text-neutral-500">
          {done} / {total} sections have content.
        </p>
      </header>

      <ol className="divide-y divide-neutral-200 rounded border border-neutral-200 bg-white">
        {SECTIONS.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/studio/brand/${s.slug}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-neutral-400">
                  {String(s.number).padStart(2, "0")}
                </span>
                <span className="font-medium text-neutral-900">{s.title}</span>
              </div>
              <span
                className={
                  "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider " +
                  (filled[s.slug]
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-neutral-100 text-neutral-500")
                }
              >
                {filled[s.slug] ? "filled" : "empty"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function hasContent(block: string): boolean {
  if (!block) return false;
  const withoutHeader = block.replace(/^##\s+\d+\.\s+.+\s*/m, "").trim();
  if (!withoutHeader) return false;
  // Template placeholder: if every non-blank line is just "TODO" or a header,
  // treat as empty.
  const lines = withoutHeader.split(/\r?\n/).filter((l) => l.trim());
  const nonBoilerplate = lines.filter(
    (l) => !/^TODO\b/i.test(l.trim()) && !/^[#*_\-|]+$/.test(l.trim()),
  );
  return nonBoilerplate.length > 0;
}
