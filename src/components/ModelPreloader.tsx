// Server component (no "use client") so the returned <link> elements are
// rendered in the initial HTML and Next.js hoists them into <head>. That
// means the browser starts downloading the GLB + HDR at the first byte of
// the document — before React hydrates, before the model-viewer module
// loads, and before any component mounts. By the time the viewer is ready
// to display the model the geometry is usually already in cache.
//
// Scoped to the four routes that actually render a 3D viewer (homepage,
// shop, product, cart) so we don't burn 800 KB of bandwidth on /about,
// /sign-in, etc.

export function ModelPreloader() {
  return (
    <>
      <link
        rel="preload"
        href="/models/sudo-macropad.glb"
        as="fetch"
        type="model/gltf-binary"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/hdri/studio.hdr"
        as="fetch"
        type="image/vnd.radiance"
        crossOrigin="anonymous"
      />
    </>
  );
}
