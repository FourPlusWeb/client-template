import type { Metadata } from "next";
import {
  Container,
  CTA,
  Features,
  FluidSection,
  SectionHeading,
  type FeatureItem,
} from "@fourplusweb/ui";
import {
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

const services: FeatureItem[] = [
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
      <FluidSection role="hero">
        <Container>
          <div className="max-w-[var(--container-md)]">
            <SectionHeading
              as="h1"
              overline="Services as modules"
              title="Услугите са подредени като модули, не като твърд сценарий."
              description="Това позволява лесно да добавите, махнете или преименувате блокове според конкретния клиент, без да се чупи цялата структура на страницата."
            />
          </div>
        </Container>
      </FluidSection>

      <Features items={services} eyebrow="Какво правим" />

      <FluidSection role="pillar" background="surface-alt">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <SectionHeading
              overline="What is included"
              title="Блоковете се пренареждат бързо."
              description="Template-ът остава полезен, когато сайтът се развива от прост стартов проект към по-голям, по-уникален и по-специфичен продукт."
            />

            <ul className="flex flex-col gap-0">
              {checklist.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-4 border-t border-[color:var(--color-border)] py-5"
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

      <CTA
        title="Искате нещо уникално, но не от нулата."
        description="Точно за това служи този template: бърза адаптация, ясна основа и достатъчно свобода за различни брандове."
        primary={{ label: "Свържете се с нас", href: "/contact" }}
      />
    </>
  );
}
