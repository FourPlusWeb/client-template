"use client";

import { useState } from "react";
import { Button, Container, FluidSection } from "@fourplusweb/ui";
import { Search, Download, Eye } from "lucide-react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

export default function SubmissionsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  
  const [submissions] = useState<Submission[]>([
    { id: "1", name: "Test User", email: "test@example.com", phone: "+359 000 000", message: "Test message", createdAt: "2026-04-23T10:00:00Z" }
  ]);

  const filtered = submissions.filter(s => 
    search === "" || 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("bg-BG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Message", "Date"];
    const rows = submissions.map(s => [
      s.name, s.email, s.phone || "", s.message, s.createdAt
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <FluidSection role="hero">
        <Container>
          <div className="mx-auto max-w-4xl">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  Forms
                </p>
                <h1 className="text-2xl font-semibold">Submissions</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  View and manage contact form submissions
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </header>

            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  id="search-subs"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-2 text-sm"
                />
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  No submissions yet
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-sm">
                      <th className="px-4 py-3 font-medium text-neutral-500">Date</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Name</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Email</th>
                      <th className="px-4 py-3 font-medium text-neutral-500">Message</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((sub) => (
                      <tr key={sub.id} className="border-b border-neutral-100">
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          {formatDate(sub.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{sub.name}</td>
                        <td className="px-4 py-3 text-sm">{sub.email}</td>
                        <td className="px-4 py-3 text-sm text-neutral-500 truncate max-w-xs">
                          {sub.message.slice(0, 50)}...
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelected(sub)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {selected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="mx-auto w-full max-w-lg rounded-lg bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold">Submission Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-500">Name</p>
                      <p className="font-medium">{selected.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="font-medium">{selected.email}</p>
                    </div>
                    {selected.phone && (
                      <div>
                        <p className="text-sm text-neutral-500">Phone</p>
                        <p className="font-medium">{selected.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-neutral-500">Message</p>
                      <p className="whitespace-pre-wrap">{selected.message}</p>
                    </div>
                    <div className="text-sm text-neutral-500">
                      {formatDate(selected.createdAt)}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setSelected(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </FluidSection>
    </div>
  );
}