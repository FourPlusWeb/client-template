import { readBrand } from "../../../../lib/brand-md";
import {
  identityDefaults,
  parseIdentity,
  type IdentityData,
} from "../../../../lib/brand-sections/identity";
import { IdentityEditor } from "./IdentityEditor";

export const dynamic = "force-dynamic";

export default async function IdentityPage() {
  let initial: IdentityData = identityDefaults;
  try {
    const parsed = await readBrand();
    initial = parseIdentity(parsed.sections.identity ?? "");
  } catch {
    // BRAND.md missing — form starts at defaults.
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          Section 01
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Identity</h1>
      </header>
      <IdentityEditor initial={initial} />
    </div>
  );
}
