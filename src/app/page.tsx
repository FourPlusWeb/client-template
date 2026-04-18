import { siteConfig } from "../../site.config";

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center">
      <h1 className="text-4xl font-display">Hello from {siteConfig.name}</h1>
    </main>
  );
}
