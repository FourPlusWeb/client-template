// Intentionally a no-op component.
//
// We previously used IntersectionObserver to toggle a `data-revealed`
// attribute on every `<main> > <section>` for a fade/rise entry. That
// approach conflicted with React's hydration check (mutating SSR-rendered
// attributes from a client effect triggered warnings on navigation).
//
// The theme tokens (--duration-*, --ease-*) still drive hover/active motion
// inside @fourplusweb/ui components; scroll-triggered reveal can be added
// later via CSS `animation-timeline: view()` once browser support broadens.
export function ScrollReveal() {
  return null;
}
