"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";
import { resolveImageUrl } from "@/lib/imageUrl";
import { ProductModelViewer, hexToRgb, type RGB } from "@/components/ProductModelViewer";
import { CASE_RENDER, KEYCAP_RENDER } from "@/lib/productColors";
import { PRODUCT_TURNTABLE } from "@/lib/turntables";

interface Props {
  product: Product;
  /** Optional 1-based index to render as a numbered tag ("01 / 03"). */
  index?: number;
  total?: number;
  /** If set, the card renders a non-interactive 3D thumbnail instead of the
   *  product photo. The same GLB powers all three cards; per-product hides
   *  control which meshes are visible. */
  modelSrc?: string;
  hideMaterialsMatching?: string;
}

// Defaults match the product-page configurator presets so the cards preview
// the same combo a buyer lands on by default.
const DEFAULT_CASE: RGB = hexToRgb(CASE_RENDER.white);
const DEFAULT_KEYCAPS: [RGB, RGB, RGB, RGB] = KEYCAP_RENDER.traffic.map(hexToRgb) as [
  RGB,
  RGB,
  RGB,
  RGB,
];

export function ProductCard({ product, index, total, modelSrc, hideMaterialsMatching }: Props) {
  const src = resolveImageUrl(product.image);
  const turntable = PRODUCT_TURNTABLE[product.slug];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-3xl overflow-hidden border border-border hover:border-accent/40 transition-colors bg-surface"
    >
      <div className="relative aspect-square bg-surface">
        {modelSrc ? (
          // Card thumbnail: crisp still on first paint (instant), then the live
          // model auto-mounts on idle once in view and starts rotating — no
          // hover needed, so there's no "waiting for it to start" lag. (The
          // still already gave instant paint; model-viewer pauses its render
          // loop when scrolled off-screen, so idle activation stays light.)
          // The model-viewer element is pointer-events:none so clicks still
          // navigate the card link.
          <div className="absolute inset-0">
            <ProductModelViewer
              src={modelSrc}
              poster={src}
              alt={product.name}
              className="w-full h-full"
              caseColor={DEFAULT_CASE}
              keycapColors={DEFAULT_KEYCAPS}
              hideMaterialsMatching={hideMaterialsMatching}
              cameraControls={false}
              ar={false}
              autoRotate
              activation="idle"
              turntable={turntable}
            />
          </div>
        ) : (
          <div className="relative w-full h-full p-6">
            <Image
              src={src}
              alt={product.name}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
          </div>
        )}

        {index !== undefined && total !== undefined && (
          <p className="absolute top-4 left-4 z-10 text-[10px] font-mono text-text-muted tracking-[0.25em]">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        )}
      </div>
      <div className="p-5 flex items-center justify-between border-t border-border">
        <div>
          <p className="text-xs font-mono mb-1 text-accent">
            {product.inStock ? "in stock" : "out of stock"}
          </p>
          <p className="font-semibold text-base text-white group-hover:text-accent transition-colors">
            {product.name}
          </p>
        </div>
        <span className="font-mono text-sm text-text-muted tabular-nums">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
