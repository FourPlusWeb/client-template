"use client";

import { useState } from "react";
import { useSectionSave, DiffModal, type SaveStatus } from "../_hooks/useSectionSave";
import {
  voiceSchema,
  renderVoice,
  type VoiceData,
  type HierarchyRow,
  type ToneRow,
} from "../../../../lib/brand-sections/voice";

type Status = SaveStatus;

const INPUT =
  "w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none";
const TEXTAREA = INPUT + " min-h-[60px] resize-y";
const CELL_INPUT =
  "w-full rounded border border-transparent bg-transparent px-2 py-1 font-mono text-xs text-neutral-900 hover:border-neutral-200 focus:border-neutral-900 focus:bg-white focus:outline-none";
const TH = "px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider text-neutral-500";
const TD = "px-2 py-1 align-top";
const GHOST_BTN =
  "rounded border border-neutral-300 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:border-neutral-900 hover:text-neutral-900";
const CHIP_BTN =
  "inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:bg-neutral-200";
const ERR_TEXT = "mt-1 text-xs text-red-700";

export function VoiceEditor({ initial }: { initial: VoiceData }) {
  const [data, setData] = useState<VoiceData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { save, status, diffOpen, currentContent, pendingData, closeDiff, confirmSave } =
    useSectionSave("voice", renderVoice, renderVoice(initial));

  const set = <K extends keyof VoiceData>(key: K, val: VoiceData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const addBannedWord = (v: string) => {
    if (!v.trim()) return;
    setData((d) => ({ ...d, bannedWords: [...d.bannedWords, v.trim()] }));
  };

  const removeBannedWord = (i: number) =>
    setData((d) => ({ ...d, bannedWords: d.bannedWords.filter((_, idx) => idx !== i) }));

  const addBannedFormatting = (v: string) => {
    if (!v.trim()) return;
    setData((d) => ({ ...d, bannedFormatting: [...d.bannedFormatting, v.trim()] }));
  };

  const removeBannedFormatting = (i: number) =>
    setData((d) => ({ ...d, bannedFormatting: d.bannedFormatting.filter((_, idx) => idx !== i) }));

  const addExample = (v: string) => {
    if (!v.trim()) return;
    setData((d) => ({
      ...d,
      signatureRule: { ...d.signatureRule, examples: [...d.signatureRule.examples, v.trim()] },
    }));
  };

  const removeExample = (i: number) =>
    setData((d) => ({
      ...d,
      signatureRule: { ...d.signatureRule, examples: d.signatureRule.examples.filter((_, idx) => idx !== i) },
    }));

  const updateHierarchy = (i: number, patch: Partial<HierarchyRow>) =>
    setData((d) => ({
      ...d,
      hierarchy: d.hierarchy.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));

  const updateToneRow = (i: number, patch: Partial<ToneRow>) =>
    setData((d) => ({
      ...d,
      toneMatrix: d.toneMatrix.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));

  const addToneRow = () =>
    setData((d) => ({
      ...d,
      toneMatrix: [...d.toneMatrix, { audience: "", tone: "", proof: "" }],
    }));

  const removeToneRow = (i: number) =>
    setData((d) => ({ ...d, toneMatrix: d.toneMatrix.filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    const result = voiceSchema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    save(result.data);
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Banned words or phrases
        </h2>
        <div className="mb-2 flex flex-wrap gap-2">
          {data.bannedWords.map((w, i) => (
            <span key={i} className={CHIP_BTN}>
              {w}
              <button type="button" onClick={() => removeBannedWord(i)} className="text-neutral-400 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
        <ChipInput onAdd={addBannedWord} placeholder="Add banned word or phrase" />
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Banned punctuation or formatting
        </h2>
        <div className="mb-2 flex flex-wrap gap-2">
          {data.bannedFormatting.map((w, i) => (
            <span key={i} className={CHIP_BTN}>
              {w}
              <button type="button" onClick={() => removeBannedFormatting(i)} className="text-neutral-400 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
        <ChipInput onAdd={addBannedFormatting} placeholder="Add banned formatting rule" />
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Signature rule
        </h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500" htmlFor="sig-pattern">Pattern (regex or literal)</label>
            <input
              id="sig-pattern"
              value={data.signatureRule.pattern}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  signatureRule: { ...d.signatureRule, pattern: e.target.value },
                }))
              }
              className={INPUT}
              placeholder="e.g. Payments. Limitless."
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500" htmlFor="sig-examples">Examples</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {data.signatureRule.examples.map((ex, i) => (
                <span key={i} className={CHIP_BTN}>
                  {ex}
                  <button type="button" onClick={() => removeExample(i)} className="text-neutral-400 hover:text-red-600">×</button>
                </span>
              ))}
            </div>
            <ChipInput onAdd={addExample} placeholder="Add example" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Competitor rule
        </h2>
        <textarea
          value={data.competitorRule}
          onChange={(e) => set("competitorRule", e.target.value)}
          rows={3}
          className={TEXTAREA}
          placeholder="How competitors are mentioned (or not) in customer-facing copy."
        />
        {errors.competitorRule && <p className={ERR_TEXT}>{errors.competitorRule}</p>}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Outcome vs. mechanism
        </h2>
        <textarea
          value={data.outcomeRule}
          onChange={(e) => set("outcomeRule", e.target.value)}
          rows={3}
          className={TEXTAREA}
          placeholder="Do we lead with what the buyer gets, or how we deliver it?"
        />
        {errors.outcomeRule && <p className={ERR_TEXT}>{errors.outcomeRule}</p>}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Content hierarchy
        </h2>
        <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50">
                <th className={TH}>Level</th>
                <th className={TH}>Length</th>
                <th className={TH}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {data.hierarchy.map((r, i) => (
                <tr key={i} className="border-t border-neutral-200">
                  <td className={TD}>
                    <input value={r.level} onChange={(e) => updateHierarchy(i, { level: e.target.value })} className={CELL_INPUT} />
                  </td>
                  <td className={TD}>
                    <input value={r.length} onChange={(e) => updateHierarchy(i, { length: e.target.value })} className={CELL_INPUT} />
                  </td>
                  <td className={TD}>
                    <input value={r.purpose} onChange={(e) => updateHierarchy(i, { purpose: e.target.value })} className={CELL_INPUT} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-1 font-mono text-[10px] text-neutral-400">
          Rows are fixed (Hook / Promise / Proof). Edit length and purpose inline.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Personality (constant)
        </h2>
        <input
          value={data.personality}
          onChange={(e) => set("personality", e.target.value)}
          className={INPUT}
          placeholder="e.g. Direct, Confident, Human"
        />
        <p className="mt-1 font-mono text-[10px] text-neutral-400">Comma-separated list of personality traits that are always on.</p>
        {errors.personality && <p className={ERR_TEXT}>{errors.personality}</p>}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Tone matrix
        </h2>
        <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50">
                <th className={TH}>Audience</th>
                <th className={TH}>Tone</th>
                <th className={TH}>Proof type</th>
                <th className={TH}>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {data.toneMatrix.map((r, i) => (
                <tr key={i} className="border-t border-neutral-200">
                  <td className={TD}>
                    <input value={r.audience} onChange={(e) => updateToneRow(i, { audience: e.target.value })} className={CELL_INPUT} placeholder="Audience" />
                  </td>
                  <td className={TD}>
                    <input value={r.tone} onChange={(e) => updateToneRow(i, { tone: e.target.value })} className={CELL_INPUT} placeholder="Tone" />
                  </td>
                  <td className={TD}>
                    <input value={r.proof} onChange={(e) => updateToneRow(i, { proof: e.target.value })} className={CELL_INPUT} placeholder="Proof type" />
                  </td>
                  <td className={TD}>
                    <button type="button" onClick={() => removeToneRow(i)} className={GHOST_BTN}>remove</button>
                  </td>
                </tr>
              ))}
              {data.toneMatrix.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center font-mono text-xs text-neutral-400">
                    No rows yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addToneRow} className={GHOST_BTN + " mt-2"}>+ Add row</button>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          Internal test
        </h2>
        <textarea
          value={data.internalTest}
          onChange={(e) => set("internalTest", e.target.value)}
          rows={2}
          className={TEXTAREA}
          placeholder="One sentence check. If a line fails this test, rewrite."
        />
        {errors.internalTest && <p className={ERR_TEXT}>{errors.internalTest}</p>}
      </section>

      <SaveBar status={status} onSave={handleSave} />

      {diffOpen && (
        <DiffModal
          current={currentContent}
          next={renderVoice(pendingData!)}
          onConfirm={confirmSave}
          onCancel={closeDiff}
        />
      )}
    </div>
  );
}

function ChipInput({ onAdd, placeholder }: { onAdd: (v: string) => void; placeholder: string }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(val);
            setVal("");
          }
        }}
        className={INPUT + " flex-1"}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => { onAdd(val); setVal(""); }}
        className="rounded border border-neutral-300 px-3 py-2 font-mono text-xs uppercase tracking-wider text-neutral-600 hover:border-neutral-900"
      >
        Add
      </button>
    </div>
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
    <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
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