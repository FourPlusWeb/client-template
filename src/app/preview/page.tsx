import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const TOKENS_FILE = "content/preview-tokens.json";

async function verifyToken(token: string): Promise<boolean> {
  if (!existsSync(join(process.cwd(), TOKENS_FILE))) return false;
  const tokensData = await readFile(join(process.cwd(), TOKENS_FILE), "utf8").catch(() => "{}");
  const tokens = JSON.parse(tokensData);
  const tokenData = tokens[token];
  if (!tokenData) return false;
  return new Date(tokenData.expires) > new Date();
}

export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Preview Error</h1>
          <p className="text-neutral-500">Invalid or missing token</p>
        </div>
      </div>
    );
  }
  
  const valid = await verifyToken(token);
  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Preview Expired</h1>
          <p className="text-neutral-500">This preview link has expired or is invalid</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-[9999] bg-yellow-50 overflow-auto">
      <div className="sticky top-0 bg-yellow-400 px-4 py-2 text-center text-sm font-medium">
        Preview Mode - This is a preview of unpublished changes
      </div>
      <div className="p-4">
        <p className="text-center text-neutral-500">
          Preview active. View your site changes here.<br/>
          In a full implementation, this would render the actual pages with preview data.
        </p>
      </div>
    </div>
  );
}