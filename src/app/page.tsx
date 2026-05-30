import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { HeroModel } from "@/components/HeroModel";
import { hexToRgb, type RGB, CASE_RENDER, KEYCAP_RENDER } from "@/lib/productColors";
import { ProductCard } from "@/components/ProductCard";
import { ModelPreloader } from "@/components/ModelPreloader";

// Same per-product 3D config used on /shop so the homepage Pick-yours cards
// match the shop cards (single GLB, per-product mesh hides).
const HOMEPAGE_MODEL_SRC = "/models/sudo-macropad.glb";
const HOMEPAGE_HIDE_MATERIALS: Record<string, string | undefined> = {
  "sudo-macro-pad-v1": undefined,
  "sudo-pcb": "^(CASE|KEYCAP|SCREW)",
  "sudo-keycaps": "^(CASE|SCREW|SUBSTRATE|SILKSCREEN|METAL|COMPONENT|PCB)",
};

// Hero preset: black case + traffic-light keys.
const HERO_CASE: RGB = hexToRgb(CASE_RENDER.black);
const HERO_KEYS: [RGB, RGB, RGB, RGB] = KEYCAP_RENDER.traffic.map(hexToRgb) as [
  RGB,
  RGB,
  RGB,
  RGB,
];

// Fetch GitHub stats at build/ISR time. Falls back silently to nulls so the
// page never breaks on rate limits or offline builds.
async function getOpenSourceStats(): Promise<{ stars: number | null; contributors: number | null }> {
  try {
    const [repoRes, contribRes] = await Promise.all([
      fetch("https://api.github.com/repos/ibrue/sudo-app", {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch("https://api.github.com/repos/ibrue/sudo-app/contributors?per_page=1&anon=true", {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);
    const repo = repoRes.ok ? await repoRes.json() : null;
    // Contributor count comes from the `Link` header's `rel="last"` page number.
    let contributors: number | null = null;
    const link = contribRes.headers.get("link");
    if (link) {
      const m = link.match(/&page=(\d+)>;\s*rel="last"/);
      if (m) contributors = parseInt(m[1], 10);
    }
    if (contributors === null && contribRes.ok) {
      const arr = await contribRes.json();
      contributors = Array.isArray(arr) ? arr.length : null;
    }
    return {
      stars: typeof repo?.stargazers_count === "number" ? repo.stargazers_count : null,
      contributors,
    };
  } catch {
    return { stars: null, contributors: null };
  }
}

export default async function Home() {
  const macroPad = products.find((p) => p.slug === "sudo-macro-pad-v1");
  const { stars, contributors } = await getOpenSourceStats();

  return (
    <div className="pt-24">
      <ModelPreloader />
      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-12">
        <h1
          className="font-extrabold tracking-[-0.05em] leading-[0.85]"
          style={{ fontSize: "clamp(3rem, 13vw, 11rem)" }}
        >
          Press
          <br />
          <span
            className="inline-block text-accent"
            style={{ transform: "rotate(-2deg)", transformOrigin: "left center" }}
          >
            buttons
          </span>
          <br />
          on purpose.
        </h1>

        <div className="mt-12 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="text-lg leading-relaxed max-w-md text-text-muted">
              A four-key macro pad for people who use AI agents and want a physical command line. Open hardware. Hand-assembled. ${macroPad?.price.toFixed(0) ?? "40"}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
              >
                Shop the pad · ${macroPad?.price.toFixed(0) ?? "40"}
              </Link>
              <Link
                href="/download"
                className="px-6 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                See the app
              </Link>
            </div>
            <p className="mt-6 text-sm text-text-muted font-mono">
              $ curl -fsSL sudo.supply/install | sh{" "}
              <span className="font-pixel text-accent text-base align-middle">:)</span>
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-7 relative">
            <div className="relative aspect-[5/4] w-full rounded-[2.5rem] overflow-hidden border border-border bg-surface">
              <HeroModel
                src="/models/sudo-macropad.glb"
                iosSrc="/models/sudo-macropad.usdz"
                poster="/images/products/hero-rasta-angle-dark.jpeg"
                alt="sudo macro pad, interactive 3D view"
                caseColor={HERO_CASE}
                keycapColors={HERO_KEYS}
              />
            </div>
            <div
              className="absolute -top-4 -left-4 px-4 py-2 font-pixel text-sm rounded-full text-black shadow-lg bg-accent"
              style={{ transform: "rotate(-6deg)" }}
            >
              [open-source] :)
            </div>
            <div
              className="absolute -bottom-4 right-4 px-4 py-2 font-pixel text-sm rounded-full border border-accent bg-bg text-white"
              style={{ transform: "rotate(4deg)" }}
            >
              [hand-assembled]
            </div>
          </div>
        </div>
      </section>

      {/* Marquee. Two copies are concatenated so the seam is invisible while
          the animation wraps. No per-copy padding — that introduces a 3rem
          gap at the seam that doesn't match the ` · ` spacing inside the
          string. The trailing ` · ` on the source line is what bridges the
          two copies, so each copy ends with the same separator that lives
          between every other item. */}
      <section className="overflow-hidden my-12 border-y bg-accent border-accent text-[#031A0E]">
        <div className="py-5 flex whitespace-nowrap font-pixel animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="inline-block text-2xl sm:text-3xl tracking-wide shrink-0">
              [APPROVE] · [REJECT] · [CONTINUE] · [CANCEL] · [YOLO] · [APPROVE] · [REJECT] · [CONTINUE] · [CANCEL] · [YOLO] ·&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* Bento capabilities */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-mono">
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] max-w-2xl">
            Designed for engineers who care about their inputs.
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Open source */}
          <div className="col-span-12 md:col-span-7 rounded-3xl border border-border bg-surface p-8 relative overflow-hidden min-h-[320px]">
            <div className="relative z-10 max-w-sm">
              <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-mono">
                Open hardware
              </p>
              <h3 className="text-2xl font-bold mb-3">Schematics, firmware, app. All on GitHub.</h3>
              <p className="text-text-muted">
                KiCad source, QMK firmware, and the cross-platform companion app. Fork and remix.
              </p>
              {(stars !== null || contributors !== null) && (
                <p className="mt-4 text-sm font-mono text-text-muted flex items-center gap-3">
                  {stars !== null && (
                    <span className="text-accent">★ {stars.toLocaleString()}</span>
                  )}
                  {contributors !== null && (
                    <span>· {contributors} contributor{contributors === 1 ? "" : "s"}</span>
                  )}
                </p>
              )}
            </div>
            <div className="absolute inset-0 opacity-50">
              <Image src="/images/products/pcb-front-dark.jpeg" alt="" fill className="object-cover object-right" />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, #141414 0%, rgba(20,20,20,0.93) 25%, transparent 75%)",
                }}
              />
            </div>
          </div>

          {/* Cross-platform */}
          <div className="col-span-12 md:col-span-5 rounded-3xl border border-border bg-surface p-8">
            <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-mono">
              Cross-platform
            </p>
            <h3 className="text-2xl font-bold mb-3">macOS · Windows · Linux</h3>
            <p className="text-text-muted">One companion app, three platforms. Works with Claude, ChatGPT, Grok.</p>
            <div className="mt-6 flex gap-2 flex-wrap">
              {["macOS 13+", "Win 10/11", "Ubuntu 22+", "Arch (btw)"].map((p) => (
                <span key={p} className="text-xs px-2 py-1 rounded-md border border-border font-mono text-text-muted">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Latency */}
          <div className="col-span-6 md:col-span-3 rounded-3xl border border-border bg-surface p-6">
            <p className="text-5xl font-extrabold tracking-tight mb-2 text-accent">&lt;1ms</p>
            <p className="text-sm text-text-muted">Key-to-event latency over USB-HID</p>
          </div>

          {/* QMK */}
          <div className="col-span-6 md:col-span-3 rounded-3xl border border-border bg-surface p-6">
            <p className="text-sm mb-2 font-mono text-text-muted">QMK · VIA · Vial</p>
            <h3 className="text-xl font-bold">Remap live without reflashing.</h3>
          </div>

          {/* Colorways */}
          <div className="col-span-12 md:col-span-6 rounded-3xl border border-border overflow-hidden relative aspect-[16/9] bg-surface">
            <Image
              src="/images/products/lineup-all-four-dark.jpeg"
              alt="all colorways"
              fill
              className="object-contain p-6"
            />
            <div
              className="absolute inset-0 flex items-end p-6 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(10,10,10,0.92), transparent 55%)" }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] mb-2 text-accent font-mono">
                  Mix &amp; match
                </p>
                <h3 className="text-xl font-bold">Pick a vibe.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop teaser — the three products, sourced from the products data
          so this section can never drift from the actual shop. */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">Pick yours.</h2>
          <Link href="/shop" className="text-sm underline text-text-muted">
            Browse the shop →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              modelSrc={HOMEPAGE_MODEL_SRC}
              hideMaterialsMatching={HOMEPAGE_HIDE_MATERIALS[p.slug]}
            />
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20">
        <div className="rounded-[2.5rem] p-8 sm:p-16 grid grid-cols-12 gap-8 items-center border border-border bg-surface">
          <div className="col-span-12 md:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] mb-4 text-accent font-mono">
              The story
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              We made a tiny keyboard
              <br />
              because we got tired of
              <br />
              <span className="text-accent">clicking &quot;allow.&quot;</span>
            </h2>
            <Link
              href="/about"
              className="inline-block mt-8 px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
            >
              Read the manifesto →
            </Link>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-border bg-surface p-6">
              <Image src="/images/products/pcb-back-dark.jpeg" alt="PCB internals" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
