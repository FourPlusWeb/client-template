import { NextResponse } from "next/server";
import {
  clearBackups,
  readBrand,
  sectionBySlug,
  writeBrandSection,
} from "../../../../lib/brand-md";
import { parseVisual } from "../../../../lib/brand-sections/visual";
import { parseArchitecture } from "../../../../lib/brand-sections/architecture";
import {
  writeColorsAndFonts,
  writeNavAndVariation,
} from "../../../../lib/site-config-writer";

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

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") === "1";

  let body: { slug?: string; content?: string; updateSiteConfig?: boolean };
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

  if (dryRun) {
    return NextResponse.json({ wouldWrite: true, slug: meta.slug, content: body.content });
  }

  // Step 1: always write BRAND.md. If this fails, bail out before touching
  // site.config.ts — we only mirror changes that are already persisted.
  try {
    await writeBrandSection(meta.slug, body.content);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // Step 2: optional mirror to site.config.ts. Independent write — if it
  // fails the BRAND.md change stays and we surface the error so the client
  // can show both.
  let siteConfigUpdated = false;
  let siteConfigError: string | null = null;
  if (body.updateSiteConfig && (meta.slug === "visual" || meta.slug === "architecture")) {
    try {
      if (meta.slug === "visual") {
        const visual = parseVisual(body.content);
        await writeColorsAndFonts(visual.colors, visual.typography);
      } else {
        const arch = parseArchitecture(body.content);
        await writeNavAndVariation(arch.nav, arch.variation);
      }
      siteConfigUpdated = true;
    } catch (err) {
      siteConfigError = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    ok: true,
    slug: meta.slug,
    siteConfigUpdated,
    ...(siteConfigError ? { siteConfigError } : {}),
  });
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
