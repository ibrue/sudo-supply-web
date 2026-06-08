import { createServiceClient } from "./supabase";

export type ProductStatus = "draft" | "published";

export interface Product {
  slug: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  inStock: boolean;
  stockCount: number;
  /** Lead time when product is in stock (default: "3–5 days"). */
  leadTime: string;
  /** Lead time when out of stock — used to capture orders before the next batch. */
  preorderLeadTime?: string;
  image: string;
  images: string[];
  specs: Record<string, string>;
  shopifyVariantId?: string;
  soldCount?: number;
  status: ProductStatus;
}

/** Static fallback products — used when Supabase is unavailable */
export const staticProducts: Product[] = [
  {
    slug: "sudo-macro-pad-v1",
    name: "sudo macro pad v1",
    price: 40.0,
    description:
      "4-button MX hot-swap macro pad. Approve AI agent actions across Claude, ChatGPT, and Grok.",
    longDescription:
      "The sudo macro pad v1 is a 4-button mechanical macro pad designed for developers who work with AI agents daily. Each key is MX hot-swap compatible, so you can use your favorite switches. Map the four keys to approve, reject, continue, or cancel, and take physical control of your AI workflow. Open-source hardware and firmware.",
    inStock: true,
    stockCount: 0,
    leadTime: "3–5 days",
    preorderLeadTime: "2–3 weeks",
    // Macropad gallery: assembled-product shots. Studio-style shots
    // (rasta hero, in-hand, black/white angle, four-lineup, bottom detail)
    // are bg-removed onto #141414 so they sit cleanly in card UI. The
    // lifestyle slot keeps its original desk context — masking it strips
    // the desk under the cable and leaves the cable floating awkwardly
    // through black space.
    // Macropad gallery: one of each role, no doubles.
    //   1. hero-lineup       — shows all 4 colorways at once (the overview)
    //   2. hero-rasta-angle  — single-pad colour hero
    //   3. side-profile-black — case silhouette / thickness
    //   4. lifestyle-desk-white — in-context on a real desk
    image: "/images/products/hero-lineup.jpeg",
    images: [
      "/images/products/hero-lineup.jpeg",
      "/images/products/hero-rasta-angle-dark.jpeg",
      "/images/products/side-profile-black.jpeg",
      "/images/products/lifestyle-desk-white.jpeg",
    ],
    specs: {
      keys: "4× MX hot-swap",
      interface: "USB-C",
      firmware: "QMK / VIA",
      case: "3D-printed PLA",
      pcb: "open-source (KiCad)",
      dimensions: "68 × 68 × 22 mm",
      weight: "~120g",
      compatibility: "Windows / macOS / Linux",
    },
    status: "published",
  },
  {
    slug: "sudo-pcb",
    name: "sudo pcb",
    price: 25.0,
    description:
      "Bare 4-key PCB for the sudo macro pad. Hot-swap MX, USB-C, QMK-flashable.",
    longDescription:
      "Just the PCB, for builders who want to bring their own case, switches, and keycaps. 4× MX hot-swap sockets, USB-C, RP2040-class controller, and the same QMK/VIA firmware that ships on the assembled macro pad. KiCad sources are open and on GitHub.",
    inStock: true,
    stockCount: 0,
    leadTime: "3–5 days",
    preorderLeadTime: "2–3 weeks",
    // PCB gallery: only PCB-isolated shots, all processed through
    // scripts/bg-remove-photos.py for consistent #141414 background.
    // PCB gallery: front (sockets), back (chips with brand silk), one angle.
    // pcb-back-dark and pcb-chipside both showed the chip side — keeping the
    // chipside one since the "sudo.supply" silkscreen is the brand moment.
    image: "/images/products/pcb-front-dark.jpeg",
    images: [
      "/images/products/pcb-front-dark.jpeg",
      "/images/products/pcb-chipside.jpeg",
      "/images/products/pcb-angle.jpeg",
    ],
    specs: {
      switches: "4× MX hot-swap sockets",
      interface: "USB-C",
      firmware: "QMK / VIA",
      sources: "open (KiCad)",
      compatibility: "Windows / macOS / Linux",
    },
    status: "published",
  },
  {
    slug: "sudo-keycaps",
    name: "sudo keycaps",
    price: 12.0,
    description: "Custom PBT keycaps for the sudo macro pad. Terminal-inspired legends.",
    longDescription:
      "A set of custom PBT dye-sub keycaps designed for the sudo macro pad. Each cap features terminal-inspired legends: [Y], [N], [→], [×]. Cherry-profile, compatible with any MX-style switch.",
    inStock: false,
    stockCount: 0,
    leadTime: "2–3 weeks",
    preorderLeadTime: "2–3 weeks",
    // Keycaps gallery: just the two card colorway shots that read cleanly
    // as keycap close-ups. The rasta-perspective and four-pad lineup were
    // dropped because they read as macropad-product photos at thumb size,
    // not keycap set photos.
    image: "/images/products/card-white-dark.jpeg",
    images: [
      "/images/products/card-white-dark.jpeg",
      "/images/products/card-black-dark.jpeg",
    ],
    specs: {
      material: "PBT",
      legends: "dye-sublimated",
      profile: "Cherry",
      compatibility: "MX-style switches",
      set_contents: "4 keycaps",
    },
    status: "published",
  },
];

function dbRowToProduct(row: Record<string, unknown>): Product {
  const images = Array.isArray(row.images) ? (row.images as string[]) : [];
  return {
    slug: row.slug as string,
    name: row.name as string,
    price: Number(row.price),
    description: row.description as string,
    longDescription: (row.long_description as string) || "",
    inStock: row.in_stock as boolean,
    stockCount: (row.stock_count as number) || 0,
    leadTime: (row.lead_time as string) || "",
    image: (row.image as string) || images[0] || "/images/products/hero-lineup.jpeg",
    images: images.length > 0 ? images : [(row.image as string) || "/images/products/hero-lineup.jpeg"],
    specs: (row.specs as Record<string, string>) || {},
    shopifyVariantId: (row.shopify_variant_id as string) || undefined,
    soldCount: (row.sold_count as number) || 0,
    status: (row.status as ProductStatus) || "published",
  };
}

/** Fetch all published products from Supabase, falling back to static data */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticProducts;
    }
    return data.map(dbRowToProduct);
  } catch {
    return staticProducts;
  }
}

/** Fetch ALL products including drafts (admin only) */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticProducts;
    }
    return data.map(dbRowToProduct);
  } catch {
    return staticProducts;
  }
}

/** Fetch a single product by slug (any status — for admin preview) */
export async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return staticProducts.find((p) => p.slug === slug);
    }
    return dbRowToProduct(data);
  } catch {
    return staticProducts.find((p) => p.slug === slug);
  }
}

/** Synchronous access to static products (for generateStaticParams, tests, etc.) */
export const products = staticProducts;
