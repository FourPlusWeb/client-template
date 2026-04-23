import { notFound } from "next/navigation";

export const metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production" && !process.env.STUDIO_PASSWORD) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">{children}</div>
  );
}