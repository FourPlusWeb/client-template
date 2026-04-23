"use client";

import { useState } from "react";
import { Button, Container, FluidSection } from "@fourplusweb/ui";
import { Code, Save, Eye, Plus } from "lucide-react";

type CustomCode = {
  id: string;
  page: string;
  css: string;
  js: string;
};

const PAGES = ["home", "about", "services", "blog", "contact"];

export default function CustomCodePage() {
  const [codes, setCodes] = useState<CustomCode[]>([
    { id: "1", page: "home", css: "", js: "" }
  ]);
  const [selected, setSelected] = useState(codes[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function selectCode(page: string) {
    let code = codes.find(c => c.page === page);
    if (!code) {
      code = { id: crypto.randomUUID(), page, css: "", js: "" };
      setCodes([...codes, code]);
    }
    setSelected(code);
  }

  async function save() {
    setSaving(true);
    // In a real app, this would save to an API
    setTimeout(() => {
      setCodes(codes.map(c => c.id === selected.id ? selected : c));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  }

  function addPage() {
    const unused = PAGES.find(p => !codes.find(c => c.page === p));
    if (unused) selectCode(unused);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <FluidSection role="hero">
        <Container>
          <div className="mx-auto max-w-4xl">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  Advanced
                </p>
                <h1 className="text-2xl font-semibold">Custom Code</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Add custom CSS or JavaScript to specific pages
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => window.open(selected.page === "home" ? "/" : `/${selected.page}`, "_blank")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" onClick={save} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : saved ? "Saved!" : "Save"}
                </Button>
              </div>
            </header>

            <div className="mb-6 flex gap-2 flex-wrap">
              {codes.map(code => (
                <Button 
                  key={code.id} 
                  variant={selected.id === code.id ? "primary" : "outline"} 
                  size="sm"
                  onClick={() => selectCode(code.page)}
                >
                  {code.page}
                </Button>
              ))}
              {codes.length < PAGES.length && (
                <Button variant="ghost" size="sm" onClick={addPage}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Page
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <h3 className="font-medium">CSS</h3>
                </div>
                <p className="mb-3 text-sm text-neutral-500">
                  Custom styles for {selected.page} page
                </p>
                <textarea
                  value={selected.css}
                  onChange={(e) => setSelected({ ...selected, css: e.target.value })}
                  placeholder="/* Your custom CSS */&#10;.custom-element { }"
                  className="w-full h-96 font-mono text-sm rounded-lg border border-neutral-300 p-3 bg-neutral-900 text-neutral-100"
                />
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <h3 className="font-medium">JavaScript</h3>
                </div>
                <p className="mb-3 text-sm text-neutral-500">
                  Custom scripts for {selected.page} page
                </p>
                <textarea
                  value={selected.js}
                  onChange={(e) => setSelected({ ...selected, js: e.target.value })}
                  placeholder="// Your custom JavaScript&#10;document.addEventListener('DOMContentLoaded', () => { });"
                  className="w-full h-96 font-mono text-sm rounded-lg border border-neutral-300 p-3 bg-neutral-900 text-neutral-100"
                />
              </div>
            </div>
          </div>
        </Container>
      </FluidSection>
    </div>
  );
}