import Image from "next/image";
import Link from "next/link";

const BG = "#0A0A0A";
const FG = "#FAFAFA";
const MUTED = "#8A8A8A";
const SURFACE = "#141414";
const BORDER = "#222";
const ACCENT = "#3FA66F";

const SANS = "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

export default function MockB() {
  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: BG,
        color: FG,
        fontFamily: SANS,
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{ borderColor: BORDER, background: "rgba(10,10,10,0.7)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/mock/b" className="font-semibold tracking-tight text-base">
              [sudo]
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-sm" style={{ color: MUTED }}>
              <Link href="/mock/b" className="hover:text-white">Hardware</Link>
              <Link href="/mock/b" className="hover:text-white">App</Link>
              <Link href="/mock/b" className="hover:text-white">Docs</Link>
              <Link href="/mock/b" className="hover:text-white">GitHub</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/mock/b" className="text-sm hover:text-white" style={{ color: MUTED }}>
              Sign in
            </Link>
            <Link
              href="/mock/b"
              className="text-sm px-3 py-1.5 !rounded-md border hover:bg-white hover:text-black transition-colors"
              style={{ borderColor: BORDER }}
            >
              Buy →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-6 pt-20 sm:pt-32 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <span
            className="text-xs px-2 py-1 !rounded-full border"
            style={{ borderColor: BORDER, color: ACCENT, fontFamily: MONO }}
          >
            v1.0 · shipping now
          </span>
          <span className="text-xs" style={{ color: MUTED }}>
            $40 — preorders open
          </span>
        </div>
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] leading-[0.95] max-w-4xl"
        >
          Physical keys for
          <br />
          <span style={{ color: MUTED }}>your AI workflow.</span>
        </h1>
        <p
          className="mt-8 max-w-xl text-lg leading-relaxed"
          style={{ color: MUTED }}
        >
          Open-source macro pad and companion app. Approve, reject, and run AI agents without breaking flow. macOS, Windows, Linux.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/mock/b"
            className="px-5 py-2.5 text-sm font-medium !rounded-md"
            style={{ background: FG, color: BG }}
          >
            Buy macro pad — $40
          </Link>
          <Link
            href="/mock/b"
            className="px-5 py-2.5 text-sm font-medium !rounded-md border hover:bg-white/5"
            style={{ borderColor: BORDER }}
          >
            Download app
          </Link>
          <Link
            href="/mock/b"
            className="text-sm hover:text-white ml-2"
            style={{ color: MUTED, fontFamily: MONO }}
          >
            $ npm i @sudo/cli
          </Link>
        </div>

        {/* Hero image with subtle border + glow */}
        <div className="mt-16 relative">
          <div
            className="relative aspect-[16/9] w-full overflow-hidden !rounded-2xl border"
            style={{ borderColor: BORDER, background: SURFACE }}
          >
            <Image
              src="/images/products/hero-white-hand-landscape.jpeg"
              alt="sudo macro pad in hand"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Floating spec chips */}
          <div className="absolute -bottom-5 left-6 right-6 flex flex-wrap gap-2 justify-center">
            {["4 keys", "MX hot-swap", "USB-C", "QMK firmware", "Open source"].map((s) => (
              <span
                key={s}
                className="text-xs px-3 py-1.5 !rounded-full border backdrop-blur"
                style={{ borderColor: BORDER, background: "rgba(10,10,10,0.8)", fontFamily: MONO }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento grid */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT, fontFamily: MONO }}>
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] max-w-2xl">
            Designed for engineers who care about their inputs.
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Big bento — open source */}
          <div
            className="col-span-12 md:col-span-7 !rounded-2xl border p-8 relative overflow-hidden"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <div className="relative z-10 max-w-sm">
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT, fontFamily: MONO }}>
                Open hardware
              </p>
              <h3 className="text-2xl font-semibold mb-3">Schematics, firmware, app. All on GitHub.</h3>
              <p style={{ color: MUTED }}>
                KiCad source, QMK firmware, and the cross-platform companion app. Fork and remix.
              </p>
            </div>
            <div className="absolute inset-0 opacity-40">
              <Image src="/images/products/pcb-front.jpeg" alt="" fill className="object-cover object-right" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, " + SURFACE + " 0%, " + SURFACE + "ee 30%, transparent 70%)",
                }}
              />
            </div>
          </div>

          {/* Cross platform */}
          <div
            className="col-span-12 md:col-span-5 !rounded-2xl border p-8"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT, fontFamily: MONO }}>
              Cross-platform
            </p>
            <h3 className="text-2xl font-semibold mb-3">macOS · Windows · Linux</h3>
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
            className="col-span-6 md:col-span-3 !rounded-2xl border p-6"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <p className="text-5xl font-semibold tracking-tight mb-2" style={{ color: ACCENT }}>
              &lt;1ms
            </p>
            <p className="text-sm" style={{ color: MUTED }}>
              Key-to-event latency over USB-HID
            </p>
          </div>

          {/* QMK */}
          <div
            className="col-span-6 md:col-span-3 !rounded-2xl border p-6"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <p className="text-sm mb-2" style={{ fontFamily: MONO, color: MUTED }}>
              QMK · VIA · Vial
            </p>
            <h3 className="text-xl font-semibold">Remap live without reflashing.</h3>
          </div>

          {/* In hand visual */}
          <div
            className="col-span-12 md:col-span-6 !rounded-2xl border overflow-hidden relative aspect-[16/9] md:aspect-auto"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <Image src="/images/products/lineup-all-four.jpeg" alt="all colorways" fill className="object-cover" />
            <div
              className="absolute inset-0 flex items-end p-6"
              style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9), transparent 60%)" }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: ACCENT, fontFamily: MONO }}>
                  Four colorways
                </p>
                <h3 className="text-xl font-semibold">Pick a vibe.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products row */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Shop</h2>
          <Link href="/mock/b" className="text-sm hover:text-white" style={{ color: MUTED }}>
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Macro Pad — White", price: "$40", img: "/images/products/card-white.jpeg", tag: "in stock" },
            { name: "Macro Pad — Black", price: "$40", img: "/images/products/card-black.jpeg", tag: "in stock" },
            { name: "Macro Pad — Rasta", price: "$45", img: "/images/products/card-rasta.jpeg", tag: "limited" },
          ].map((p) => (
            <Link
              key={p.name}
              href="/mock/b"
              className="group !rounded-2xl border overflow-hidden block hover:border-white/40 transition-colors"
              style={{ borderColor: BORDER, background: SURFACE }}
            >
              <div className="aspect-square relative overflow-hidden">
                <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs mb-1" style={{ color: ACCENT, fontFamily: MONO }}>
                    {p.tag}
                  </p>
                  <p className="font-medium">{p.name}</p>
                </div>
                <span className="text-sm" style={{ fontFamily: MONO, color: MUTED }}>
                  {p.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div
          className="!rounded-2xl border p-10 sm:p-16 text-center"
          style={{ background: SURFACE, borderColor: BORDER }}
        >
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: ACCENT, fontFamily: MONO }}>
            Get on the list
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] mb-4 max-w-2xl mx-auto">
            Drops are small. Be first.
          </h2>
          <p className="max-w-md mx-auto mb-8" style={{ color: MUTED }}>
            Every batch is hand-assembled. Subscribe to know when the next run opens.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="you@dev.io"
              className="flex-1 px-4 py-2.5 !rounded-md border bg-transparent text-sm outline-none focus:border-white"
              style={{ borderColor: BORDER, fontFamily: MONO }}
            />
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-medium !rounded-md"
              style={{ background: FG, color: BG }}
            >
              Notify me
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-10" style={{ borderColor: BORDER }}>
        <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2">
            <p className="font-semibold mb-2">[sudo]</p>
            <p style={{ color: MUTED }}>Open hardware for AI workflows.</p>
          </div>
          {[
            ["Product", ["Macro pad", "Keycaps", "App", "Roadmap"]],
            ["Resources", ["Docs", "Firmware", "GitHub"]],
            ["Company", ["About", "Blog", "Contact"]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{ color: MUTED, fontFamily: MONO }}>
                {title}
              </p>
              <ul className="space-y-2">
                {(items as string[]).map((i) => (
                  <li key={i}><Link href="/mock/b" className="hover:text-white" style={{ color: MUTED }}>{i}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="border-t max-w-[1280px] mx-auto px-6 py-6 text-xs flex justify-between"
          style={{ color: MUTED, fontFamily: MONO, borderColor: BORDER }}
        >
          <span>© sudo.supply · open source hardware</span>
          <Link href="/mock" className="hover:text-white">← back to mocks</Link>
        </div>
      </footer>
    </div>
  );
}
