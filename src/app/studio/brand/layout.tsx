"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = [
  { slug: "identity", number: 1, title: "Identity" },
  { slug: "positioning", number: 2, title: "Positioning" },
  { slug: "voice", number: 3, title: "Voice guardrails" },
  { slug: "personas", number: 4, title: "Personas and ICPs" },
  { slug: "narratives", number: 5, title: "Narratives" },
  { slug: "competitive", number: 6, title: "Competitive positioning" },
  { slug: "sales", number: 7, title: "Sales plays" },
  { slug: "verticals", number: 8, title: "Vertical overlays" },
  { slug: "visual", number: 9, title: "Visual system" },
  { slug: "architecture", number: 10, title: "Site architecture" },
  { slug: "open-fields", number: 11, title: "Open fields" },
];

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dryRun, setDryRun] = useState(false);

  useEffect(() => {
    setDryRun(localStorage.getItem("brand-dry-run") === "1");
  }, []);

  const toggleDryRun = () => {
    const next = !dryRun;
    setDryRun(next);
    localStorage.setItem("brand-dry-run", next ? "1" : "0");
  };

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
      <div className="relative overflow-auto p-10">
        <div className="absolute right-10 top-10 z-10">
          <button
            type="button"
            onClick={toggleDryRun}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              dryRun
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-neutral-300 bg-white text-neutral-500 hover:border-neutral-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${dryRun ? "bg-amber-500" : "bg-neutral-300"}`}
            />
            Dry run
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}