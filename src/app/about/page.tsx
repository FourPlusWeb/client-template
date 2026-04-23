import type { Metadata } from "next";
import {
  Container,
  FluidSection,
  Grid,
  SectionHeading,
} from "@fourplusweb/ui";

export const metadata: Metadata = {
  title: "За нас",
  description:
    "Стабилна основа за екипи и брандове, които искат да стартират бързо без да жертват качеството.",
};

const principles = [
  {
    prefix: "01",
    title: "Системен дизайн",
    description:
      "Компонентите и секциите са подредени така, че да могат да се комбинират в различни типове сайтове без преработка.",
  },
  {
    prefix: "02",
    title: "Token-first подход",
    description:
      "Сменяте визуалния характер през тема и конфигурация, вместо да коригирате отделни класове и hardcoded стойности.",
  },
  {
    prefix: "03",
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
      <FluidSection role="hero">
        <Container>
          <div className="max-w-[var(--container-md)]">
            <SectionHeading
              as="h1"
              overline="За нас"
              title="Вашият текст тук"
              description="Разкажете историята на вашия екип или компания. Добавете опит, мисия и ценности."
            />
          </div>
        </Container>
      </FluidSection>

      <FluidSection role="pillar" background="surface-alt">
        <Container>
          <SectionHeading
            overline="Принципи"
            title="Какво предлагаме"
            description="Това са вашите ключови силни страни. Променете според вашия бизнес."
          />

          <div className="mt-12">
            <Grid cols={3} gap="grid">
              {principles.map((p) => (
                <article
                  key={p.title}
                  className="flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6"
                >
                  <span className="text-caption font-mono text-[color:var(--color-text-muted)]">
                    {p.prefix}
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
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              overline="Възможности"
              title="Какво предлагаме"
              description="Сменете този текст с вашите конкретни услуги или продукти."
            />

            <ul className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-4 border-t border-[color:var(--color-border)] pt-5"
                >
                  <span className="text-caption font-mono text-[color:var(--color-text-muted)] shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </FluidSection>
    </>
  );
}
