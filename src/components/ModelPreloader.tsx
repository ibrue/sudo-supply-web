// Server component (no "use client") so these hints render in the initial HTML
// and Next hoists them into <head>.
//
// The turntable sprites are now the instant-paint content for cards/hero, so
// they get a HIGH-priority preload when they're above the fold (pass
// `heroSprite`) and a LOW-priority prefetch otherwise (warms the cache so the
// same sprites are instant when navigating home → shop → product).
//
// The GLB + HDR feed only the *live* viewer, which mounts lazily (idle/hover),
// so they stay LOW priority (prefetch) — a high-priority preload there would
// contend with the sprite/poster the user actually sees first. The preconnect
// opens the gstatic connection early for model-viewer's one-time Draco decoder
// fetch on the first live activation.

const SPRITES = [
  "/turntables/macropad-white.webp",
  "/turntables/macropad-black.webp",
  "/turntables/pcb.webp",
  "/turntables/keycaps.webp",
];

export function ModelPreloader({ heroSprite }: { heroSprite?: string } = {}) {
  return (
    <>
      {heroSprite && (
        <link rel="preload" as="image" href={heroSprite} fetchPriority="high" />
      )}
      {SPRITES.filter((s) => s !== heroSprite).map((s) => (
        <link key={s} rel="prefetch" as="image" href={s} />
      ))}
      <link rel="prefetch" href="/models/sudo-macropad.glb" as="fetch" crossOrigin="anonymous" />
      <link rel="prefetch" href="/hdri/studio.hdr" as="fetch" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}
