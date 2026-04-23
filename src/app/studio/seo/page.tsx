"use client";

import { useState } from "react";
import { Button, Container, FluidSection } from "@fourplusweb/ui";
import { Save, Globe } from "lucide-react";

type PageSeo = {
  slug: string;
  title: string;
  description: string;
  ogImage?: string;
};

const PAGES: PageSeo[] = [
  { slug: "home", title: "Начало", description: "" },
  { slug: "about", title: "За нас", description: "" },
  { slug: "services", title: "Услуги", description: "" },
  { slug: "blog", title: "Блог", description: "" },
  { slug: "contact", title: "Контакти", description: "" },
];

export default function SeoEditor() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [pages, setPages] = useState<PageSeo[]>(PAGES);

  function updatePage(slug: string, field: "title" | "description", value: string) {
    setPages((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/studio/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <FluidSection role="hero">
        <Container>
          <div className="mx-auto max-w-3xl">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  SEO Settings
                </p>
                <h1 className="text-2xl font-semibold">Meta Tags</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Edit meta title, description, and OG image per page
                </p>
              </div>
              <Button onClick={save} disabled={status === "saving"}>
                <Save className="mr-2 h-4 w-4" />
                {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save"}
              </Button>
            </header>

            <div className="space-y-6">
              {pages.map((page) => (
                <div
                  key={page.slug}
                  className="rounded-lg border border-neutral-200 bg-white p-6"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-neutral-400" />
                    <h3 className="font-medium">{page.title}</h3>
                    <span className="font-mono text-xs text-neutral-400">/{page.slug}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`seo-title-${page.slug}`} className="block text-sm font-medium text-neutral-700">
                        Meta Title
                      </label>
                      <input
                        id={`seo-title-${page.slug}`}
                        type="text"
                        value={page.title}
                        onChange={(e) =>
                          updatePage(page.slug, "title", e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor={`seo-desc-${page.slug}`} className="block text-sm font-medium text-neutral-700">
                        Meta Description
                      </label>
                      <textarea
                        id={`seo-desc-${page.slug}`}
                        value={page.description}
                        onChange={(e) =>
                          updatePage(page.slug, "description", e.target.value)
                        }
                        rows={3}
                        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      />
                      <p className="mt-1 text-xs text-neutral-400">
                        {page.description.length}/160 characters
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
              <h3 className="mb-4 font-medium">Global SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    Sitemap Priority
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Automatically generated from page structure
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="index" defaultChecked className="rounded" />
                  <label htmlFor="index" className="text-sm">
                    Allow search engines to index site
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="follow" defaultChecked className="rounded" />
                  <label htmlFor="follow" className="text-sm">
                    Allow search engines to follow links
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </FluidSection>
    </div>
  );
}