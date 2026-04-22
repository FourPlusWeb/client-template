"use client";

import { useState } from "react";
import { useSectionSave, DiffModal } from "../_hooks/useSectionSave";
import {
  identitySchema,
  renderIdentity,
  type IdentityData,
} from "../../../../lib/brand-sections/identity";

const SLUG = "identity";
const LABEL = "block w-full text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1";
const INPUT =
  "block w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none";
const TEXTAREA = INPUT + " min-h-[80px] resize-y";
const ERR_TEXT = "mt-1 text-xs text-red-700";

export function IdentityEditor({ initial }: { initial: IdentityData }) {
  const [data, setData] = useState<IdentityData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof IdentityData, string>>>({});
  const { save, status, diffOpen, currentContent, newContent, closeDiff, confirmSave } =
    useSectionSave(SLUG, renderIdentity, renderIdentity(initial));

  const update = <K extends keyof IdentityData>(key: K, value: IdentityData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const result = identitySchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof IdentityData, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof IdentityData | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    save(result.data);
  };

  return (
    <div>
      <div className="space-y-5">
        <div>
          <label className={LABEL} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            className={INPUT}
          />
          {errors.name && <p className={ERR_TEXT}>{errors.name}</p>}
        </div>

        <div>
          <label className={LABEL} htmlFor="tagline">
            Tagline (category claim)
          </label>
          <input
            id="tagline"
            type="text"
            value={data.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className={INPUT}
          />
          {errors.tagline && <p className={ERR_TEXT}>{errors.tagline}</p>}
        </div>

        <div>
          <label className={LABEL} htmlFor="oneLine">
            One-line (Level 2 promise, 10-15 words)
          </label>
          <textarea
            id="oneLine"
            value={data.oneLine}
            onChange={(e) => update("oneLine", e.target.value)}
            className={TEXTAREA}
          />
          {errors.oneLine && <p className={ERR_TEXT}>{errors.oneLine}</p>}
        </div>

        <div>
          <label className={LABEL} htmlFor="locale">
            Locale
          </label>
          <select
            id="locale"
            value={data.locale}
            onChange={(e) =>
              update("locale", e.target.value as IdentityData["locale"])
            }
            className={INPUT}
          >
            <option value="bg">bg</option>
            <option value="en">en</option>
            <option value="other">other</option>
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="market">
            Market (optional)
          </label>
          <textarea
            id="market"
            value={data.market}
            onChange={(e) => update("market", e.target.value)}
            className={TEXTAREA}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
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