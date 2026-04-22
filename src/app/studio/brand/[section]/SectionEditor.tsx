"use client";

import { useState } from "react";
import { useSectionSave, DiffModal } from "../_hooks/useSectionSave";
import type { SectionSlug } from "../../../../lib/brand-md";

export function SectionEditor({
  slug,
  initial,
}: {
  slug: SectionSlug;
  initial: string;
}) {
  const [body, setBody] = useState(initial);
  const { save, status, diffOpen, currentContent, pendingData, closeDiff, confirmSave } =
    useSectionSave<string>(slug, (s) => s, initial);

  const handleSave = () => {
    save(body);
  };

  return (
    <div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="h-[60vh] w-full resize-y rounded border border-neutral-300 bg-white px-4 py-3 font-mono text-[13px] leading-relaxed text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none"
        spellCheck={false}
      />
      <div className="mt-4 flex items-center gap-3">
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
          <span className="font-mono text-[11px] uppercase tracking-wider text-red-700">
            {status.msg}
          </span>
        )}
      </div>
      <p className="mt-6 text-xs text-neutral-500">
        v1 edits raw Markdown for this section. Per-field forms (color
        pickers, persona rows, etc.) land in later batches.
      </p>
      {diffOpen && (
        <DiffModal
          current={currentContent}
          next={pendingData!}
          onConfirm={confirmSave}
          onCancel={closeDiff}
        />
      )}
    </div>
  );
}