// Server component (no "use client") so these hints render in the initial HTML
// and Next hoists them into <head>.
//
// Deliberately uses rel="prefetch" (LOW priority), not rel="preload" (HIGH
// priority): the 3D viewer is mounted lazily (on idle/hover), so the model and
// environment are NOT on the critical path for first paint. A high-priority
// preload would make the 695 KB GLB + 103 KB HDR contend with the poster image
// (the LCP element) and actually slow the page down. Prefetch instead fills
// idle bandwidth after paint, so by the time a viewer activates the bytes are
// already warm in the HTTP cache — without ever competing with the content the
// user sees first.
//
// The preconnect opens the gstatic connection early so model-viewer's one-time
// Draco decoder fetch (DNS + TLS) is cheap on the first 3D activation.

export function ModelPreloader() {
  return (
    <>
      <link rel="prefetch" href="/models/sudo-macropad.glb" as="fetch" crossOrigin="anonymous" />
      <link rel="prefetch" href="/hdri/studio.hdr" as="fetch" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}
