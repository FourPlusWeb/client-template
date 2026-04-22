"use client";

import { useState } from "react";
import { useSectionSave, DiffModal } from "../_hooks/useSectionSave";
import {
  OPEN_FIELD_STATUS,
  renderOpenFields,
  type OpenFieldStatus,
  type OpenFieldsData,
} from "../../../../lib/brand-sections/open-fields";

export function OpenFieldsEditor({ initial }: { initial: OpenFieldsData }) {
  const [items, setItems] = useState(initial.items);
  const { save, status, diffOpen, currentContent, pendingData, closeDiff, confirmSave } =
    useSectionSave<OpenFieldsData>("open-fields", (d) => renderOpenFields(d), renderOpenFields(initial));

  const patch = (i: number, next: { label?: string; status?: OpenFieldStatus; note?: string }) => {
    setItems(items.map((item, idx) => (idx === i ? { ...item, ...next } : item)));
  };
  const add = () => setItems([...items, { label: "", status: "todo" }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const handleSave = () => {
    save({ items });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-[2rem_1fr_6rem_1fr_auto] items-center gap-2 rounded border border-neutral-200 bg-white px-2 py-2"
          >
            <input
              type="checkbox"
              checked={item.status === "done"}
              onChange={(e) => patch(i, { status: e.target.checked ? "done" : "todo" })}
              aria-label={`${item.label} done`}
              className="h-4 w-4"
            />
            <input
              type="text"
              value={item.label}
              onChange={(e) => patch(i, { label: e.target.value })}
              placeholder="Label"
              className="rounded border border-neutral-300 px-2 py-1 text-sm"
            />
            <select
              value={item.status}
              onChange={(e) => patch(i, { status: e.target.value as OpenFieldStatus })}
              className="rounded border border-neutral-300 px-1 py-1 font-mono text-xs"
            >
              {OPEN_FIELD_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={item.note ?? ""}
              onChange={(e) => patch(i, { note: e.target.value })}
              placeholder="Note (optional)"
              className="rounded border border-neutral-300 px-2 py-1 text-xs"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="rounded border border-neutral-300 px-2 py-1 text-xs text-red-700"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-neutral-300 px-3 py-1 text-xs"
        >
          + Add item
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-4">
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
            Saved. Backup at BRAND.md.bak
          </span>
        )}
        {status.kind === "err" && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-red-700">{status.msg}</span>
        )}
      </div>

      {diffOpen && (
        <DiffModal
          current={currentContent}
          next={renderOpenFields(pendingData!)}
          onConfirm={confirmSave}
          onCancel={closeDiff}
        />
      )}
    </div>
  );
}