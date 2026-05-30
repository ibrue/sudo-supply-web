// Pre-rendered turntable filmstrips (see scripts/render-turntables.mjs). Each
// is a vertical strip of 37 frames; the viewer shows only frame 0 as a still
// loader (rendered at 0° to match the live model's start pose) and crossfades
// to the live WebGL model, which does the actual rotating. Shared so cards,
// the hero, and the product gallery reference the same assets.

export interface Turntable {
  src: string;
  frames: number;
  durationMs?: number;
}

const FRAMES = 36;

/** The turntable shown for a product's default configuration (cards + the
 *  product page's initial state). The hero uses a different case colour, so it
 *  passes its sprite explicitly rather than going through this map. */
export const PRODUCT_TURNTABLE: Record<string, Turntable | undefined> = {
  "sudo-macro-pad-v1": { src: "/turntables/macropad-white.webp", frames: FRAMES },
  "sudo-pcb": { src: "/turntables/pcb.webp", frames: FRAMES },
  "sudo-keycaps": { src: "/turntables/keycaps.webp", frames: FRAMES },
};

/** Black-case macropad spin used by the homepage hero. */
export const HERO_TURNTABLE: Turntable = {
  src: "/turntables/macropad-black.webp",
  frames: FRAMES,
  durationMs: 8000,
};
