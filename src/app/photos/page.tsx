import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { PhotosAuditClient, type Photo, type ProductPair } from "./PhotosAuditClient";

export const metadata: Metadata = {
  title: "photos · sudo.supply",
  robots: { index: false, follow: false },
};

async function listImages(dirRel: string): Promise<{ file: string; bytes: number }[]> {
  const dir = path.join(process.cwd(), "public", ...dirRel.split("/"));
  try {
    const names = await fs.readdir(dir);
    const out = await Promise.all(
      names
        .filter((n) => /\.(jpe?g|png|webp|gif)$/i.test(n))
        .map(async (file) => {
          const s = await fs.stat(path.join(dir, file));
          return { file, bytes: s.size };
        }),
    );
    return out.sort((a, b) => a.file.localeCompare(b.file));
  } catch {
    return [];
  }
}

async function loadProducts(): Promise<ProductPair[]> {
  const list = await listImages("images/products");
  const byBase = new Map<string, ProductPair>();
  for (const { file, bytes } of list) {
    const stem = file.replace(/\.(jpe?g|png|webp|gif)$/i, "");
    const isDark = stem.endsWith("-dark");
    const base = isDark ? stem.slice(0, -"-dark".length) : stem;
    const pair = byBase.get(base) ?? { base };
    const photo: Photo = { file, url: `/images/products/${file}`, bytes };
    if (isDark) pair.dark = photo;
    else pair.original = photo;
    byBase.set(base, pair);
  }
  return Array.from(byBase.values()).sort((a, b) => a.base.localeCompare(b.base));
}

async function loadUploads(): Promise<Photo[]> {
  const list = await listImages("images/uploads");
  return list.map(({ file, bytes }) => ({ file, url: `/images/uploads/${file}`, bytes }));
}

export default async function PhotosAuditPage() {
  const [products, uploads] = await Promise.all([loadProducts(), loadUploads()]);
  return <PhotosAuditClient products={products} uploads={uploads} />;
}
