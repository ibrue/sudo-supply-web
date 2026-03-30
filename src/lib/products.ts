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
  leadTime: string;
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
    price: 29.0,
    description:
      "4-button MX hot-swap macro pad. Approve AI agent actions across Claude, ChatGPT, and Grok.",
    longDescription:
      "The sudo macro pad v1 is a 4-button mechanical macro pad designed for developers who work with AI agents daily. Each key is MX hot-swap compatible, so you can use your favorite switches. Map the four keys to approve, reject, continue, or cancel — and take physical control of your AI workflow. Open-source hardware and firmware.",
    inStock: true,
    stockCount: 0,
    leadTime: "",
    image: "/images/macro-pad-placeholder.svg",
    images: ["/images/macro-pad-placeholder.svg"],
    specs: {
      keys: "4× MX hot-swap",
      interface: "USB-C",
      firmware: "QMK / VIA",
      case: "matte black aluminum",
      pcb: "open-source (KiCad)",
      dimensions: "68 × 68 × 22 mm",
      weight: "~120g",
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
    leadTime: "2-3 weeks",
    image: "/images/keycaps-placeholder.svg",
    images: ["/images/keycaps-placeholder.svg"],
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
    image: (row.image as string) || images[0] || "/images/macro-pad-placeholder.svg",
    images: images.length > 0 ? images : [(row.image as string) || "/images/macro-pad-placeholder.svg"],
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
