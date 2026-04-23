"use client";

import { useState } from "react";
import { Button, Container, FluidSection } from "@fourplusweb/ui";
import { useRouter } from "next/navigation";
import { Save, Eye, Palette, Type, Mail, Link2, Globe } from "lucide-react";
import { siteConfig } from "../../../../site.config";

type SiteConfigData = {
  name: string;
  description: string;
  url: string;
  locale: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
  };
  fonts: {
    sans: string;
    display: string;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  nav: Array<{ label: string; href: string }>;
  social?: Record<string, string>;
};

const FONT_OPTIONS = [
  "Inter Variable",
  "Plus Jakarta Sans",
  "Work Sans",
  "Sora",
  "Manrope",
  "Outfit",
  "Space Grotesk",
  "DM Sans",
  "Cabinet Grotesk",
  "Satoshi",
  "General Sans",
];

export default function ConfigEditor() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [form, setForm] = useState<SiteConfigData>({
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
    colors: { ...siteConfig.colors },
    fonts: { ...siteConfig.fonts },
    contact: { ...siteConfig.contact },
    nav: siteConfig.nav,
    social: siteConfig.social,
  });
  const [activeTab, setActiveTab] = useState<"site" | "colors" | "fonts" | "contact" | "nav">("site");

  function updateColor(key: keyof typeof form.colors, value: string) {
    setForm((f) => ({
      ...f,
      colors: { ...f.colors, [key]: value },
    }));
  }

  function updateFont(key: keyof typeof form.fonts, value: string) {
    setForm((f) => ({
      ...f,
      fonts: { ...f.fonts, [key]: value },
    }));
  }

  function addNavItem() {
    setForm((f) => ({
      ...f,
      nav: [...f.nav, { label: "New Page", href: "/new" }],
    }));
  }

  function removeNavItem(index: number) {
    setForm((f) => ({
      ...f,
      nav: f.nav.filter((_, i) => i !== index),
    }));
  }

  function updateNavItem(index: number, field: "label" | "href", value: string) {
    setForm((f) => ({
      ...f,
      nav: f.nav.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/studio/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
                  Configuration
                </p>
                <h1 className="text-2xl font-semibold">Site Settings</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Edit site configuration. Changes save to site.config.ts
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" onClick={save} disabled={status === "saving"}>
                  <Save className="mr-2 h-4 w-4" />
                  {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save"}
                </Button>
              </div>
            </header>

            <div className="mb-6 flex gap-1 border-b border-neutral-200">
              {(["site", "colors", "fonts", "contact", "nav"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-neutral-900 text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {tab === "site" && <Globe className="mr-2 inline h-4 w-4" />}
                  {tab === "colors" && <Palette className="mr-2 inline h-4 w-4" />}
                  {tab === "fonts" && <Type className="mr-2 inline h-4 w-4" />}
                  {tab === "contact" && <Mail className="mr-2 inline h-4 w-4" />}
                  {tab === "nav" && <Link2 className="mr-2 inline h-4 w-4" />}
                  {tab === "site" ? "Site" : tab === "colors" ? "Colors" : tab === "fonts" ? "Fonts" : tab === "contact" ? "Contact" : "Navigation"}
                </button>
              ))}
            </div>

            {activeTab === "site" && (
              <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
                <div>
                  <label htmlFor="site-name" className="block text-sm font-medium text-neutral-700">Site Name</label>
                  <input
                    id="site-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="site-desc" className="block text-sm font-medium text-neutral-700">Description</label>
                  <textarea
                    id="site-desc"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="site-url" className="block text-sm font-medium text-neutral-700">URL</label>
                    <input
                      id="site-url"
                      type="url"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="site-locale" className="block text-sm font-medium text-neutral-700">Locale</label>
                    <select
                      id="site-locale"
                      value={form.locale}
                      onChange={(e) => setForm({ ...form, locale: e.target.value })}
                      className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    >
                      <option value="bg">Bulgarian (bg)</option>
                      <option value="en">English (en)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "colors" && (
              <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(form.colors).map(([key, value]) => (
                    <div key={key}>
                      <label htmlFor={`color-${key}`} className="block text-sm font-medium text-neutral-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <div className="mt-1 flex gap-2">
                        <input
                          id={`color-${key}`}
                          type="color"
                          value={value}
                          onChange={(e) => updateColor(key as keyof typeof form.colors, e.target.value)}
                          className="h-10 w-14 cursor-pointer rounded border border-neutral-300"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateColor(key as keyof typeof form.colors, e.target.value)}
                          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "fonts" && (
              <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
                <div>
                  <label htmlFor="font-sans" className="block text-sm font-medium text-neutral-700">Sans Font</label>
                  <select
                    id="font-sans"
                    value={form.fonts.sans}
                    onChange={(e) => updateFont("sans", e.target.value)}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="font-display" className="block text-sm font-medium text-neutral-700">Display Font</label>
                  <select
                    id="font-display"
                    value={form.fonts.display}
                    onChange={(e) => updateFont("display", e.target.value)}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.contact.email}
                    onChange={(e) =>
                      setForm({ ...form, contact: { ...form.contact, email: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-neutral-700">Phone</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.contact.phone || ""}
                    onChange={(e) =>
                      setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-address" className="block text-sm font-medium text-neutral-700">Address</label>
                  <input
                    id="contact-address"
                    type="text"
                    value={form.contact.address || ""}
                    onChange={(e) =>
                      setForm({ ...form, contact: { ...form.contact, address: e.target.value } })
                    }
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === "nav" && (
              <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Navigation Items</h3>
                  <Button variant="outline" size="sm" onClick={addNavItem}>
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.nav.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-8 text-center font-mono text-xs text-neutral-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateNavItem(i, "label", e.target.value)}
                        placeholder="Label"
                        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => updateNavItem(i, "href", e.target.value)}
                        placeholder="/page"
                        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNavItem(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </FluidSection>
    </div>
  );
}