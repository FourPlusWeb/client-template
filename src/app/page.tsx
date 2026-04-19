import {
  Container,
  CTA,
  FluidSection,
  Grid,
  Hero,
  SectionHeading,
  StatCard,
  Testimonials,
  type Testimonial,
} from "@fourplusweb/ui";

const pillars = [
  {
    prefix: 1,
    title: "Ясна структура",
    description:
      "Шаблонът започва с подредена йерархия, така че всяка следваща секция да има място и смисъл.",
  },
  {
    prefix: 2,
    title: "Токен-базиран",
    description:
      "Цветове, радиуси, сенки и типографска скала идват от theme токените, не от разпилени стойности.",
  },
  {
    prefix: 3,
    title: "Готов за polish",
    description:
      "Има достатъчно визуална дълбочина, за да изглежда завършен, без да е заключен в конкретен дизайн.",
  },
];

const steps = [
  {
    prefix: "01",
    title: "Променяте токените",
    description:
      "В site.config.ts сменяте цвят, типография, радиуси и contact данни, без да търсите по всички страници.",
  },
  {
    prefix: "02",
    title: "Допълвате съдържанието",
    description:
      "Параграфите и секциите са подредени така, че да вкарате реалния бранд без да пренареждате layout-а.",
  },
  {
    prefix: "03",
    title: "Разширявате по нужда",
    description:
      "Добавяте case studies, услуги или блог съдържание върху вече стабилна система, а не върху празен скелет.",
  },
];

const testimonial: Testimonial = {
  quote:
    "Шаблонът ни даде usable основа от първия ден. Цвят, типография и ритъм се мениджват от едно място — а страниците запазват характер.",
  author: "Пилотен клиент",
  role: "Мениджър продукт",
};

export default function Home() {
  return (
    <>
      <Hero
        layout="editorial"
        eyebrow="Основа, управлявана от токени"
        title="Красив шаблон, който е достатъчно готов и лесно се пренастройва."
        subtitle="Това е базата, която искате да изглежда завършена още от първия ден, но да остава спокойна за промени. Цветовете, сенките и ритъмът идват от токените, така че следващият бранд е бърза конфигурация, а не ново оформление от нулата."
        cta={{ label: "Започнете проекта", href: "/contact" }}
        secondaryCta={{ label: "Вижте структурата", href: "/services" }}
      />

      <FluidSection role="detail">
        <Container>
          <Grid cols={3} gap="grid">
            <StatCard
              prefix="01"
              value="1 източник"
              label="за токени и бранд настройки"
            />
            <StatCard
              prefix="02"
              value="3 ядра"
              label="hero, доверие и CTA"
            />
            <StatCard
              prefix="03"
              value="100%"
              label="responsive по подразбиране"
            />
          </Grid>
        </Container>
      </FluidSection>

      <FluidSection role="pillar" background="surface-alt">
        <Container>
          <SectionHeading
            overline="Основа"
            title="Всичко важно е вградено"
            description="Не е само визия. Темплейтът ви дава usable page shell, чисти states, последователни компоненти и достатъчно празно място за реално съдържание."
          />

          <div className="mt-12">
            <Grid cols={3} gap="grid">
              {pillars.map((p) => (
                <article
                  key={p.title}
                  className="flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6"
                >
                  <span
                    aria-hidden="true"
                    className="text-caption font-mono text-[color:var(--color-text-muted)]"
                  >
                    {String(p.prefix).padStart(2, "0")}
                  </span>
                  <h3 className="text-h2">{p.title}</h3>
                  <p className="text-body text-[color:var(--color-text-muted)] max-w-[var(--card-body-max-width)]">
                    {p.description}
                  </p>
                </article>
              ))}
            </Grid>
          </div>
        </Container>
      </FluidSection>

      <FluidSection role="pillar">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionHeading
              overline="Работен поток"
              title="Три стъпки до бърза адаптация"
              description="Когато структурата е ясна, реалният бранд се вгражда по-бързо и с по-малък риск."
            />

            <ol className="flex flex-col gap-4">
              {steps.map((step) => (
                <li
                  key={step.title}
                  className="flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6"
                >
                  <span
                    aria-hidden="true"
                    className="text-caption font-mono text-[color:var(--color-text-muted)]"
                  >
                    {step.prefix}
                  </span>
                  <h3 className="text-h3">{step.title}</h3>
                  <p className="text-body text-[color:var(--color-text-muted)]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </FluidSection>

      <Testimonials item={testimonial} />

      <CTA
        title="Шаблонът е по-добър, когато не ви пречи да го смените бързо."
        description="Точно затова текущата основа е token-first: сменяте палитра, typography и spacing през конфигурацията, а страниците запазват структурата си."
        primary={{ label: "Да започнем", href: "/contact" }}
        secondary={{ label: "Вижте услугите", href: "/services" }}
      />
    </>
  );
}
