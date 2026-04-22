"use client";

import { useState } from "react";
import { useSectionSave, DiffModal } from "../_hooks/useSectionSave";
import {
  COLOR_KEYS,
  renderVisual,
  type VisualColors,
  type VisualData,
} from "../../../../lib/brand-sections/visual";

function isValidHex(v: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v);
}

export function VisualEditor({ initial }: { initial: VisualData }) {
  const [data, setData] = useState<VisualData>(initial);
  const [updateConfig, setUpdateConfig] = useState(false);
  const { save, status, diffOpen, currentContent, newContent, closeDiff, confirmSave } =
    useSectionSave("visual", renderVisual, renderVisual(initial));

  const setColor = (key: keyof VisualColors, value: string) => {
    setData((d) => ({ ...d, colors: { ...d.colors, [key]: value } }));
  };

  const handleSave = () => {
    save(data);
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Colors</h2>
        <div className="space-y-2">
          {COLOR_KEYS.map((key) => {
            const value = data.colors[key];
            const valid = isValidHex(value);
            return (
              <div key={key} className="grid grid-cols-[8rem_3rem_auto_1fr] items-center gap-3">
                <label className="font-mono text-xs text-neutral-600" htmlFor={`color-${key}`}>
                  {key}
                </label>
                <input
                  type="color"
                  aria-label={`${key} color picker`}
                  value={valid ? value : "#000000"}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-neutral-300 bg-white p-0"
                />
                <input
                  id={`color-${key}`}
                  type="text"
                  value={value}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="w-28 rounded border border-neutral-300 bg-white px-2 py-1 font-mono text-xs"
                  spellCheck={false}
                />
                <div
                  className="h-8 w-full rounded border border-neutral-200"
                  style={{ backgroundColor: valid ? value : undefined }}
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Typography</h2>
        <div className="space-y-3">
          <LabeledText
            label="Licensed target (optional)"
            value={data.typography.licensedTarget ?? ""}
            onChange={(v) => setData((d) => ({ ...d, typography: { ...d.typography, licensedTarget: v } }))}
          />
          <LabeledText
            label="sans"
            value={data.typography.sans}
            onChange={(v) => setData((d) => ({ ...d, typography: { ...d.typography, sans: v } }))}
          />
          <LabeledText
            label="display"
            value={data.typography.display}
            onChange={(v) => setData((d) => ({ ...d, typography: { ...d.typography, display: v } }))}
          />
          <LabeledText
            label="mono (optional)"
            value={data.typography.mono ?? ""}
            onChange={(v) => setData((d) => ({ ...d, typography: { ...d.typography, mono: v } }))}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Radii</h2>
        <div className="grid grid-cols-2 gap-3">
          {(["sm", "md", "lg", "full"] as const).map((k) => (
            <LabeledText
              key={k}
              label={k}
              value={data.radii[k]}
              onChange={(v) => setData((d) => ({ ...d, radii: { ...d.radii, [k]: v } }))}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Motion</h2>
        <div className="space-y-3">
          <LabeledText
            label="durations"
            value={data.motion.durations}
            onChange={(v) => setData((d) => ({ ...d, motion: { ...d.motion, durations: v } }))}
          />
          <LabeledText
            label="easings"
            value={data.motion.easings}
            onChange={(v) => setData((d) => ({ ...d, motion: { ...d.motion, easings: v } }))}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Extended ramps</h2>
        <p className="mb-3 text-xs text-neutral-500">
          Free-form Markdown. Project-local color tokens beyond the core SiteConfig palette.
        </p>
        <textarea
          value={data.extendedRamps}
          onChange={(e) => setData((d) => ({ ...d, extendedRamps: e.target.value }))}
          className="h-40 w-full resize-y rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-xs"
          spellCheck={false}
        />
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

function LabeledText({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-40 font-mono text-xs text-neutral-600">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded border border-neutral-300 bg-white px-2 py-1 font-mono text-xs"
        spellCheck={false}
      />
    </label>
  );
}