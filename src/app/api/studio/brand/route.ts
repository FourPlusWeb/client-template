import { NextResponse } from "next/server";
import {
  clearBackups,
  readBrand,
  sectionBySlug,
  writeBrandSection,
} from "../../../../lib/brand-md";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function prodBlock(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Studio routes are dev-only." }, { status: 404 });
  }
  return null;
}

export async function GET() {
  const blocked = prodBlock();
  if (blocked) return blocked;
  try {
    const parsed = await readBrand();
    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const blocked = prodBlock();
  if (blocked) return blocked;

  let body: { slug?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.slug || typeof body.content !== "string") {
    return NextResponse.json(
      { error: "Body must be { slug: string, content: string }." },
      { status: 400 },
    );
  }

  const meta = sectionBySlug(body.slug);
  if (!meta) {
    return NextResponse.json({ error: `Unknown section slug: ${body.slug}` }, { status: 400 });
  }

  try {
    await writeBrandSection(meta.slug, body.content);
    return NextResponse.json({ ok: true, slug: meta.slug });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  const blocked = prodBlock();
  if (blocked) return blocked;
  try {
    const cleaned = await clearBackups();
    return NextResponse.json({ ok: true, cleaned });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
