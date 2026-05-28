import Image from "next/image";
import Link from "next/link";

const BG = "#0A0A0A";
const SURFACE = "#111111";
const BORDER = "#1E1E1E";
const FG = "#F2F2F2";
const MUTED = "#8A8A8A";
const GREEN = "#1F7A4D";
const GREEN_BRIGHT = "#2EA468";

const SANS = "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

export default function MockD() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: BG,
        color: FG,
        fontFamily: SANS,
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Nav — pill */}
      <header className="sticky top-0 z-50 pt-4 px-4">
        <div
          className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 px-4 py-2.5 !rounded-full border backdrop-blur"
          style={{ borderColor: BORDER, background: "rgba(10,10,10,0.75)" }}
        >
          <Link href="/mock/d" className="font-pixel text-white text-lg pl-2 tracking-tight">
            [sudo]
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm" style={{ color: MUTED }}>
            {["Shop", "Device", "App", "Open", "Story"].map((l) => (
              <Link
                key={l}
                href="/mock/d"
                className="px-3 py-1.5 !rounded-full hover:bg-white/10 hover:text-white transition-colors"
              >
                {l}
              </Link>
            ))}
          </nav>
          <Link
            href="/mock/d"
            className="px-4 py-2 text-sm font-medium !rounded-full text-black"
            style={{ background: GREEN_BRIGHT }}
          >
            Bag · 0
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-12">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-6"
          style={{ color: GREEN_BRIGHT, fontFamily: MONO }}
        >
          [sudo] — edition 01 / now shipping
        </p>

        <h1
          className="font-extrabold tracking-[-0.05em] leading-[0.85]"
          style={{ fontSize: "clamp(3rem, 13vw, 11rem)" }}
        >
          Press
          <br />
          <span
            className="inline-block"
            style={{
              color: GREEN_BRIGHT,
              transform: "rotate(-2deg)",
              transformOrigin: "left center",
            }}
          >
            buttons
          </span>
          <br />
          on purpose.
        </h1>

        <div className="mt-12 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="text-lg leading-relaxed max-w-md" style={{ color: MUTED }}>
              A four-key macro pad for people who use AI agents and want a physical command line. Open hardware. Hand-assembled. $40.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/mock/d"
                className="px-6 py-3 text-sm font-semibold !rounded-full text-black"
                style={{ background: GREEN_BRIGHT }}
              >
                Shop the pad — $40
              </Link>
              <Link
                href="/mock/d"
                className="px-6 py-3 text-sm font-semibold !rounded-full border hover:bg-white/5"
                style={{ borderColor: BORDER, color: FG }}
              >
                See the app
              </Link>
            </div>
            <p className="mt-6 text-sm" style={{ color: MUTED, fontFamily: MONO }}>
              $ curl -fsSL sudo.supply/install | sh
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-7 relative">
            <div
              className="relative aspect-[5/4] w-full !rounded-[2.5rem] overflow-hidden border"
              style={{ background: "#383431", borderColor: BORDER }}
            >
              <Image
                src="/images/products/hero-color-iso-clean.jpeg"
                alt="sudo macro pad — Rasta edition, isometric view"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Sticker chips */}
            <div
              className="absolute -top-4 -left-4 px-4 py-2 text-xs font-bold !rounded-full text-black shadow-lg"
              style={{ background: GREEN_BRIGHT, transform: "rotate(-6deg)" }}
            >
              Open source!
            </div>
            <div
              className="absolute -bottom-4 right-4 px-4 py-2 text-xs font-bold !rounded-full border"
              style={{ background: BG, color: FG, borderColor: GREEN, transform: "rotate(4deg)" }}
            >
              Hand-assembled
            </div>
          </div>
        </div>
      </section>

      {/* Marquee — green band */}
      <section
        className="overflow-hidden my-12 border-y"
        style={{ borderColor: GREEN, background: GREEN, color: "#031A0E" }}
      >
        <div className="py-5 whitespace-nowrap font-pixel">
          <span className="inline-block px-6 text-2xl sm:text-3xl tracking-wide">
            [APPROVE] · [REJECT] · [CONTINUE] · [CANCEL] · [APPROVE] · [REJECT] · [CONTINUE] · [CANCEL] · [APPROVE] · [REJECT] · [CONTINUE] · [CANCEL] ·{" "}
          </span>
        </div>
      </section>

      {/* Bento — capabilities */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: GREEN_BRIGHT, fontFamily: MONO }}>
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] max-w-2xl">
            Designed for engineers who care about their inputs.
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Big — open source */}
          <div
            className="col-span-12 md:col-span-7 !rounded-3xl border p-8 relative overflow-hidden min-h-[320px]"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <div className="relative z-10 max-w-sm">
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: GREEN_BRIGHT, fontFamily: MONO }}>
                Open hardware
              </p>
              <h3 className="text-2xl font-bold mb-3">Schematics, firmware, app. All on GitHub.</h3>
              <p style={{ color: MUTED }}>
                KiCad source, QMK firmware, and the cross-platform companion app. Fork and remix.
              </p>
            </div>
            <div className="absolute inset-0 opacity-50">
              <Image src="/images/products/pcb-front-clean.jpeg" alt="" fill className="object-cover object-right" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, " + SURFACE + " 0%, " + SURFACE + "ee 25%, transparent 75%)",
                }}
              />
            </div>
          </div>

          {/* Cross-platform */}
          <div
            className="col-span-12 md:col-span-5 !rounded-3xl border p-8"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: GREEN_BRIGHT, fontFamily: MONO }}>
              Cross-platform
            </p>
            <h3 className="text-2xl font-bold mb-3">macOS · Windows · Linux</h3>
            <p style={{ color: MUTED }}>One companion app, three platforms. Works with Claude, ChatGPT, Grok.</p>
            <div className="mt-6 flex gap-2 flex-wrap">
              {["macOS 13+", "Win 10/11", "Ubuntu 22+", "Arch (btw)"].map((p) => (
                <span
                  key={p}
                  className="text-xs px-2 py-1 !rounded-md border"
                  style={{ borderColor: BORDER, fontFamily: MONO, color: MUTED }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Latency */}
          <div
            className="col-span-6 md:col-span-3 !rounded-3xl border p-6"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <p className="text-5xl font-extrabold tracking-tight mb-2" style={{ color: GREEN_BRIGHT }}>
              &lt;1ms
            </p>
            <p className="text-sm" style={{ color: MUTED }}>
              Key-to-event latency over USB-HID
            </p>
          </div>

          {/* QMK */}
          <div
            className="col-span-6 md:col-span-3 !rounded-3xl border p-6"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <p className="text-sm mb-2" style={{ fontFamily: MONO, color: MUTED }}>
              QMK · VIA · Vial
            </p>
            <h3 className="text-xl font-bold">Remap live without reflashing.</h3>
          </div>

          {/* Colorways visual */}
          <div
            className="col-span-12 md:col-span-6 !rounded-3xl border overflow-hidden relative aspect-[16/9]"
            style={{ background: "#423c3d", borderColor: BORDER }}
          >
            <Image src="/images/products/lineup-all-four-clean.jpeg" alt="all colorways" fill className="object-cover" />
            <div
              className="absolute inset-0 flex items-end p-6 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(10,10,10,0.85), transparent 50%)" }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: GREEN_BRIGHT, fontFamily: MONO }}>
                  Four colorways
                </p>
                <h3 className="text-xl font-bold">Pick a vibe.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop row */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">Pick yours.</h2>
          <Link href="/mock/d" className="text-sm underline" style={{ color: MUTED }}>
            All variants →
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {[
            { name: "White", price: "$40", img: "/images/products/card-white-clean.jpeg", bg: "#47433d" },
            { name: "Black", price: "$40", img: "/images/products/card-black-clean.jpeg", bg: "#767e75" },
            { name: "Rasta", price: "$45", img: "/images/products/card-rasta-clean.jpeg", bg: "#bcb6ac" },
          ].map((p) => (
            <Link
              key={p.name}
              href="/mock/d"
              className="col-span-6 md:col-span-4 !rounded-3xl overflow-hidden block group border"
              style={{ background: p.bg, borderColor: BORDER }}
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: GREEN_BRIGHT, fontFamily: MONO }}
                  >
                    in stock
                  </p>
                  <p className="font-bold text-lg">{p.name}</p>
                </div>
                <p className="text-sm" style={{ fontFamily: MONO, color: MUTED }}>
                  {p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20">
        <div
          className="!rounded-[2.5rem] p-8 sm:p-16 grid grid-cols-12 gap-8 items-center border"
          style={{ background: SURFACE, borderColor: BORDER }}
        >
          <div className="col-span-12 md:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: GREEN_BRIGHT, fontFamily: MONO }}>
              The story
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              We made a tiny keyboard
              <br />
              because we got tired of
              <br />
              <span style={{ color: GREEN_BRIGHT }}>clicking &quot;allow.&quot;</span>
            </h2>
            <Link
              href="/mock/d"
              className="inline-block mt-8 px-6 py-3 text-sm font-semibold !rounded-full text-black"
              style={{ background: GREEN_BRIGHT }}
            >
              Read the manifesto →
            </Link>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div
              className="relative aspect-square w-full !rounded-3xl overflow-hidden border"
              style={{ borderColor: BORDER, background: "#4f4d43" }}
            >
              <Image src="/images/products/pcb-front-clean.jpeg" alt="PCB" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA — drop list */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div
          className="!rounded-3xl border p-10 sm:p-14 text-center"
          style={{ background: SURFACE, borderColor: BORDER }}
        >
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: GREEN_BRIGHT, fontFamily: MONO }}>
            Get on the list
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] mb-4 max-w-2xl mx-auto">
            Drops are small. Be first.
          </h2>
          <p className="max-w-md mx-auto mb-8" style={{ color: MUTED }}>
            Every batch is hand-assembled. Subscribe to know when the next run opens.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="you@dev.io"
              className="flex-1 px-4 py-2.5 !rounded-full border bg-transparent text-sm outline-none focus:border-white"
              style={{ borderColor: BORDER, fontFamily: MONO }}
            />
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-semibold !rounded-full text-black"
              style={{ background: GREEN_BRIGHT }}
            >
              Notify me
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-12">
        <div className="!rounded-3xl p-8 sm:p-12 border" style={{ borderColor: BORDER, background: SURFACE }}>
          <div className="grid grid-cols-12 gap-8 mb-10">
            <div className="col-span-12 md:col-span-5">
              <p className="font-pixel text-3xl text-white mb-3">[sudo]</p>
              <p style={{ color: MUTED }} className="max-w-sm">
                Open hardware, hand-assembled in small batches.
              </p>
            </div>
            {[
              ["Shop", ["Macro pad", "Keycaps", "Color combos", "Bulk"]],
              ["Open", ["GitHub", "Firmware", "Schematics"]],
              ["More", ["About", "Journal", "Contact"]],
            ].map(([t, items]) => (
              <div key={t as string} className="col-span-6 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{ color: MUTED, fontFamily: MONO }}>
                  {t}
                </p>
                <ul className="space-y-2 text-sm">
                  {(items as string[]).map((i) => (
                    <li key={i}>
                      <Link href="/mock/d" className="hover:text-white" style={{ color: MUTED }}>{i}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs pt-6 border-t" style={{ color: MUTED, fontFamily: MONO, borderColor: BORDER }}>
            <span>© sudo.supply · open source hardware</span>
            <Link href="/mock" className="hover:text-white">← back to mocks</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
