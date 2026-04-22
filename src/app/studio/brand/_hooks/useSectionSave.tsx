"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok" }
  | { kind: "err"; msg: string };

export function useSectionSave<TData>(
  slug: string,
  renderFn: (data: TData) => string,
  initialContent: string,
) {
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });
  const [pendingData, setPendingData] = useState<TData | null>(null);
  const [diffOpen, setDiffOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(initialContent);
  const extrasRef = useRef<Record<string, unknown>>({});
  const router = useRouter();

  const openDiff = useCallback((data: TData, rendered: string, current: string) => {
    setPendingData(data);
    setCurrentContent(current);
    extrasRef.current = {};
    setDiffOpen(true);
  }, []);

  const closeDiff = useCallback(() => {
    setDiffOpen(false);
    setPendingData(null);
    extrasRef.current = {};
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (pendingData) {
          const rendered = renderFn(pendingData);
          openDiff(pendingData, rendered, currentContent);
        } else if (diffOpen) {
          closeDiff();
        }
      }
      if (e.key === "Escape" && diffOpen) {
        closeDiff();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pendingData, diffOpen, currentContent, renderFn, openDiff, closeDiff]);

  const save = useCallback(
    (data: TData) => {
      setPendingData(data);
      const rendered = renderFn(data);
      openDiff(data, rendered, currentContent);
    },
    [renderFn, currentContent, openDiff],
  );

  const confirmSave = useCallback(async (extras?: Record<string, unknown>) => {
    if (!pendingData) return;
    setDiffOpen(false);
    setStatus({ kind: "saving" });
    if (extras) extrasRef.current = extras;
    try {
      const rendered = renderFn(pendingData);
      const dryRun = localStorage.getItem("brand-dry-run") === "1";
      const url = dryRun ? "/api/studio/brand?dryRun=1" : "/api/studio/brand";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content: rendered, ...extrasRef.current }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setStatus({ kind: "err", msg });
        return;
      }
      setStatus({ kind: "ok" });
      if (!dryRun) router.refresh();
    } catch (err) {
      setStatus({ kind: "err", msg: err instanceof Error ? err.message : String(err) });
    } finally {
      setPendingData(null);
      extrasRef.current = {};
    }
  }, [pendingData, renderFn, slug, router]);

  return {
    save,
    status,
    diffOpen,
    currentContent,
    pendingData,
    closeDiff,
    confirmSave,
  };
}

export function DiffModal({
  current,
  next,
  onConfirm,
  onCancel,
}: {
  current: string;
  next: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const diff = lineDiff(current, next);
  const dryRun = localStorage.getItem("brand-dry-run") === "1";

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm changes"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onCancel}
      onKeyDown={(e) => { if (e.key === "Escape") onCancel(); }}
    >
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      <div
        role="document"
        style={{
          background: "white",
          borderRadius: 12,
          padding: 24,
          maxWidth: 800,
          width: "90vw",
          maxHeight: "80vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { e.stopPropagation(); }}
      >
        <h2 style={{ fontWeight: 600, margin: 0 }}>Confirm changes</h2>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {diff.map((d, i) => (
            <div
              key={i}
              style={{
                padding: "2px 12px",
                background: d.kind === "+" ? "#dcfce7" : d.kind === "-" ? "#fee2e2" : "transparent",
                color: d.kind === "+" ? "#166534" : d.kind === "-" ? "#991b1b" : "#374151",
              }}
            >
              <span style={{ marginRight: 8, opacity: 0.5 }}>{d.kind}</span>
              {d.line || "\u00a0"}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#111",
              color: "white",
              cursor: "pointer",
            }}
          >
            {dryRun ? "Log (dry-run)" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

type DiffLine = { kind: "+" | "-" | "="; line: string };

function lineDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const dp: number[][] = Array.from({ length: oldLines.length + 1 }, () =>
    new Array(newLines.length + 1).fill(0),
  );
  for (let i = 1; i <= oldLines.length; i++) {
    for (let j = 1; j <= newLines.length; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const result: DiffLine[] = [];
  let i = oldLines.length;
  let j = newLines.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ kind: "=", line: oldLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ kind: "+", line: newLines[j - 1] });
      j--;
    } else {
      result.unshift({ kind: "-", line: oldLines[i - 1] });
      i--;
    }
  }
  return result;
}