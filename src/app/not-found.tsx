import { Button, Container, FluidSection } from "@fourplusweb/ui";

export default function NotFound() {
  return (
    <FluidSection size="xl">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <p className="font-display text-display">404</p>
          <h1 className="font-display text-2xl">Страницата не съществува</h1>
          <p className="text-base text-[color:var(--color-text-muted)]">
            Търсеният адрес не беше намерен. Върнете се в началото и опитайте отново.
          </p>
          <a href="/" className="inline-block">
            <Button size="lg">Към началото</Button>
          </a>
        </div>
      </Container>
    </FluidSection>
  );
}
