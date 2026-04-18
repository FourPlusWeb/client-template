import type { Metadata } from "next";
import {
  ContactForm,
  Container,
  FluidSection,
  SectionHeading,
} from "@fourplusweb/ui";
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
    <FluidSection role="hero">
      <Container>
        <div className="max-w-[var(--container-md)]">
          <SectionHeading
            as="h1"
            overline="Contact flow"
            title="Свържете се с нас, когато сте готови да превърнем идеята в структура."
            description="Формата е кратка, за да е лесно да започнете. Оттам нататък адаптираме сайта според вашия бранд, съдържание и скорост на работа."
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="border-t border-[color:var(--color-border)] pt-8">
            <h2 className="text-h2">Пишете ни</h2>
            <p className="mt-3 text-body text-[color:var(--color-text-muted)] max-w-[var(--card-body-max-width)]">
              Кажете какъв сайт искате, какво трябва да постигне и какво вече имате
              като съдържание. Това е достатъчно, за да започнем.
            </p>
            <div className="mt-8">
              <ContactForm onSubmit={submitContactPlaceholder} />
            </div>
          </section>

          <aside className="flex flex-col gap-10">
            <section className="border-t border-[color:var(--color-border)] pt-8">
              <h2 className="text-h2">Директен контакт</h2>
              <ul className="mt-6 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <Mail
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-[color:var(--color-primary)]"
                  />
                  <a
                    href={`mailto:${email}`}
                    className="text-body hover:underline"
                  >
                    {email}
                  </a>
                </li>
                {phone ? (
                  <li className="flex items-start gap-3">
                    <Phone
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-[color:var(--color-primary)]"
                    />
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="text-body hover:underline"
                    >
                      {phone}
                    </a>
                  </li>
                ) : null}
                {address ? (
                  <li className="flex items-start gap-3">
                    <MapPin
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-[color:var(--color-primary)]"
                    />
                    <span className="text-body">{address}</span>
                  </li>
                ) : null}
              </ul>
            </section>

            <section className="border-t border-[color:var(--color-border)] pt-8">
              <h2 className="text-h2">Какво следва</h2>
              <ul className="mt-6 flex flex-col gap-4">
                {responseNotes.map((note, i) => (
                  <li key={note} className="flex gap-3">
                    <span className="text-caption font-mono text-[color:var(--color-text-muted)] shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-body-sm text-[color:var(--color-text-muted)]">
                      {note}
                    </p>
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
