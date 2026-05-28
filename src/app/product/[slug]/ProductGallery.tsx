"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductModelViewer, type RGB } from "@/components/ProductModelViewer";

interface Props {
  images: string[];
  alt: string;
  /** Optional 3D model — if provided, exposes a "3D" toggle pill on the gallery. */
  modelSrc?: string;
  modelIosSrc?: string;
  /** When set, the gallery defaults to the 3D view and respects these colors. */
  caseColor?: RGB;
  keycapColors?: [RGB, RGB, RGB, RGB];
  /** Forwarded to the viewer to hide non-applicable meshes (e.g. case+keycaps
   *  on the PCB-only product so the macropad GLB renders as just the PCB).
   *  Plain string so it survives server → client serialization. */
  hideMaterialsMatching?: string;
}

export function ProductGallery({
  images,
  alt,
  modelSrc,
  modelIosSrc,
  caseColor,
  keycapColors,
  hideMaterialsMatching,
}: Props) {
  const [active, setActive] = useState(0);
  const [showModel, setShowModel] = useState(Boolean(modelSrc));

  if (!images.length) return null;
  const main = images[Math.min(active, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-surface">
        {showModel && modelSrc ? (
          <ProductModelViewer
            src={modelSrc}
            iosSrc={modelIosSrc}
            poster={main}
            alt={alt}
            className="w-full h-full"
            caseColor={caseColor}
            keycapColors={keycapColors}
            hideMaterialsMatching={hideMaterialsMatching}
          />
        ) : (
          <div className="relative w-full h-full p-8">
            <Image
              src={main}
              alt={alt}
              fill
              className="object-contain p-2"
              priority
              unoptimized
            />
          </div>
        )}

        {modelSrc && (
          <button
            type="button"
            onClick={() => setShowModel((v) => !v)}
            className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-full border backdrop-blur transition-colors ${
              showModel
                ? "bg-accent text-black border-accent"
                : "bg-bg/70 text-white border-border hover:border-accent"
            }`}
            aria-pressed={showModel}
          >
            {showModel ? "Photo" : "3D ↻"}
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.slice(0, 6).map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => {
                setActive(i);
                setShowModel(false);
              }}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square rounded-xl overflow-hidden border bg-surface p-2 transition-colors ${
                i === active && !showModel
                  ? "border-accent"
                  : "border-border hover:border-white/30"
              }`}
            >
              <Image src={src} alt="" fill className="object-contain p-1" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
