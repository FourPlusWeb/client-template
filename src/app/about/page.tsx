import type { Metadata } from "next";
import { Container, FluidSection } from "@fourplusweb/ui";

export const metadata: Metadata = {
  title: "За нас",
  description:
    "Стабилна основа за екипи и брандове, които искат да стартират бързо без да жертват качеството.",
};

const principles = [
  {
    title: "Системен дизайн",
    description:
      "Компонентите и секциите са подредени така, че да могат да се комбинират в различни типове сайтове без преработка.",
  },
  {
    title: "Token-first подход",
    description:
      "Сменяте визуалния характер през тема и конфигурация, вместо да коригирате отделни класове и hardcoded стойности.",
  },
  {
    title: "Прост растеж",
    description:
      "Когато се появи нова нужда, добавяте секция или page variant върху същата основа, а не нов стек.",
  },
];

const capabilities = [
  "Landing pages с ясен conversion flow",
  "Страници за услуги, case studies и блог",
  "Подготвена навигация, footer и contact flow",
  "Семпла визуална система, която се променя лесно",
];

export default function AboutPage() {
  return (
    <>
      <FluidSection size="xl">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
              About the system
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              Шаблон, създаден да се адаптира, не да ви ограничава.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[color:var(--color-text-muted)]">
              Основната идея е проста: имате завършена рамка, която изглежда добре,
              работи добре и може да се превърне в различен сайт много по-бързо от
              еднократно ръчно проектиран старт от нулата.
            </p>
          </div>
        </Container>
      </FluidSection>

      <FluidSection size="lg" background="surface-alt">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl md:text-5xl">Какво получавате</h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--color-text-muted)]">
              Това е foundation layer за нови проекти, а не завършен специфичен бранд.
              Всяка част е направена да остане полезна и след следващата промяна на
              темата.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {principles.map((principle) => (
              <li
                key={principle.title}
                className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-sm)]"
              >
                <h3 className="font-display text-2xl">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
                  {principle.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </FluidSection>

      <FluidSection size="lg">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Capabilities
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">
                Подходящо за различни типове клиентски сайтове
              </h2>
              <p className="mt-4 text-base leading-7 text-[color:var(--color-text-muted)]">
                Можете да го използвате за нова агенция, SaaS, услуга, личен бранд
                или малък екипен сайт. Идеята е едно и също ядро да обслужва
                различни съдържателни посоки.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((item) => (
                <li
                  key={item}
                  className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
                >
                  <p className="text-sm leading-6 text-[color:var(--color-text)]">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </FluidSection>
    </>
  );
}
