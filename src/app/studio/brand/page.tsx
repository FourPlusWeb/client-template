import Link from "next/link";
import { readBrand, SECTIONS } from "../../../lib/brand-md";
import { ClearBackupsButton } from "./_components/ClearBackupsButton";

export const dynamic = "force-dynamic";

const STUDIO_ITEMS = [
  { href: "/studio/brand", label: "Brand", desc: "Edit brand sections" },
  { href: "/studio/config", label: "Config", desc: "Site settings, colors, fonts" },
  { href: "/studio/seo", label: "SEO", desc: "Meta tags per page" },
];

export default async function BrandIndex() {
  let filled: Record<string, boolean> = {};
  try {
    const parsed = await readBrand();
    filled = Object.fromEntries(
      SECTIONS.map((s) => [
        s.slug,
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
      <header className="mb-10 flex items-start justify-between">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            Studio
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight">
            Edit this site
          </h1>
          <p className="text-neutral-600">
            Full control over your site. Dev-only, blocked in production.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            {done} / {total} brand sections filled.
          </p>
        </div>
        <ClearBackupsButton />
      </header>

      <section className="mb-10 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium">Studio Tools</h2>
        <div className="grid gap-3">
          {STUDIO_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <div>
                <span className="font-medium text-neutral-900">{item.label}</span>
                <span className="ml-2 text-neutral-500">— {item.desc}</span>
              </div>
              <span className="text-neutral-400">→</span>
            </Link>
          ))}
        </div>
      </section>

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
  const lines = withoutHeader.split(/\r?\n/).filter((l) => l.trim());
  const nonBoilerplate = lines.filter(
    (l) => !/^TODO\b/i.test(l.trim()) && !/^[#*_\-|]+$/.test(l.trim()),
  );
  return nonBoilerplate.length > 0;
}