"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          poster?: string;
          ar?: boolean | "";
          "ar-modes"?: string;
          "auto-rotate"?: boolean | "";
          "auto-rotate-delay"?: number | string;
          "rotation-per-second"?: string;
          "camera-controls"?: boolean;
          "interaction-prompt"?: "auto" | "when-focused" | "none";
          "shadow-intensity"?: number | string;
          "shadow-softness"?: number | string;
          exposure?: number | string;
          "tone-mapping"?: "auto" | "aces" | "agx" | "commerce" | "neutral";
          "environment-image"?: string;
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "manual";
          "animation-name"?: string;
          "animation-crossfade-duration"?: number | string;
        },
        HTMLElement
      >;
    }
  }
}

// Re-exported from the colour module so consumers can keep importing from
// here while server components import the same helpers directly from
// `@/lib/productColors` (avoiding the "use client" boundary).
import { hexToRgb, type RGB } from "@/lib/productColors";
export { hexToRgb, type RGB };

/**
 * Controls WHEN the heavy WebGL <model-viewer> is mounted. Until activation
 * the component renders only the poster <img>, so initial paint costs the same
 * as any other image on the page (no 1 MB three.js parse, no WebGL context, no
 * HDR prefiltering competing with page render).
 *
 *  - "idle"  : mount once the viewer scrolls into view AND the browser goes
 *              idle (requestIdleCallback). The page paints instantly; the live
 *              model quietly upgrades a beat later. Used for the hero + the
 *              product-page gallery.
 *  - "hover" : mount on first pointer hover (desktop). Touch devices have no
 *              hover, so the poster stays — and on a card that's fine because
 *              tapping navigates to the product page. Used for shop/home cards
 *              and cart thumbnails so a grid of them costs zero WebGL on load.
 *  - "eager" : mount as soon as the module is ready (legacy behaviour).
 */
export type ViewerActivation = "idle" | "hover" | "eager";

interface Props {
  src: string;
  iosSrc?: string;
  poster: string;
  alt: string;
  autoRotate?: boolean;
  ar?: boolean;
  cameraControls?: boolean;
  className?: string;
  /** When the WebGL viewer is allowed to mount. Defaults to "idle". */
  activation?: ViewerActivation;
  /** Optional pre-rendered turntable filmstrip, shown as a STILL loader (its
   *  first frame, rendered at 0° to match the live model's initial camera).
   *  Paints instantly — no WebGL — and crossfades out once the live model
   *  loads. Better than the photo poster here because the frame's lighting
   *  and pose line up exactly with the live model for a seamless handoff.
   *  See scripts/render-turntables.mjs. */
  turntable?: { src: string };

  // Configurator
  caseColor?: RGB;
  pcbColor?: RGB;
  keycapColors?: [RGB, RGB, RGB, RGB];

  /** Material-name regex (as a string, since this prop is passed across the
   *  server → client boundary). Any matching material is rendered fully
   *  transparent so the corresponding mesh disappears. Used to show a
   *  PCB-only view from the full assembled GLB. */
  hideMaterialsMatching?: string;
}

interface PbrMaterial {
  name: string;
  pbrMetallicRoughness: {
    setBaseColorFactor: (rgba: [number, number, number, number]) => void;
    setMetallicFactor?: (v: number) => void;
    setRoughnessFactor?: (v: number) => void;
  };
  setAlphaMode?: (mode: "OPAQUE" | "MASK" | "BLEND") => void;
  setAlphaCutoff?: (v: number) => void;
}

// Black-oxide M3 screws: dark base colour + high metallic so highlights still
// catch the room. Forced at runtime so stale GLBs with bright-steel screw
// defaults still render the intended look.
const SCREW_RGB: RGB = [16 / 255, 16 / 255, 18 / 255];

interface ModelViewerElement extends HTMLElement {
  model?: { materials: PbrMaterial[] };
}

// Lazily import the ~1 MB @google/model-viewer chunk, cached after the first
// call so every viewer on the page shares one download. Deliberately NOT run
// at module-evaluation time: that would pull 1 MB of three.js onto every route
// that merely renders a card (e.g. /shop), even before the user interacts.
// Instead each viewer calls this only when it actually activates, so an
// untouched grid of hover-gated cards costs nothing.
let modelViewerPromise: Promise<void> | null = null;
function loadModelViewer(): Promise<void> {
  if (!modelViewerPromise) {
    modelViewerPromise = import("@google/model-viewer").then(() => undefined);
  }
  return modelViewerPromise;
}

export function ProductModelViewer({
  src,
  iosSrc,
  poster,
  alt,
  autoRotate = true,
  ar = true,
  cameraControls = true,
  className = "",
  activation = "idle",
  turntable,
  caseColor,
  pcbColor,
  keycapColors,
  hideMaterialsMatching,
}: Props) {
  const [ready, setReady] = useState(false);
  const [activated, setActivated] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const hasCaseMaterialRef = useRef(false);

  // Decide when to activate (i.e. when WebGL is allowed to spin up). Until
  // `activated` flips true the component is a plain poster image, so initial
  // paint is as cheap as any other image on the page.
  useEffect(() => {
    if (activated) return;
    const el = containerRef.current;
    if (!el) return;

    if (activation === "eager") {
      setActivated(true);
      return;
    }

    let idleHandle: number | undefined;
    let cancelled = false;
    const activate = () => {
      if (!cancelled) setActivated(true);
    };

    if (activation === "hover") {
      // Desktop: first hover mounts the live model (and it stays mounted).
      // Touch devices never fire pointerenter without a tap, so the poster
      // stands in — which is what we want for a card whose tap navigates away.
      el.addEventListener("pointerenter", activate, { once: true });
      return () => {
        cancelled = true;
        el.removeEventListener("pointerenter", activate);
      };
    }

    // "idle": mount once the viewer is on/near screen AND the browser is idle.
    const ric: (cb: () => void) => number =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? (cb) => (window as unknown as { requestIdleCallback: (c: () => void) => number }).requestIdleCallback(cb)
        : (cb) => window.setTimeout(cb, 200);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          idleHandle = ric(activate);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
      if (idleHandle !== undefined) window.clearTimeout(idleHandle);
    };
  }, [activation, activated]);

  // Once activated, pull in the heavy module. Cached across all viewers.
  useEffect(() => {
    if (!activated) return;
    let cancelled = false;
    loadModelViewer()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setModelFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [activated]);

  // Track load + error events
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onError = () => setModelFailed(true);
    const onLoad = () => {
      setModelLoaded(true);
      hasCaseMaterialRef.current =
        el.model?.materials.some((m) => (m.name ?? "").startsWith("CASE")) ?? false;
    };
    el.addEventListener("error", onError);
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("error", onError);
      el.removeEventListener("load", onLoad);
    };
  }, [ready]);

  // Apply colour overrides + tuned PBR factors per material family, and hide
  // any materials matched by `hideMaterialsMatching`. The 3D-printed case and
  // PBT keycaps are nearly matte; the PCB top is a soldermask which is slightly
  // less rough. Forcing roughness here keeps the model looking like real plastic
  // instead of glossy injection-molded resin under model-viewer's default IBL.
  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !modelLoaded || !el.model) return;

    const hasCase = hasCaseMaterialRef.current;
    const hideRe = hideMaterialsMatching ? new RegExp(hideMaterialsMatching) : null;

    for (const mat of el.model.materials) {
      const name = mat.name ?? "";
      const pbr = mat.pbrMetallicRoughness;

      if (hideRe?.test(name)) {
        // Clip via alpha-MASK so the mesh disappears entirely (no z-fighting
        // that BLEND mode would introduce against the kept geometry).
        mat.setAlphaMode?.("MASK");
        mat.setAlphaCutoff?.(0.5);
        pbr.setBaseColorFactor([0, 0, 0, 0]);
        continue;
      }

      let rgb: RGB | undefined;
      let roughness: number | undefined;
      let metallic = 0;

      if (name.startsWith("SCREW")) {
        rgb = SCREW_RGB;
        roughness = 0.4;
        metallic = 0.85;
      } else if (caseColor && hasCase && name.startsWith("CASE")) {
        // 3D-printed PLA — matte. High roughness so it reads as real printed
        // plastic under the studio HDR rather than glossy CG resin.
        rgb = caseColor;
        roughness = 0.82;
      } else if (caseColor && !hasCase && (name.startsWith("PCB_TOP") || name.startsWith("PCB_BODY"))) {
        rgb = caseColor;
        roughness = 0.82;
      } else if (pcbColor && name.startsWith("PCB_TOP")) {
        rgb = pcbColor;
        roughness = 0.55;
      } else if (keycapColors && name.startsWith("KEYCAP")) {
        const m = name.match(/KEYCAP_(\d+)/);
        const i = m ? parseInt(m[1], 10) : 0;
        rgb = keycapColors[Math.min(i, keycapColors.length - 1)];
        // PBT dye-sub — matte with only a faint sheen.
        roughness = 0.78;
      }

      if (rgb) pbr.setBaseColorFactor([rgb[0], rgb[1], rgb[2], 1]);
      if (roughness !== undefined) {
        pbr.setRoughnessFactor?.(roughness);
        pbr.setMetallicFactor?.(metallic);
      }
    }
  }, [modelLoaded, caseColor, pcbColor, keycapColors, hideMaterialsMatching]);

  // If the script outright fails, fall back to the still image.
  if (modelFailed) {
    return (
      <div className={`relative ${className}`}>
        <Image src={poster} alt={alt} fill className="object-contain" unoptimized />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {ready && (
        <model-viewer
          ref={viewerRef as React.Ref<HTMLElement>}
          src={src}
          ios-src={iosSrc}
          alt={alt}
          {...(ar ? { ar: "" } : {})}
          ar-modes="webxr scene-viewer quick-look"
          {...(autoRotate ? { "auto-rotate": "" } : {})}
          auto-rotate-delay={1500}
          rotation-per-second="20deg"
          {...(cameraControls ? { "camera-controls": true } : {})}
          interaction-prompt={cameraControls ? "auto" : "none"}
          // Studio HDR + commerce tone-mapping = product-photography look.
          // Slightly stronger, sharper shadows + a touch higher exposure
          // give the model the "lifted off a seamless" feel a flat neutral
          // env can't provide.
          environment-image="/hdri/studio.hdr"
          tone-mapping="commerce"
          exposure="1.05"
          shadow-intensity="1"
          shadow-softness="0.8"
          loading="eager"
          reveal="auto"
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            // Interactive viewer (product page): claim the touch so the model
            // orbits cleanly. Static thumbnail (shop card / cart): make the
            // canvas itself transparent to pointer events so clicks fall
            // through to the surrounding card link and vertical scroll/hover
            // is handled by the wrapper (which still drives hover activation).
            touchAction: cameraControls ? "none" : "pan-y",
            pointerEvents: cameraControls ? "auto" : "none",
          }}
        />
      )}
      {/* Instant overlay: the only thing painted until the live model loads,
          then it cross-fades out. When a turntable filmstrip is provided we
          show its first frame as a still loader (matches the live model's
          start pose for a seamless handoff); otherwise the static poster. For
          hover-activated cards this is the resting state, so the poster isn't
          marked priority (a grid of them shouldn't all preload). */}
      <div
        aria-hidden={modelLoaded}
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          modelLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        {turntable ? (
          <div
            className="turntable-sprite absolute inset-0"
            role="img"
            aria-label={alt}
            style={{ backgroundImage: `url(${turntable.src})` }}
          />
        ) : (
          <Image
            src={poster}
            alt={alt}
            fill
            className="object-contain"
            priority={activation !== "hover"}
            unoptimized
          />
        )}
      </div>
    </div>
  );
}
