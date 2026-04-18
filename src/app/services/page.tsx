import type { Metadata } from "next";
import { Button, Container, Features, FluidSection } from "@fourplusweb/ui";
import {
  BarChart3,
  Briefcase,
  Cog,
  HeartHandshake,
  LineChart,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Услуги",
  description: "{Преглед на услугите и как помагат на клиентите. Замени за клиент.}",
};

// Placeholder copy — замени за клиент.
const services = [
  {
    icon: <Briefcase aria-hidden="true" />,
    title: "{Услуга 1}",
    description: "{Кратко описание какъв резултат получава клиентът от тази услуга.}",
  },
  {
    icon: <Cog aria-hidden="true" />,
    title: "{Услуга 2}",
    description: "{Кратко описание какъв резултат получава клиентът от тази услуга.}",
  },
  {
    icon: <LineChart aria-hidden="true" />,
    title: "{Услуга 3}",
    description: "{Кратко описание какъв резултат получава клиентът от тази услуга.}",
  },
  {
    icon: <Users aria-hidden="true" />,
    title: "{Услуга 4}",
    description: "{Кратко описание какъв резултат получава клиентът от тази услуга.}",
  },
  {
    icon: <BarChart3 aria-hidden="true" />,
    title: "{Услуга 5}",
    description: "{Кратко описание какъв резултат получава клиентът от тази услуга.}",
  },
  {
    icon: <HeartHandshake aria-hidden="true" />,
    title: "{Услуга 6}",
    description: "{Кратко описание какъв резултат получава клиентът от тази услуга.}",
  },
];

export default function ServicesPage() {
  return (
    <>
      <FluidSection size="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-display font-display">Услуги</h1>
            <p className="mt-6 text-lg text-[color:var(--color-text-muted)]">
              {"{Едно изречение за обхвата на услугите и за кого са подходящи. Замени за клиент.}"}
            </p>
          </div>
        </Container>
      </FluidSection>

      <Features items={services} />

      <FluidSection size="lg" background="primary">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-display font-display text-white">
              {"{Не сте сигурни коя услуга ви трябва?}"}
            </h2>
            <p className="text-base text-white/80">
              {"{Кратко описание на first-step процеса — безплатна консултация, аудит и т.н.}"}
            </p>
            <a href="/contact" className="inline-block">
              <Button variant="secondary" size="lg">
                [Свържете се с нас]
              </Button>
            </a>
          </div>
        </Container>
      </FluidSection>
    </>
  );
}
