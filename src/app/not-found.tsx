import { Button, Container, FluidSection } from "@fourplusweb/ui";

export default function NotFound() {
  return (
    <FluidSection role="hero">
      <Container>
        <div className="mx-auto flex max-w-[var(--container-sm)] flex-col items-center gap-6 text-center">
          <p className="text-hero">404</p>
          <h1 className="text-h2">Страницата липсва</h1>
          <p className="text-body text-[color:var(--color-text-muted)]">
            Адресът не е намерен. Върнете се към началото и продължете от една
            от основните секции на сайта.
          </p>
          <a href="/" className="inline-flex">
            <Button size="lg">
              Към началото <span data-arrow aria-hidden>→</span>
            </Button>
          </a>
        </div>
      </Container>
    </FluidSection>
  );
}
