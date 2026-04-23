import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

export const dynamic = "force-dynamic";

function prodBlock(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Studio routes are dev-only." }, { status: 404 });
  }
  return null;
}

const SEO_DATA_FILE = "content/seo.json";

async function ensureDir() {
  const dir = join(process.cwd(), "content");
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

export async function GET() {
  const blocked = prodBlock();
  if (blocked) return blocked;

  try {
    const src = await readFile(join(process.cwd(), SEO_DATA_FILE), "utf8").catch(() => "{}");
    return NextResponse.json(JSON.parse(src));
  } catch {
    return NextResponse.json({ error: "Failed to read SEO data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const blocked = prodBlock();
  if (blocked) return blocked;

  try {
    const { pages } = await request.json();
    await ensureDir();
    await writeFile(join(process.cwd(), SEO_DATA_FILE), JSON.stringify(pages, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to write SEO data" }, { status: 500 });
  }
}