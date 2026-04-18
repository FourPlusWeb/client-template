import type { Metadata } from "next";
import { ContactForm, Container, FluidSection } from "@fourplusweb/ui";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "../../../site.config";
import { submitContactPlaceholder } from "./actions";

export const metadata: Metadata = {
  title: "Контакти",
  description:
    "Контактна страница с кратък form, директни канали и ясна очаквана следваща стъпка.",
};

const responseNotes = [
  "Отговаряме в рамките на един работен ден.",
  "Може да изпратите кратко описание, а ние ще върнем следваща стъпка.",
  "Ако още не сте сигурни какъв сайт ви трябва, пак е добра отправна точка.",
];

export default function ContactPage() {
  const { email, phone, address } = siteConfig.contact;

  return (
    <FluidSection size="xl">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
            Contact flow
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">
            Свържете се с нас, когато сте готови да превърнем идеята в структура.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[color:var(--color-text-muted)]">
            Формата е кратка, за да е лесно да започнете. Оттам нататък може да
            адаптираме сайта според вашия бранд, съдържание и скорост на работа.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-md)]">
            <h2 className="font-display text-2xl">Пишете ни</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">
              Кажете какъв сайт искате, какво трябва да постигне и какво вече имате
              като съдържание. Това е достатъчно, за да започнем.
            </p>
            <div className="mt-6">
              <ContactForm onSubmit={submitContactPlaceholder} />
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
              <h2 className="font-display text-2xl">Директен контакт</h2>
              <ul className="mt-5 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <Mail aria-hidden="true" className="mt-1 size-5 shrink-0 text-[color:var(--color-primary)]" />
                  <a href={`mailto:${email}`} className="text-base hover:underline">
                    {email}
                  </a>
                </li>
                {phone ? (
                  <li className="flex items-start gap-3">
                    <Phone aria-hidden="true" className="mt-1 size-5 shrink-0 text-[color:var(--color-primary)]" />
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
                    <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-[color:var(--color-primary)]" />
                    <span className="text-base">{address}</span>
                  </li>
                ) : null}
              </ul>
            </section>

            <section className="rounded-[1.5rem] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-6">
              <h2 className="font-display text-2xl">Какво следва</h2>
              <ul className="mt-5 space-y-3">
                {responseNotes.map((note) => (
                  <li key={note} className="text-sm leading-6 text-[color:var(--color-text-muted)]">
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </Container>
    </FluidSection>
  );
}
