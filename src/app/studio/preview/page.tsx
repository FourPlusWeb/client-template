"use client";

import { useState } from "react";
import { Button, Container, FluidSection } from "@fourplusweb/ui";
import { Copy, Trash2, Plus, Eye } from "lucide-react";

type PreviewLink = {
  token: string;
  expires: string;
  created: string;
};

export default function PreviewPage() {
  const [links, setLinks] = useState<PreviewLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadLinks() {
    setLoading(true);
    try {
      const res = await fetch("/api/preview");
      const data = await res.json();
      setLinks(data);
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function createLink() {
    setLoading(true);
    try {
      const res = await fetch("/api/preview", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        setLinks([{ token: data.token, expires: data.expires, created: new Date().toISOString() }, ...links]);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function deleteLink(token: string) {
    try {
      await fetch(`/api/preview?token=${token}`, { method: "DELETE" });
      setLinks(links.filter(l => l.token !== token));
    } catch {
      // ignore
    }
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/preview?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("bg-BG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <FluidSection role="hero">
        <Container>
          <div className="mx-auto max-w-3xl">
            <header className="mb-8">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                Shared
              </p>
              <h1 className="text-2xl font-semibold">Preview Links</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Create shareable links to preview unpublished changes
              </p>
            </header>

            <div className="mb-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={loadLinks} disabled={loading}>
                <Eye className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button size="sm" onClick={createLink} disabled={loading}>
                <Plus className="mr-2 h-4 w-4" />
                New Link
              </Button>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white">
              {links.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  No preview links yet. Create one to share a preview.
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-sm">
                      <th className="px-4 py-3 font-medium text-neutral-500">Created</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Expires</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => (
                      <tr key={link.token} className="border-b border-neutral-100">
                        <td className="px-4 py-3 text-sm">{formatDate(link.created)}</td>
                        <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(link.expires)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => copyLink(link.token)}>
                              <Copy className="h-4 w-4" />
                              {copied === link.token ? " Copied!" : ""}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteLink(link.token)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Container>
      </FluidSection>
    </div>
  );
}