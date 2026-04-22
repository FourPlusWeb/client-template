"use client";

import { useState } from "react";
import { useSectionSave, DiffModal, type SaveStatus } from "../_hooks/useSectionSave";
import {
  positioningSchema,
  renderPositioning,
  type PositioningData,
  type CategoryClaim,
  type Pillar,
  type ValueRow,
  type ComparisonMatrix,
} from "../../../../lib/brand-sections/positioning";

const INPUT =
  "w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none";
const TEXTAREA = INPUT + " min-h-[80px] resize-y";
const CELL_INPUT =
  "w-full rounded border border-transparent bg-transparent px-2 py-1 font-mono text-xs text-neutral-900 hover:border-neutral-200 focus:border-neutral-900 focus:bg-white focus:outline-none";
const TH = "px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider text-neutral-500";
const TD = "px-2 py-1 align-top";
const GHOST_BTN =
  "rounded border border-neutral-300 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:border-neutral-900 hover:text-neutral-900";
const ERR_TEXT = "mt-1 text-xs text-red-700";

export function PositioningEditor({ initial }: { initial: PositioningData }) {
  const [data, setData] = useState<PositioningData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { save, status, diffOpen, currentContent, pendingData, closeDiff, confirmSave } =
    useSectionSave("positioning", renderPositioning, renderPositioning(initial));

  const set = <K extends keyof PositioningData>(key: K, val: PositioningData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const updateCompetitor = (i: number, patch: Partial<CategoryClaim["competitors"][0]>) =>
    setData((d) => ({
      ...d,
      categoryClaim: {
        ...d.categoryClaim,
        competitors: d.categoryClaim.competitors.map((c, idx) =>
          idx === i ? { ...c, ...patch } : c,
        ),
      },
    }));

  const addCompetitor = () =>
    setData((d) => ({
      ...d,
      categoryClaim: {
        ...d.categoryClaim,
        competitors: [...d.categoryClaim.competitors, { framing: "", territory: "" }],
      },
    }));

  const removeCompetitor = (i: number) =>
    setData((d) => ({
      ...d,
      categoryClaim: {
        ...d.categoryClaim,
        competitors: d.categoryClaim.competitors.filter((_, idx) => idx !== i),
      },
    }));

  const updatePillar = (i: number, patch: Partial<Pillar>) =>
    setData((d) => ({
      ...d,
      trustEquation: {
        ...d.trustEquation,
        pillars: d.trustEquation.pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
      },
    }));

  const addPillar = () =>
    setData((d) => ({
      ...d,
      trustEquation: {
        ...d.trustEquation,
        pillars: [
          ...d.trustEquation.pillars,
          { name: `Pillar ${d.trustEquation.pillars.length + 1}`, description: "" },
        ],
      },
    }));

  const removePillar = (i: number) =>
    setData((d) => ({
      ...d,
      trustEquation: {
        ...d.trustEquation,
        pillars: d.trustEquation.pillars.filter((_, idx) => idx !== i),
      },
    }));

  const updateValueRow = (i: number, patch: Partial<ValueRow>) =>
    setData((d) => ({
      ...d,
      valueArchitecture: d.valueArchitecture.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));

  const updateMatrixColumn = (i: number, val: string) =>
    setData((d) => ({
      ...d,
      comparisonMatrix: {
        ...d.comparisonMatrix,
        columns: d.comparisonMatrix.columns.map((c, idx) => (idx === i ? val : c)),
      },
    }));

  const addMatrixColumn = () =>
    setData((d) => ({
      ...d,
      comparisonMatrix: {
        ...d.comparisonMatrix,
        columns: [...d.comparisonMatrix.columns, `Competitor ${String.fromCharCode(65 + d.comparisonMatrix.columns.length - 1)}`],
        rows: d.comparisonMatrix.rows.map((r) => ({
          ...r,
          values: [...r.values, "no" as const],
        })),
      },
    }));

  const removeMatrixColumn = (i: number) => {
    if (i === 0) return;
    setData((d) => ({
      ...d,
      comparisonMatrix: {
        ...d.comparisonMatrix,
        columns: d.comparisonMatrix.columns.filter((_, idx) => idx !== i),
        rows: d.comparisonMatrix.rows.map((r) => ({
          ...r,
          values: r.values.filter((_, idx) => idx !== i),
        })),
      },
    }));
  };

  const updateMatrixRow = (i: number, patch: Partial<ComparisonMatrix["rows"][0]>) =>
    setData((d) => ({
      ...d,
      comparisonMatrix: {
        ...d.comparisonMatrix,
        rows: d.comparisonMatrix.rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
      },
    }));

  const addMatrixRow = () =>
    setData((d) => ({
      ...d,
      comparisonMatrix: {
        ...d.comparisonMatrix,
        rows: [
          ...d.comparisonMatrix.rows,
          {
            capability: "",
            values: d.comparisonMatrix.columns.map(() => "na" as const),
          },
        ],
      },
    }));

  const removeMatrixRow = (i: number) =>
    setData((d) => ({
      ...d,
      comparisonMatrix: {
        ...d.comparisonMatrix,
        rows: d.comparisonMatrix.rows.filter((_, idx) => idx !== i),
      },
    }));

  const setYesNo = (ri: number, ci: number, val: "yes" | "no" | "na") =>
    setData((d) => ({
      ...d,
      comparisonMatrix: {
        ...d.comparisonMatrix,
        rows: d.comparisonMatrix.rows.map((r, idx) =>
          idx === ri ? { ...r, values: r.values.map((v, i) => (i === ci ? val : v)) } : r,
        ),
      },
    }));

  const handleSave = () => {
    const result = positioningSchema.safeParse(data);
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
          Category claim
        </h2>
        <p className="mb-3 text-xs text-neutral-500">Last row is highlighted as &ldquo;ours.&rdquo;</p>
        <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50">
                <th className={TH}>Framing</th>
                <th className={TH}>Territory</th>
                <th className={TH}>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {data.categoryClaim.competitors.map((r, i) => (
                <tr key={i} className="border-t border-neutral-200">
                  <td className={TD}>
                    <input value={r.framing} onChange={(e) => updateCompetitor(i, { framing: e.target.value })} className={CELL_INPUT} />
                  </td>
                  <td className={TD}>
                    <input value={r.territory} onChange={(e) => updateCompetitor(i, { territory: e.target.value })} className={CELL_INPUT} />
                  </td>
                  <td className={TD}>
                    <button type="button" onClick={() => removeCompetitor(i)} className={GHOST_BTN}>remove</button>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-neutral-900 bg-neutral-50">
                <td className={TD}>
                  <input value={data.categoryClaim.ourFraming} onChange={(e) => setData((d) => ({ ...d, categoryClaim: { ...d.categoryClaim, ourFraming: e.target.value } }))} className={CELL_INPUT + " font-semibold"} placeholder="Our framing" />
                </td>
                <td className={TD}>
                  <input value={data.categoryClaim.ourTerritory} onChange={(e) => setData((d) => ({ ...d, categoryClaim: { ...d.categoryClaim, ourTerritory: e.target.value } }))} className={CELL_INPUT + " font-semibold"} placeholder="Our territory" />
                </td>
                <td className={TD}>
                  <span className="font-mono text-[10px] text-neutral-400">ours</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addCompetitor} className={GHOST_BTN + " mt-2"}>+ Add competitor</button>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">The moat</h2>
        <textarea
          value={data.moat}
          onChange={(e) => set("moat", e.target.value)}
          rows={4}
          className={TEXTAREA}
        />
        {errors.moat && <p className={ERR_TEXT}>{errors.moat}</p>}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">Trust equation</h2>
        <div className="mb-4">
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500" htmlFor="formula-block">Formula block</label>
          <textarea
            id="formula-block"
            value={data.trustEquation.formula}
            onChange={(e) => setData((d) => ({ ...d, trustEquation: { ...d.trustEquation, formula: e.target.value } }))}
            rows={3}
            className={TEXTAREA + " font-mono text-xs"}
            placeholder="e.g. Reliability + Completeness + Speed = Trust"
          />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">Pillars</span>
            <button type="button" onClick={addPillar} className={GHOST_BTN}>+ Add pillar</button>
          </div>
          <div className="space-y-2">
            {data.trustEquation.pillars.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={p.name} onChange={(e) => updatePillar(i, { name: e.target.value })} className="w-40 rounded border border-neutral-300 bg-white px-2 py-1 font-mono text-xs" placeholder="Pillar name" />
                <input value={p.description} onChange={(e) => updatePillar(i, { description: e.target.value })} className="flex-1 rounded border border-neutral-300 bg-white px-2 py-1 font-mono text-xs" placeholder="Description" />
                <button type="button" onClick={() => removePillar(i)} className={GHOST_BTN}>remove</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">Value architecture</h2>
        <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50">
                <th className={TH}>Tier</th>
                <th className={TH}>Question</th>
                <th className={TH}>Our answer</th>
              </tr>
            </thead>
            <tbody>
              {data.valueArchitecture.map((r, i) => (
                <tr key={r.tier} className="border-t border-neutral-200">
                  <td className={`${TD} font-semibold text-neutral-700`}>{r.tier}</td>
                  <td className={TD}>
                    <input value={r.question} onChange={(e) => updateValueRow(i, { question: e.target.value })} className={CELL_INPUT} />
                  </td>
                  <td className={TD}>
                    <input value={r.answer} onChange={(e) => updateValueRow(i, { answer: e.target.value })} className={CELL_INPUT} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-600">Structural comparison matrix</h2>
        <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50">
                <th className={TH}>Capability</th>
                {data.comparisonMatrix.columns.map((col, ci) => (
                  <th key={ci} className={TH}>
                    <div className="flex items-center gap-1">
                      <input value={col} onChange={(e) => updateMatrixColumn(ci, e.target.value)} className="w-24 bg-transparent font-mono text-[11px] uppercase" />
                      {ci > 0 && (
                        <button type="button" onClick={() => removeMatrixColumn(ci)} className="text-neutral-400 hover:text-red-600">×</button>
                      )}
                    </div>
                  </th>
                ))}
                <th className={TH}>
                  <button type="button" onClick={addMatrixColumn} className={GHOST_BTN}>+ Col</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.comparisonMatrix.rows.map((r, ri) => (
                <tr key={ri} className="border-t border-neutral-200">
                  <td className={TD}>
                    <input value={r.capability} onChange={(e) => updateMatrixRow(ri, { capability: e.target.value })} className={CELL_INPUT} placeholder="Capability" />
                  </td>
                  {r.values.map((v, ci) => (
                    <td key={ci} className={`${TD} text-center`}>
                      <select
                        value={v}
                        onChange={(e) => setYesNo(ri, ci, e.target.value as "yes" | "no" | "na")}
                        className="rounded border border-transparent bg-transparent font-mono text-xs hover:border-neutral-200 focus:border-neutral-900"
                      >
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                        <option value="na">n/a</option>
                      </select>
                    </td>
                  ))}
                  <td className={TD}>
                    <button type="button" onClick={() => removeMatrixRow(ri)} className={GHOST_BTN}>remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addMatrixRow} className={GHOST_BTN + " mt-2"}>+ Add row</button>
      </section>

      <SaveBar status={status} onSave={handleSave} />

      {diffOpen && (
        <DiffModal
          current={currentContent}
          next={renderPositioning(pendingData!)}
          onConfirm={confirmSave}
          onCancel={closeDiff}
        />
      )}
    </div>
  );
}

function SaveBar({
  status,
  onSave,
}: {
  status: SaveStatus;
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