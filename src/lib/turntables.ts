// Pre-rendered turntable sprites (see scripts/render-turntables.mjs). Each is a
// vertical filmstrip of 37 frames (36 around 360° + 1 duplicate of frame 0 for
// a seamless CSS steps() loop). Shared so cards, the hero, and the product
// gallery all reference the same assets and frame count.

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
