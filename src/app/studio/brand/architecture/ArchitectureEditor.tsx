"use client";

import { useState } from "react";
import { useSectionSave, DiffModal, type SaveStatus } from "../_hooks/useSectionSave";
import {
  ARCHETYPES,
  COMMON_PAGES,
  VARIATIONS,
  renderArchitecture,
  type ArchitectureData,
  type ArchetypeId,
  type NavItem,
  type VariationId,
} from "../../../../lib/brand-sections/architecture";

type Status = SaveStatus;

export function ArchitectureEditor({ initial }: { initial: ArchitectureData }) {
  const [data, setData] = useState<ArchitectureData>(initial);
  const [customPage, setCustomPage] = useState("");
  const [updateConfig, setUpdateConfig] = useState(false);
  const { save, status, diffOpen, currentContent, newContent, closeDiff, confirmSave } =
    useSectionSave("architecture", renderArchitecture, renderArchitecture(initial));

  const setNav = (next: NavItem[]) => setData((d) => ({ ...d, nav: next }));
  const updateNavItem = (i: number, patch: Partial<NavItem>) => {
    setNav(data.nav.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  };
  const moveNav = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.nav.length) return;
    const next = [...data.nav];
    [next[i], next[j]] = [next[j], next[i]];
    setNav(next);
  };
  const addNav = () => setNav([...data.nav, { label: "", href: "" }]);
  const removeNav = (i: number) => setNav(data.nav.filter((_, idx) => idx !== i));

  const togglePage = (page: string) => {
    setData((d) => ({
      ...d,
      pages: d.pages.includes(page) ? d.pages.filter((p) => p !== page) : [...d.pages, page],
    }));
  };
  const addCustomPage = () => {
    const p = customPage.trim();
    if (!p || data.pages.includes(p)) return;
    setData((d) => ({ ...d, pages: [...d.pages, p] }));
    setCustomPage("");
  };

  const handleSave = () => {
    save(data);
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Primary nav</h2>
        <div className="space-y-2">
          {data.nav.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-2">
              <input
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateNavItem(i, { label: e.target.value })}
                className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm"
              />
              <input
                type="text"
                placeholder="/href"
                value={item.href}
                onChange={(e) => updateNavItem(i, { href: e.target.value })}
                className="rounded border border-neutral-300 bg-white px-2 py-1 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => moveNav(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveNav(i, 1)}
                disabled={i === data.nav.length - 1}
                aria-label="Move down"
                className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeNav(i)}
                aria-label="Remove"
                className="rounded border border-neutral-300 px-2 py-1 text-xs text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addNav}
            className="rounded-full border border-neutral-300 px-3 py-1 text-xs"
          >
            + Add nav item
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Pages to build</h2>
        <div className="flex flex-wrap gap-2">
          {[...new Set([...COMMON_PAGES, ...data.pages])].map((page) => {
            const active = data.pages.includes(page);
            return (
              <button
                key={page}
                type="button"
                onClick={() => togglePage(page)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={customPage}
            onChange={(e) => setCustomPage(e.target.value)}
            placeholder="Custom page name"
            className="flex-1 rounded border border-neutral-300 bg-white px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={addCustomPage}
            className="rounded-full border border-neutral-300 px-3 py-1 text-xs"
          >
            + Add custom
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-neutral-600">Archetype</span>
          <select
            value={data.archetype ?? ""}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                archetype: (e.target.value || undefined) as ArchetypeId | undefined,
              }))
            }
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm"
          >
            <option value="">— Unset —</option>
            {ARCHETYPES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-neutral-600">Variation</span>
          <select
            value={data.variation ?? ""}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                variation: (e.target.value || undefined) as VariationId | undefined,
              }))
            }
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-sm"
          >
            <option value="">— Unset —</option>
            {VARIATIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-200 pt-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={updateConfig}
            onChange={(e) => setUpdateConfig(e.target.checked)}
            className="h-4 w-4"
          />
          Also update <code className="font-mono text-xs">site.config.ts</code>
        </label>
        <button
          type="button"
          onClick={handleSave}
          disabled={status.kind === "saving"}
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {status.kind === "saving" ? "Saving..." : "Save section"}
        </button>
        {status.kind === "ok" && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700">
            Saved.{" "}
            {updateConfig
              ? "BRAND.md + site.config.ts (backups: .bak)"
              : "BRAND.md.bak"}
          </span>
        )}
        {status.kind === "err" && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-red-700">{status.msg}</span>
        )}
      </div>

      {diffOpen && (
        <DiffModal
          current={currentContent}
          next={newContent}
          onConfirm={() => confirmSave({ updateSiteConfig: updateConfig })}
          onCancel={closeDiff}
        />
      )}
    </div>
  );
}