"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { ProductGallery } from "./ProductGallery";
import { hexToRgb, type RGB } from "@/components/ProductModelViewer";
import { SocialProofBadge } from "@/components/SocialProofBadge";
import { CASE_RENDER, CASE_SWATCH, KEYCAP_RENDER, KEYCAP_SWATCH } from "@/lib/productColors";
import type { Turntable } from "@/lib/turntables";

const CASE_OPTIONS = [
  { id: "white", label: "White", swatch: CASE_SWATCH.white, color: CASE_RENDER.white },
  { id: "black", label: "Black", swatch: CASE_SWATCH.black, color: CASE_RENDER.black },
] as const;

type CaseId = (typeof CASE_OPTIONS)[number]["id"];

const KEYCAP_OPTIONS = [
  {
    id: "white",
    label: "White",
    colors: [KEYCAP_RENDER.white, KEYCAP_RENDER.white, KEYCAP_RENDER.white, KEYCAP_RENDER.white] as [string, string, string, string],
    swatchPalette: KEYCAP_SWATCH.white,
  },
  {
    id: "black",
    label: "Black",
    colors: [KEYCAP_RENDER.black, KEYCAP_RENDER.black, KEYCAP_RENDER.black, KEYCAP_RENDER.black] as [string, string, string, string],
    swatchPalette: KEYCAP_SWATCH.black,
  },
  {
    id: "rasta",
    label: "Traffic light",
    colors: KEYCAP_RENDER.traffic,
    swatchPalette: KEYCAP_SWATCH.traffic,
  },
] as const;

type KeycapId = (typeof KEYCAP_OPTIONS)[number]["id"];

interface Props {
  product: Product;
  galleryImages: string[];
  modelSrc?: string;
  modelIosSrc?: string;
  /** Which variant pickers to render (and which axes get stamped onto the
   *  cart-line slug). Macro pad = ["case","keycaps"], keycap set = ["keycaps"],
   *  bare PCB = []. */
  variantKinds?: ("case" | "keycaps")[];
  /** Forwarded to the gallery to hide non-applicable meshes (PCB-only view).
   *  Plain string so it survives the server → client component boundary;
   *  compiled to RegExp inside the viewer. */
  hideMaterialsMatching?: string;
  /** Pre-rendered turntable for the default config, looped instantly before
   *  the live model loads. */
  turntable?: Turntable;
}

export function ProductConfigurator({
  product,
  galleryImages,
  modelSrc,
  modelIosSrc,
  variantKinds = [],
  hideMaterialsMatching,
  turntable,
}: Props) {
  const showCase = variantKinds.includes("case");
  const showKeycaps = variantKinds.includes("keycaps");
  const { addItem } = useCart();
  const [caseId, setCaseId] = useState<CaseId>("white");
  const [keycapId, setKeycapId] = useState<KeycapId>("rasta");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const caseOption = CASE_OPTIONS.find((c) => c.id === caseId)!;
  const keycapOption = KEYCAP_OPTIONS.find((k) => k.id === keycapId)!;

  const caseColor = useMemo<RGB>(() => hexToRgb(caseOption.color), [caseOption]);
  const keycapColors = useMemo<[RGB, RGB, RGB, RGB]>(
    () => keycapOption.colors.map(hexToRgb) as [RGB, RGB, RGB, RGB],
    [keycapOption]
  );

  const variantLabel = [
    showCase ? `${caseOption.label} case` : null,
    showKeycaps ? `${keycapOption.label} keys` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const variantSlug = [showCase ? caseId : null, showKeycaps ? keycapId : null]
    .filter(Boolean)
    .join("-");

  const shipEstimate = product.inStock
    ? product.leadTime || "3–5 days"
    : product.preorderLeadTime || product.leadTime || "2–3 weeks";

  const handleAdd = () => {
    // Stamp the configured variant onto a product copy so the cart line shows
    // each combo as its own line. Products with no variants pass through.
    const configured: Product = variantSlug
      ? {
          ...product,
          slug: `${product.slug}--${variantSlug}`,
          name: `${product.name} · ${variantLabel}`,
        }
      : product;
    addItem(configured, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Gallery — left */}
      <ProductGallery
        images={galleryImages}
        alt={product.name}
        modelSrc={modelSrc}
        modelIosSrc={modelIosSrc}
        caseColor={showCase ? caseColor : undefined}
        keycapColors={showKeycaps ? keycapColors : undefined}
        hideMaterialsMatching={hideMaterialsMatching}
        turntable={turntable}
      />

      {/* Details + configurator + buy — right */}
      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-mono">
          {product.inStock
            ? `In stock · ships in ${shipEstimate}`
            : `Backorder · ships in ${shipEstimate}`}
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {product.name}
        </h1>
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold tabular-nums">${product.price.toFixed(2)}</span>
          <span className="text-sm text-text-muted">USD · free US shipping over $100</span>
        </div>

        <SocialProofBadge slug={product.slug} soldCount={product.soldCount} />

        <p className="text-text-muted leading-relaxed mt-4 mb-8">{product.longDescription}</p>

        {/* Configurator — render only requested variant pickers */}
        {(showCase || showKeycaps) && (
        <div className="space-y-5 mb-6">
          {showCase && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-3 text-text-muted font-mono">
              [ case ] · <span className="text-accent">{caseOption.label}</span>
            </p>
            <div className="flex gap-2">
              {CASE_OPTIONS.map((opt) => {
                const active = opt.id === caseId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCaseId(opt.id)}
                    aria-pressed={active}
                    aria-label={`Case: ${opt.label}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                      active ? "border-accent bg-accent/10" : "border-border hover:border-white/30"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ background: opt.swatch }}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          )}

          {showKeycaps && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-3 text-text-muted font-mono">
              [ keycaps ] · <span className="text-accent">{keycapOption.label}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {KEYCAP_OPTIONS.map((opt) => {
                const active = opt.id === keycapId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setKeycapId(opt.id)}
                    aria-pressed={active}
                    aria-label={`Keycaps: ${opt.label}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                      active ? "border-accent bg-accent/10" : "border-border hover:border-white/30"
                    }`}
                  >
                    <span className="flex">
                      {opt.swatchPalette.map((hex, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-5 border border-border first:rounded-l-full last:rounded-r-full"
                          style={{ background: hex, marginLeft: i === 0 ? 0 : -1 }}
                        />
                      ))}
                    </span>
                    <span className="text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          )}
        </div>
        )}

        {/* Quantity + Add to bag. Stepper buttons land at 44px on mobile
            (Apple HIG minimum) and shrink to 32px at sm+. */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 rounded-full border border-border px-1.5 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-11 h-11 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors text-xl sm:text-lg leading-none"
              aria-label="decrease quantity"
            >
              −
            </button>
            <span className="font-mono text-base tabular-nums w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-11 h-11 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors text-xl sm:text-lg leading-none"
              aria-label="increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 px-5 sm:px-6 py-3.5 sm:py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
          >
            {added ? "Added ✓" : `Add to bag · $${(product.price * quantity).toFixed(2)}`}
          </button>
        </div>

        <p className="text-text-muted text-xs font-mono mb-2">
          $ sudo apt install {product.slug}
          {showCase ? ` --case=${caseId}` : ""}
          {showKeycaps ? ` --keys=${keycapId}` : ""}
          {quantity > 1 ? ` --qty=${quantity}` : ""}
        </p>

        {!product.inStock && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm mt-2">
            <p className="text-accent font-mono text-xs uppercase tracking-wider mb-1">
              [ preorder ]
            </p>
            <p className="text-text">
              Current batch is sold out. Your order is reserved for the next batch, charged now, ships in <span className="text-accent font-semibold">{shipEstimate}</span>.
            </p>
          </div>
        )}

        {quantity >= 5 && (
          <Link href="/bulk" className="text-accent text-sm hover:underline mt-3">
            Ordering {quantity}+? Check bulk pricing →
          </Link>
        )}
      </div>
    </div>
  );
}
