"use client";

import { useState } from "react";
import { useSectionSave, DiffModal, type SaveStatus } from "../_hooks/useSectionSave";
import {
  renderVerticals,
  verticalsSchema,
  type VerticalsData,
  type VerticalRow,
} from "../../../../lib/brand-sections/verticals";

type Status = SaveStatus;

const EMPTY_ROW: VerticalRow = { name: "", hook: "", signatureEmphasis: "" };

export function VerticalsEditor({ initial }: { initial: VerticalsData }) {
  const [data, setData] = useState<VerticalsData>(initial);
  const { save, status, diffOpen, currentContent, newContent, closeDiff, confirmSave } =
    useSectionSave("verticals", renderVerticals, renderVerticals(initial));

  const updateRow = (i: number, patch: Partial<VerticalRow>) => {
    setData((d) => ({
      ...d,
      verticals: d.verticals.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));
  };

  const addRow = () =>
    setData((d) => ({ ...d, verticals: [...d.verticals, { ...EMPTY_ROW }] }));
  const removeRow = (i: number) =>
    setData((d) => ({ ...d, verticals: d.verticals.filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    const parsed = verticalsSchema.safeParse(data);
    if (!parsed.success) {
      return;
    }
    save(parsed.data);
  };

  return (
    <div className="space-y-6">
      <Field label="Preamble">
        <textarea
          value={data.preamble}
          onChange={(e) => setData((d) => ({ ...d, preamble: e.target.value }))}
          rows={2}
          className={textInput}
        />
      </Field>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-neutral-600">
            Verticals
          </h2>
          <button type="button" onClick={addRow} className={ghostBtn}>
            + Add vertical
          </button>
        </div>
        <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                <th className={th}>Name</th>
                <th className={th}>Hook</th>
                <th className={th}>Signature emphasis</th>
                <th className={th}>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {data.verticals.map((r, i) => (
                <tr key={i} className="border-t border-neutral-200">
                  <td className={td}>
                    <input
                      value={r.name}
                      onChange={(e) => updateRow(i, { name: e.target.value })}
                      className={cellInput}
                    />
                  </td>
                  <td className={td}>
                    <input
                      value={r.hook}
                      onChange={(e) => updateRow(i, { hook: e.target.value })}
                      className={cellInput}
                    />
                  </td>
                  <td className={td}>
                    <input
                      value={r.signatureEmphasis}
                      onChange={(e) => updateRow(i, { signatureEmphasis: e.target.value })}
                      className={cellInput}
                    />
                  </td>
                  <td className={td}>
                    <button type="button" onClick={() => removeRow(i)} className={ghostBtn}>
                      remove
                    </button>
                  </td>
                </tr>
              ))}
              {data.verticals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-xs text-neutral-400">
                    No verticals yet. Add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SaveBar status={status} onSave={handleSave} />

      {diffOpen && (
        <DiffModal
          current={currentContent}
          next={newContent}
          onConfirm={confirmSave}
          onCancel={closeDiff}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-neutral-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function SaveBar({
  status,
  onSave,
}: {
  status: Status;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={status.kind === "saving"}
        className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {status.kind === "saving" ? "Saving..." : "Save section"}
      </button>
      {status.kind === "ok" && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700">
          Saved. Backup at BRAND.md.bak
        </span>
      )}
      {status.kind === "err" && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-red-700">
          {status.msg}
        </span>
      )}
    </div>
  );
}

const textInput =
  "w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-[13px] text-neutral-900 focus:border-neutral-900 focus:outline-none";
const cellInput =
  "w-full rounded border border-transparent bg-transparent px-2 py-1 font-mono text-[12px] text-neutral-900 hover:border-neutral-200 focus:border-neutral-900 focus:bg-white focus:outline-none";
const th = "px-3 py-2";
const td = "px-2 py-1 align-top";
const ghostBtn =
  "rounded border border-neutral-300 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:border-neutral-900 hover:text-neutral-900";