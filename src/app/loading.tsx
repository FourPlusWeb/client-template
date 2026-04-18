export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Зареждане"
      className="grid min-h-[50dvh] place-items-center"
    >
      <div className="size-10 animate-spin rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-primary)]" />
    </div>
  );
}
