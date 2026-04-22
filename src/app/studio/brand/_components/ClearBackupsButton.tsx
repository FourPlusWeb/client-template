"use client";

import { useState } from "react";

export function ClearBackupsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleClear = async () => {
    if (!window.confirm("Delete all brand backup files? This cannot be undone.")) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/studio/brand", { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setResult(`${json.cleared.length} backup files cleared.`);
      } else {
        setResult(`Error: ${json.error}`);
      }
    } catch (err) {
      setResult(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClear}
        disabled={loading}
        className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-medium text-neutral-600 hover:border-red-400 hover:text-red-700 disabled:opacity-50"
      >
        {loading ? "Clearing..." : "Clear backups"}
      </button>
      {result && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-600">
          {result}
        </span>
      )}
    </div>
  );
}