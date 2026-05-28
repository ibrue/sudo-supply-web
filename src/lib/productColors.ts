export type RGB = [number, number, number];

/** Convert "#RRGGBB" (or "#RGB") to a 0..1 normalized RGB triple. Lives here
 *  rather than in ProductModelViewer so server components can use it without
 *  pulling in the "use client" boundary. */
export function hexToRgb(hex: string): RGB {
  const m = hex.replace("#", "");
  const v =
    m.length === 3
      ? m.split("").map((c) => parseInt(c + c, 16))
      : [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
  return [v[0] / 255, v[1] / 255, v[2] / 255];
}

// Single source of truth for the case + keycap render colors used by the 3D
// configurator, the homepage hero, and the shop card thumbnails.
//
// `render` values are what the GLB material picks up — these are deliberately
// darker than the picker `swatch` values because model-viewer's neutral PBR
// + neutral environment + roughness 0.7 bounces a lot of light off the
// keycap shells and was washing pure-white-ish source colors out to nearly
// #FFF on screen. Knock them down ~25% in lightness here and the same
// material reads as a credible off-white instead of a blown-out slab.

export const CASE_RENDER = {
  white: "#928E86",
  black: "#1A1A1A",
} as const;

// What the case-picker pills display — a little brighter than the rendered
// color so the swatch reads as recognizably white in the UI.
export const CASE_SWATCH = {
  white: "#D8D4CB",
  black: "#1A1A1A",
} as const;

export const KEYCAP_RENDER = {
  black: "#1A1A1A",
  white: "#928E86",
  // Traffic-light combo: dark / red / amber / green, ordered along the board.
  // Slightly desaturated and dimmed vs. neon so they read as physical PBT
  // dye-sub keycaps under PBR rather than solid CSS swatches.
  traffic: ["#1A1A1A", "#A82D20", "#B58A17", "#2F7C53"] as [
    string,
    string,
    string,
    string,
  ],
} as const;

export const KEYCAP_SWATCH = {
  black: ["#1A1A1A"],
  white: ["#D8D4CB"],
  traffic: ["#1A1A1A", "#C73525", "#D9A91D", "#3C9265"],
} as const;
