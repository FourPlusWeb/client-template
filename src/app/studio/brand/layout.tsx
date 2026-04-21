import Link from "next/link";
import { SECTIONS } from "../../../lib/brand-md";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr]">
      <aside className="border-r border-neutral-200 bg-white p-6">
        <Link
          href="/studio/brand"
          className="mb-6 block font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900"
        >
          Studio / Brand
        </Link>
        <nav>
          <ol className="space-y-0.5">
            {SECTIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/studio/brand/${s.slug}`}
                  className="flex items-baseline gap-2 rounded px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <span className="font-mono text-[10px] text-neutral-400">
                    {String(s.number).padStart(2, "0")}
                  </span>
                  <span>{s.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <main className="overflow-auto p-10">{children}</main>
    </div>
  );
}
