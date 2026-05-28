// Cart lines store the configured product with a stamped slug like
// `sudo-macro-pad-v1--black-white` or `sudo-keycaps--rasta`. To rebuild the
// 3D thumbnail we need to recover (a) the base product slug, (b) the case
// id, and (c) the keycap id. This module is the single place that knows the
// slug format, so ProductConfigurator (writer) and the cart thumb (reader)
// can't drift.

import { CASE_RENDER, KEYCAP_RENDER, hexToRgb, type RGB } from "./productColors";

export type CaseId = "white" | "black";
export type KeycapId = "white" | "black" | "rasta";

const CASE_IDS: readonly CaseId[] = ["white", "black"];
const KEYCAP_IDS: readonly KeycapId[] = ["white", "black", "rasta"];

const isCaseId = (s: string): s is CaseId => (CASE_IDS as readonly string[]).includes(s);
const isKeycapId = (s: string): s is KeycapId => (KEYCAP_IDS as readonly string[]).includes(s);

export interface ParsedVariant {
  baseSlug: string;
  caseId?: CaseId;
  keycapId?: KeycapId;
}

/** Split a cart-line slug into its base product slug and case/keycap ids. */
export function parseVariantSlug(slug: string): ParsedVariant {
  const [baseSlug, variant] = slug.split("--", 2);
  if (!variant) return { baseSlug };

  // Order matters: ProductConfigurator emits `${caseId}-${keycapId}` for the
  // macropad (e.g. "black-rasta") and `${keycapId}` for the keycap set.
  const tokens = variant.split("-");
  const result: ParsedVariant = { baseSlug };

  if (tokens.length === 2 && isCaseId(tokens[0]) && isKeycapId(tokens[1])) {
    result.caseId = tokens[0];
    result.keycapId = tokens[1];
  } else if (tokens.length === 1 && isKeycapId(tokens[0])) {
    result.keycapId = tokens[0];
  }
  return result;
}

/** Resolve the 3D case color for a parsed variant (defaults to white). */
export function caseRgbFor(v: ParsedVariant): RGB {
  return hexToRgb(CASE_RENDER[v.caseId ?? "white"]);
}

/** Resolve the 4 per-cap colors for a parsed variant (defaults to traffic). */
export function keycapRgbsFor(v: ParsedVariant): [RGB, RGB, RGB, RGB] {
  const id = v.keycapId ?? "rasta";
  if (id === "traffic" as KeycapId) {
    // exhaustive guard — keep TS happy if someone adds a new keycap id
    return KEYCAP_RENDER.traffic.map(hexToRgb) as [RGB, RGB, RGB, RGB];
  }
  if (id === "rasta") {
    return KEYCAP_RENDER.traffic.map(hexToRgb) as [RGB, RGB, RGB, RGB];
  }
  const solid = hexToRgb(KEYCAP_RENDER[id]);
  return [solid, solid, solid, solid];
}
