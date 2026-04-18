import type { Metadata } from "next";
import { Button, Container, FluidSection } from "@fourplusweb/ui";
import {
  CheckCircle2,
  LayoutGrid,
  Palette,
  Rocket,
  Search,
  Settings2,
  Workflow,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Подредени service блокове, които могат да се комбинират и преименуват според конкретния клиент.",
};

const services = [
  {
    icon: <Search aria-hidden="true" />,
    title: "Стратегия и структура",
    description:
      "Изчистваме навигацията, съдържанието и секциите така, че сайтът да има ясна логика и лесен flow.",
  },
  {
    icon: <Palette aria-hidden="true" />,
    title: "Визуална система",
    description:
      "Токените задават цветовете, типографията и ритъма, за да може новият бранд да се появи бързо и чисто.",
  },
  {
    icon: <Workflow aria-hidden="true" />,
    title: "Build и launch",
    description:
      "Подготвяме страниците, състоянията и базовите SEO елементи, за да е сайтът готов за реална употреба.",
  },
  {
    icon: <LayoutGrid aria-hidden="true" />,
    title: "Page variants",
    description:
      "Добавяте нови типове страници върху съществуващата система, без да губите последователност.",
  },
  {
    icon: <Settings2 aria-hidden="true" />,
    title: "Token tweaks",
    description:
      "Сменяте визуалния тон с няколко промени в конфигурацията вместо с редица еднократни CSS изключения.",
  },
  {
    icon: <Rocket aria-hidden="true" />,
    title: "Бърз старт",
    description:
      "Шаблонът е достатъчно подреден, за да стигате по-бързо до уникален сайт, без да започвате от празно платно.",
  },
];

const checklist = [
  "Добра основа за нов проект",
  "Лесна смяна на бранд токени",
  "Подходящо за landing и multi-page сайтове",
  "Минимален friction при последващи промени",
];

export default function ServicesPage() {
  return (
    <>
      <FluidSection size="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
              Services as modules
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              Услугите са подредени като модули, не като твърд сценарий.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[color:var(--color-text-muted)]">
              Това позволява лесно да добавите, махнете или преименувате блокове
              според конкретния клиент, без да се чупи цялата структура на страницата.
            </p>
          </div>
        </Container>
      </FluidSection>

      <FluidSection size="lg" background="surface-alt">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <li
                key={service.title}
                className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-sm)]"
              >
                <div
                  className="flex size-12 items-center justify-center rounded-full text-[color:var(--color-primary)]"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                  }}
                >
                  {service.icon}
                </div>
                <h2 className="mt-5 font-display text-2xl">{service.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </FluidSection>

      <FluidSection size="lg">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                What is included
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">
                Блоковете са достатъчно ясни, за да се пренареждат бързо.
              </h2>
              <p className="mt-4 text-base leading-7 text-[color:var(--color-text-muted)]">
                Така template-ът остава полезен, когато сайтът се развива от прост
                стартов проект към по-голям, по-уникален и по-специфичен продукт.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-[color:var(--color-primary)]"
                  />
                  <p className="text-sm leading-6 text-[color:var(--color-text)]">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </FluidSection>

      <FluidSection size="lg" background="primary">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Искате нещо уникално, но не от нулата.
            </h2>
            <p className="text-base leading-7 text-white/80">
              Точно за това служи този template: бърза адаптация, ясна основа и
              достатъчно свобода за различни брандове.
            </p>
            <a href="/contact" className="inline-flex">
              <Button variant="secondary" size="lg">
                Свържете се с нас
              </Button>
            </a>
          </div>
        </Container>
      </FluidSection>
    </>
  );
}
