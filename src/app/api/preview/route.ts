import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

const TOKENS_FILE = "content/preview-tokens.json";
const PREVIEW_EXPIRY_HOURS = 24 * 7; // 7 days

async function ensureFile() {
  const path = join(process.cwd(), TOKENS_FILE);
  if (!existsSync(path)) {
    await writeFile(path, JSON.stringify({}), "utf8");
  }
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function isValid(tokenData: { token: string; expires: string }, now: Date): boolean {
  return new Date(tokenData.expires) > now;
}

export async function GET() {
  try {
    await ensureFile();
    const tokensData = await readFile(join(process.cwd(), TOKENS_FILE), "utf8");
    const tokens = JSON.parse(tokensData);
    const now = new Date();
    
    const active = Object.entries(tokens)
      .filter(([key]) => {
        const data = tokens[key];
        return isValid(data as { token: string; expires: string }, now);
      })
      .map(([token, data]) => ({
        token,
        ...data as { expires: string; created: string }
      }));
    
    return Response.json(active);
  } catch {
    return Response.json([]);
  }
}

export async function POST() {
  try {
    await ensureFile();
    const now = new Date();
    const expires = new Date(now.getTime() + PREVIEW_EXPIRY_HOURS * 60 * 60 * 1000);
    const token = generateToken();
    
    const tokensData = await readFile(join(process.cwd(), TOKENS_FILE), "utf8");
    const tokens = JSON.parse(tokensData);
    
    tokens[token] = {
      expires: expires.toISOString(),
      created: now.toISOString(),
    };
    
    await writeFile(join(process.cwd(), TOKENS_FILE), JSON.stringify(tokens, null, 2), "utf8");
    
    return Response.json({ 
      token, 
      expires: expires.toISOString(),
      url: `/preview?token=${token}` 
    });
  } catch {
    return Response.json({ error: "Failed to create preview" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return Response.json({ error: "Token required" }, { status: 400 });
    }
    
    const tokensData = await readFile(join(process.cwd(), TOKENS_FILE), "utf8");
    const tokens = JSON.parse(tokensData);
    delete tokens[token];
    await writeFile(join(process.cwd(), TOKENS_FILE), JSON.stringify(tokens, null, 2), "utf8");
    
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete token" }, { status: 500 });
  }
}