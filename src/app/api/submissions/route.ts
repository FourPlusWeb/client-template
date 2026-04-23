import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

export const dynamic = "force-dynamic";

const SUBMISSIONS_FILE = "content/submissions.json";

async function ensureDir() {
  const dir = join(process.cwd(), "content");
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const data = await readFile(join(process.cwd(), SUBMISSIONS_FILE), "utf8").catch(() => "[]");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const submission = await request.json();
    await ensureDir();
    
    const data = await readFile(join(process.cwd(), SUBMISSIONS_FILE), "utf8").catch(() => "[]");
    const submissions = JSON.parse(data);
    
    submissions.unshift({
      ...submission,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    
    await writeFile(join(process.cwd(), SUBMISSIONS_FILE), JSON.stringify(submissions, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}