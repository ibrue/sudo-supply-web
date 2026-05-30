"use client";

import Image from "next/image";
import { Product } from "@/lib/products";
import { resolveImageUrl } from "@/lib/imageUrl";
import { ProductModelViewer } from "@/components/ProductModelViewer";
import { parseVariantSlug, caseRgbFor, keycapRgbsFor } from "@/lib/variantSlug";

// Per-product GLB hide pattern, shared with the shop + product pages so all
// surfaces render the same view of the same model.
const MODEL_SRC = "/models/sudo-macropad.glb";
const HIDE_MATERIALS: Record<string, string | undefined> = {
  "sudo-macro-pad-v1": undefined,
  "sudo-pcb": "^(CASE|KEYCAP|SCREW)",
  "sudo-keycaps": "^(CASE|SCREW|SUBSTRATE|SILKSCREEN|METAL|COMPONENT|PCB)",
};

interface Props {
  product: Product;
  className?: string;
}

/** Small non-interactive thumbnail used by the cart. Renders the configured
 *  3D model (case + keycap colours derived from the cart-line slug) so what's
 *  in the bag matches what the buyer configured on the product page. Falls
 *  back to the static product photo for any base slug we don't have a model
 *  for. */
export function ProductThumb({ product, className = "w-20 h-20" }: Props) {
  const parsed = parseVariantSlug(product.slug);
  const hide = HIDE_MATERIALS[parsed.baseSlug];
  const hasModel = Object.prototype.hasOwnProperty.call(HIDE_MATERIALS, parsed.baseSlug);

  if (!hasModel) {
    return (
      <div className={`relative ${className} rounded-2xl overflow-hidden border border-border bg-surface p-1`}>
        <Image
          src={resolveImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-contain p-1"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-2xl overflow-hidden border border-border bg-surface shrink-0`}>
      {/* Wrapper keeps pointer events so hover can activate the viewer; the
          model-viewer element itself is pointer-events:none (non-interactive
          viewer) so it never steals taps from the cart row. */}
      <div className="absolute inset-0">
        <ProductModelViewer
          src={MODEL_SRC}
          poster={resolveImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full"
          caseColor={caseRgbFor(parsed)}
          keycapColors={keycapRgbsFor(parsed)}
          hideMaterialsMatching={hide}
          cameraControls={false}
          ar={false}
          autoRotate
          activation="hover"
        />
      </div>
    </div>
  );
}
