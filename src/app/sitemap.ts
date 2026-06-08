import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://sudo.supply");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/download`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/bulk`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/try`, changeFrequency: "monthly", priority: 0.6 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // If the product source is unavailable at build time, ship the static
    // routes rather than failing the whole sitemap.
  }

  return [...staticRoutes, ...productRoutes];
}
