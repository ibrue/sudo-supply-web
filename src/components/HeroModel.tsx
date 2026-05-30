"use client";

import { ProductModelViewer, type RGB } from "./ProductModelViewer";
import { HERO_TURNTABLE } from "@/lib/turntables";

interface Props {
  src: string;
  iosSrc?: string;
  poster: string;
  alt: string;
  caseColor: RGB;
  keycapColors: [RGB, RGB, RGB, RGB];
}

export function HeroModel({ src, iosSrc, poster, alt, caseColor, keycapColors }: Props) {
  return (
    <ProductModelViewer
      src={src}
      iosSrc={iosSrc}
      poster={poster}
      alt={alt}
      className="w-full h-full"
      caseColor={caseColor}
      keycapColors={keycapColors}
      turntable={HERO_TURNTABLE}
    />
  );
}
