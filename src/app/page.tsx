import { Button, Container, Features, FluidSection, Hero } from "@fourplusweb/ui";
import { Rocket, ShieldCheck, Sparkles } from "lucide-react";

// Placeholder copy — замени за клиент (виж BRIEF.md + playbook/copy-seo.md).
const features = [
  {
    icon: <Rocket aria-hidden="true" />,
    title: "Бърз старт",
    description:
      "Пускаме страницата ви в production за дни, не седмици — с ясен процес и фиксирани етапи.",
  },
  {
    icon: <ShieldCheck aria-hidden="true" />,
    title: "Надеждна основа",
    description:
      "Production-grade стек: Next.js, TypeScript, автоматични проверки на качеството на всеки commit.",
  },
  {
    icon: <Sparkles aria-hidden="true" />,
    title: "Грижа за детайла",
    description:
      "Responsive дизайн, достъпност и SEO оптимизации, вградени по подразбиране.",
  },
];

const testimonials = [
  {
    quote:
      "„Получихме работещ сайт за седмица, който клиентите ни реално използват.“",
    author: "{Име на клиент}",
    role: "{Роля, компания}",
  },
  {
    quote:
      "„Процесът беше прозрачен от първия ден — знаехме какво идва и кога.“",
    author: "{Име на клиент}",
    role: "{Роля, компания}",
  },
  {
    quote:
      "„Екипът разбра бизнеса ни и не се наложи да обясняваме два пъти.“",
    author: "{Име на клиент}",
    role: "{Роля, компания}",
  },
];

export default function Home() {
  return (
    <>
      <Hero
        title="{Резултат за клиента — 5-7 думи}"
        subtitle="{Едно изречение за кого е, какво правите и защо е различно.}"
        cta={{ label: "[Основно действие]", href: "/contact" }}
        image="/placeholder-hero.svg"
        imageAlt="Placeholder — замени с реално hero изображение"
      />

      <Features title="Защо нас" items={features} />

      <FluidSection size="lg" background="surface-alt">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl md:text-5xl font-display">Какво казват клиентите</h2>
            <p className="mt-4 text-base text-[color:var(--color-text-muted)]">
              Замени с реални testimonials (минимум 3, с име, роля и компания).
            </p>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <li
                key={i}
                className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-sm)]"
              >
                <p className="text-base">{t.quote}</p>
                <div className="mt-auto">
                  <div className="font-medium">{t.author}</div>
                  <div className="text-sm text-[color:var(--color-text-muted)]">
                    {t.role}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </FluidSection>

      <FluidSection size="lg" background="primary">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-4xl md:text-5xl font-display text-white">
              {"{Готови ли сте да започнем?}"}
            </h2>
            <p className="text-base text-white/80">
              {"{Кратко обяснение какво ще получи клиентът при първия контакт. Замени за клиент.}"}
            </p>
            <a href="/contact">
              <Button variant="secondary" size="lg">[Основно действие]</Button>
            </a>
          </div>
        </Container>
      </FluidSection>
    </>
  );
}
