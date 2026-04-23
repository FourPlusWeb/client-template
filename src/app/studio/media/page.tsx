"use client";

import { useState } from "react";
import { Button, Container, FluidSection } from "@fourplusweb/ui";
import { Image as ImageIcon, Upload, Trash2, Copy, Search } from "lucide-react";

type MediaItem = {
  filename: string;
  url: string;
  size?: number;
  uploadedAt: string;
};

const SAMPLE_IMAGES: MediaItem[] = [
  { filename: "hero.jpg", url: "/hero.jpg", uploadedAt: "2024-01-01T00:00:00Z" },
  { filename: "about.jpg", url: "/about.jpg", uploadedAt: "2024-01-01T00:00:00Z" },
  { filename: "og-image.png", url: "/og-image.png", uploadedAt: "2024-01-01T00:00:00Z" },
];

export default function MediaPage() {
  const [images, setImages] = useState<MediaItem[]>(SAMPLE_IMAGES);
  const [search, setSearch] = useState("");

  const filtered = images.filter(img => 
    search === "" || img.filename.toLowerCase().includes(search.toLowerCase())
  );

  function copyUrl(url: string) {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    
    setUploading(true);
    // In a real app, this would upload to an API
    setTimeout(() => {
      for (const file of files) {
        setImages(prev => [...prev, {
          filename: file.name,
          url: `/uploads/${file.name}`,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }]);
      }
      setUploading(false);
    }, 1000);
  }

  function deleteImage(filename: string) {
    setImages(images.filter(img => img.filename !== filename));
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <FluidSection role="hero">
        <Container>
          <div className="mx-auto max-w-4xl">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  Assets
                </p>
                <h1 className="text-2xl font-semibold">Media Library</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Manage images and files
                </p>
              </div>
              <div>
                <input
                  type="file"
                  id="upload"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
                <label htmlFor="upload" className="inline-flex cursor-pointer">
                  <span className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </span>
                </label>
              </div>
            </header>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img) => (
                <div key={img.filename} className="group rounded-lg border border-neutral-200 bg-white overflow-hidden">
                  <div className="aspect-square bg-neutral-100 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-neutral-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{img.filename}</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copyUrl(img.url)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteImage(img.filename)}>
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-500">
                No images found. Upload some to get started.
              </div>
            )}
          </div>
        </Container>
      </FluidSection>
    </div>
  );
}