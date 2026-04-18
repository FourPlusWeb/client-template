import type { Metadata } from "next";
import { ContactForm, Container, FluidSection } from "@fourplusweb/ui";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "../../../site.config";
import { submitContactPlaceholder } from "./actions";

export const metadata: Metadata = {
  title: "Контакти",
  description: "{Как да се свържете с нас. Замени за клиент.}",
};

export default function ContactPage() {
  const { email, phone, address } = siteConfig.contact;

  return (
    <FluidSection size="xl">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-display font-display">Свържете се с нас</h1>
          <p className="mt-6 text-lg text-[color:var(--color-text-muted)]">
            {"{Едно изречение за best way да ви намерят. Замени за клиент.}"}
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Пишете ни</h2>
            <p className="mt-2 text-base text-[color:var(--color-text-muted)]">
              Отговаряме в рамките на един работен ден.
            </p>
            <div className="mt-6">
              <ContactForm onSubmit={submitContactPlaceholder} />
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <h2 className="font-display text-2xl">Директен контакт</h2>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Mail aria-hidden="true" className="mt-1 size-5 shrink-0" />
                <a href={`mailto:${email}`} className="text-base hover:underline">
                  {email}
                </a>
              </li>
              {phone ? (
                <li className="flex items-start gap-3">
                  <Phone aria-hidden="true" className="mt-1 size-5 shrink-0" />
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-base hover:underline"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {address ? (
                <li className="flex items-start gap-3">
                  <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0" />
                  <span className="text-base">{address}</span>
                </li>
              ) : null}
            </ul>

            {/* Map placeholder — Phase A minor ще добави Map компонент; координати 42.6977, 23.3219 (София). */}
            <div
              aria-label="Карта — placeholder"
              className="mt-4 grid aspect-[4/3] place-items-center rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] text-sm text-[color:var(--color-text-muted)]"
            >
              Карта — ще дойде от @fourplusweb/ui (Phase A minor)
            </div>
          </aside>
        </div>
      </Container>
    </FluidSection>
  );
}
