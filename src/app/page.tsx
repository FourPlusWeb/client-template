import { Button, Container, FluidSection } from "@fourplusweb/ui";
import {
  ArrowRight,
  CheckCircle2,
  LayoutTemplate,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const pillars = [
  {
    icon: <LayoutTemplate aria-hidden="true" />,
    title: "Ясна структура",
    description:
      "Шаблонът започва с подредена йерархия, така че всяка следваща секция да има място и смисъл.",
  },
  {
    icon: <ShieldCheck aria-hidden="true" />,
    title: "Токен-базиран",
    description:
      "Цветове, радиуси, сенки и типографска скала идват от theme токените, не от разпилени стойности.",
  },
  {
    icon: <Sparkles aria-hidden="true" />,
    title: "Готов за polish",
    description:
      "Има достатъчно визуална дълбочина, за да изглежда завършен, без да е заключен в конкретен дизайн.",
  },
];

const proofPoints = [
  "Единна навигация и footer през целия сайт",
  "Responsive layout с ясни CTA блокове",
  "SEO и metadata основа от самото начало",
];

const steps = [
  {
    title: "1. Променяте токените",
    description:
      "В `site.config.ts` сменяте цвят, типография, радиуси и contact данни, без да търсите по всички страници.",
  },
  {
    title: "2. Допълвате съдържанието",
    description:
      "Параграфите и секциите са подредени така, че да вкарате реалния бранд без да пренареждате layout-а.",
  },
  {
    title: "3. Разширявате по нужда",
    description:
      "Добавяте case studies, услуги или блог съдържание върху вече стабилна система, а не върху празен скелет.",
  },
];

export default function Home() {
  return (
    <>
      <FluidSection size="xl">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-sm text-[color:var(--color-text-muted)] shadow-[var(--shadow-sm)]">
                <span className="size-2 rounded-full bg-[color:var(--color-primary)]" />
                Основа, управлявана от токени
              </div>

              <h1 className="mt-6 font-display text-display leading-[0.95] tracking-tight">
                Красив шаблон, който е достатъчно готов и лесно се пренастройва.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[color:var(--color-text-muted)]">
                Това е базата, която искате да изглежда завършена още от първия ден,
                но да остава спокойна за промени. Цветовете, сенките и ритъмът идват
                от токените, така че следващият бранд е бърза конфигурация, а не
                ново оформление от нулата.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/contact" className="inline-flex">
                  <Button size="lg">
                    Започнете проекта
                    <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </Button>
                </a>
                <a href="/services" className="inline-flex">
                  <Button variant="secondary" size="lg">
                    Вижте структурата
                  </Button>
                </a>
              </div>

              <dl className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["1 източник", "за токени и бранд настройки"],
                  ["3 ядра", "hero, доверие и CTA"],
                  ["100%", "responsive по подразбиране"],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-sm)]"
                  >
                    <dt className="font-display text-2xl text-[color:var(--color-primary)]">
                      {value}
                    </dt>
                    <dd className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 -z-10 rounded-[2rem] blur-3xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                }}
              />
              <div className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-lg)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--color-text-muted)]">
                      Какво има по подразбиране
                    </p>
                    <h2 className="mt-2 font-display text-2xl">Основа за реални сайтове</h2>
                  </div>
                    <div
                      className="rounded-full px-3 py-1 text-xs font-medium text-[color:var(--color-primary-dark)]"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      }}
                    >
                    готово
                    </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {proofPoints.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-4"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0 text-[color:var(--color-primary)]"
                      />
                      <span className="text-sm leading-6 text-[color:var(--color-text)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-md)] bg-[color:var(--color-primary)] p-4 text-white">
                    <p className="text-sm/6 text-white/80">Основно действие</p>
                    <p className="mt-1 font-display text-xl">Ясен CTA</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-4">
                    <p className="text-sm/6 text-[color:var(--color-text-muted)]">
                      Вторично действие
                    </p>
                    <p className="mt-1 font-display text-xl">Нискофрикционен контакт</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </FluidSection>

      <FluidSection size="lg" background="surface-alt">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Основа
              </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Всичко важно е вградено</h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--color-text-muted)]">
              Това не е само визия. Темплейтът ви дава usable page shell, чисти
              states, последователни компоненти и достатъчно празно място за реално
              съдържание.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <li
                key={pillar.title}
                className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-sm)]"
              >
                <div
                  className="flex size-12 items-center justify-center rounded-full text-[color:var(--color-primary)]"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                  }}
                >
                  {pillar.icon}
                </div>
                <h3 className="mt-5 font-display text-2xl">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
                  {pillar.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </FluidSection>

      <FluidSection size="lg">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Работен поток
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">
                Три стъпки до бърза адаптация
              </h2>
              <p className="mt-4 text-base leading-7 text-[color:var(--color-text-muted)]">
                Когато структурата е ясна, реалният бранд се вгражда по-бързо и с по-малък риск.
              </p>
            </div>

            <ol className="grid gap-4">
              {steps.map((step) => (
                <li
                  key={step.title}
                  className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-full text-[color:var(--color-primary)]"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      }}
                    >
                      <Workflow aria-hidden="true" className="size-5" />
                    </div>
                    <h3 className="font-display text-xl">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[color:var(--color-text-muted)]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </FluidSection>

      <FluidSection size="lg" background="primary">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85">
                <Rocket aria-hidden="true" className="size-4" />
              Готово за следващия бранд
              </div>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Шаблонът е по-добър, когато не ви пречи да го смените бързо.
            </h2>
            <p className="text-base leading-7 text-white/80">
              Точно затова текущата основа е token-first: сменяте палитра,
              typography и spacing през конфигурацията, а страниците запазват
              структурата си.
            </p>
            <a href="/contact" className="inline-flex">
              <Button variant="secondary" size="lg">
                Да започнем
              </Button>
            </a>
          </div>
        </Container>
      </FluidSection>
    </>
  );
}
