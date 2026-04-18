import { Button, Container, FluidSection } from "@fourplusweb/ui";

export default function NotFound() {
  return (
    <FluidSection size="xl">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <p className="font-display text-display">404</p>
          <h1 className="font-display text-2xl">Страницата липсва</h1>
          <p className="text-base leading-7 text-[color:var(--color-text-muted)]">
            Адресът не е намерен. Върнете се към началото и продължете от една
            от основните секции на сайта.
          </p>
          <a href="/" className="inline-flex">
            <Button size="lg">Към началото</Button>
          </a>
        </div>
      </Container>
    </FluidSection>
  );
}
