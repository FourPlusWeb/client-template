import type { Metadata } from "next";
import { Container, FluidSection, ResponsiveImage } from "@fourplusweb/ui";

export const metadata: Metadata = {
  title: "За нас",
  description: "{Кратко описание на компанията и екипа. Замени за клиент.}",
};

// Placeholder copy — замени за клиент (виж BRIEF.md).
const team = [
  { name: "{Име и Фамилия}", role: "{Роля / позиция}" },
  { name: "{Име и Фамилия}", role: "{Роля / позиция}" },
  { name: "{Име и Фамилия}", role: "{Роля / позиция}" },
  { name: "{Име и Фамилия}", role: "{Роля / позиция}" },
];

const values = [
  {
    title: "{Ценност 1}",
    description:
      "{Едно изречение защо тази ценност е важна за клиентите ви.}",
  },
  {
    title: "{Ценност 2}",
    description:
      "{Едно изречение защо тази ценност е важна за клиентите ви.}",
  },
  {
    title: "{Ценност 3}",
    description:
      "{Едно изречение защо тази ценност е важна за клиентите ви.}",
  },
];

export default function AboutPage() {
  return (
    <>
      <FluidSection size="xl">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-display font-display">За {"{Company name}"}</h1>
            <p className="mt-6 text-lg text-[color:var(--color-text-muted)]">
              {"{Параграф 1: Кой сте, с какво се занимавате, защо съществувате. Замени за клиент.}"}
            </p>
            <p className="mt-4 text-base text-[color:var(--color-text-muted)]">
              {"{Параграф 2: Кратка история или контекст — откога сте на пазара, какво сте научили.}"}
            </p>
            <p className="mt-4 text-base text-[color:var(--color-text-muted)]">
              {"{Параграф 3: Какво ви отличава от останалите в категорията.}"}
            </p>
          </div>
        </Container>
      </FluidSection>

      <FluidSection size="lg" background="surface-alt">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-display font-display">Екипът</h2>
            <p className="mt-4 text-base text-[color:var(--color-text-muted)]">
              {"{Едно изречение за екипа като цяло.}"}
            </p>
          </div>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <li key={i} className="flex flex-col gap-3">
                <ResponsiveImage
                  src="/placeholder-portrait.svg"
                  alt={`Портрет — ${member.name}`}
                  aspectRatio="1/1"
                  sizes="card"
                />
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-[color:var(--color-text-muted)]">
                    {member.role}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </FluidSection>

      <FluidSection size="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-display font-display">Мисия и ценности</h2>
            <p className="mt-4 text-lg text-[color:var(--color-text-muted)]">
              {"{Едно изречение за мисията ви — какво правите за клиентите и защо.}"}
            </p>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {values.map((v, i) => (
                <li
                  key={i}
                  className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6"
                >
                  <h3 className="font-display text-xl">{v.title}</h3>
                  <p className="mt-2 text-base text-[color:var(--color-text-muted)]">
                    {v.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </FluidSection>
    </>
  );
}
