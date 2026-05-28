import Image from "next/image";
import Link from "next/link";

const BG = "#FAFAFA";
const INK = "#0E0E0E";
const MUTED = "#6B6B6B";
const RED = "#E03C2B";
const YELLOW = "#F2C71F";
const GREEN = "#3FA66F";
const BLACK = "#1A1A1A";

const SANS = "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

export default function MockC() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: BG, color: INK, fontFamily: SANS }}
    >
      {/* Top bar — pill nav */}
      <header className="sticky top-0 z-50 pt-4 px-4">
        <div
          className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 px-4 py-2.5 !rounded-full border backdrop-blur"
          style={{ borderColor: "#E5E5E5", background: "rgba(255,255,255,0.85)" }}
        >
          <Link href="/mock/c" className="font-extrabold text-lg tracking-tight pl-2">
            sudo<span style={{ color: RED }}>.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {["Shop", "Device", "App", "Open", "Story"].map((l) => (
              <Link
                key={l}
                href="/mock/c"
                className="px-3 py-1.5 !rounded-full hover:bg-black hover:text-white transition-colors"
              >
                {l}
              </Link>
            ))}
          </nav>
          <Link
            href="/mock/c"
            className="px-4 py-2 text-sm font-medium !rounded-full text-white"
            style={{ background: INK }}
          >
            Bag · 0
          </Link>
        </div>
      </header>

      {/* Hero — oversized type with image overlap */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-12 relative">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: MUTED, fontFamily: MONO }}
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
            style={{ color: RED, transform: "rotate(-2deg)", transformOrigin: "left center" }}
          >
            buttons
          </span>
          <br />
          on purpose.
        </h1>

        <div className="mt-10 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="text-lg leading-relaxed max-w-md" style={{ color: MUTED }}>
              A four-key macro pad for people who use AI agents and want a physical command line. Open hardware, fun colors, $40.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/mock/c"
                className="px-6 py-3 text-sm font-semibold !rounded-full text-white"
                style={{ background: INK }}
              >
                Shop the pad — $40
              </Link>
              <Link
                href="/mock/c"
                className="px-6 py-3 text-sm font-semibold !rounded-full border"
                style={{ borderColor: INK }}
              >
                See the app
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-7 relative">
            <div
              className="relative aspect-[5/4] w-full !rounded-[2.5rem] overflow-hidden"
              style={{ background: YELLOW }}
            >
              <Image
                src="/images/products/hero-white-hand.jpeg"
                alt="sudo macro pad"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Sticker chips */}
            <div
              className="absolute -top-4 -left-4 px-4 py-2 text-xs font-bold !rounded-full text-white shadow-lg"
              style={{ background: RED, transform: "rotate(-6deg)" }}
            >
              Open source!
            </div>
            <div
              className="absolute -bottom-4 right-4 px-4 py-2 text-xs font-bold !rounded-full"
              style={{ background: GREEN, color: BLACK, transform: "rotate(4deg)" }}
            >
              Hand-assembled
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section
        className="overflow-hidden border-y my-12"
        style={{ borderColor: INK, background: INK, color: BG }}
      >
        <div className="py-5 whitespace-nowrap" style={{ fontFamily: MONO }}>
          <span className="inline-block px-6 text-2xl sm:text-3xl">
            APPROVE · REJECT · CONTINUE · CANCEL · APPROVE · REJECT · CONTINUE · CANCEL · APPROVE · REJECT · CONTINUE · CANCEL · APPROVE · REJECT · CONTINUE · CANCEL ·{" "}
          </span>
        </div>
      </section>

      {/* Color-blocked product cards */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Pick yours.
          </h2>
          <Link href="/mock/c" className="text-sm underline" style={{ color: MUTED }}>
            All variants →
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {[
            { name: "White", price: "$40", bg: "#F2F0EB", img: "/images/products/card-white.jpeg", tag: BLACK },
            { name: "Black", price: "$40", bg: "#1A1A1A", img: "/images/products/card-black.jpeg", tag: "#fff" },
            { name: "Rasta", price: "$45", bg: GREEN, img: "/images/products/card-rasta.jpeg", tag: BLACK },
            { name: "Color combo", price: "from $40", bg: YELLOW, img: "/images/products/lineup-all-four.jpeg", tag: BLACK, wide: true },
          ].map((p) => (
            <Link
              key={p.name}
              href="/mock/c"
              className={`!rounded-[2rem] overflow-hidden block group ${p.wide ? "col-span-12 md:col-span-6" : "col-span-6 md:col-span-3"}`}
              style={{ background: p.bg }}
            >
              <div className={`relative w-full ${p.wide ? "aspect-[2/1]" : "aspect-square"} overflow-hidden`}>
                <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
              </div>
              <div className="p-5 flex items-center justify-between" style={{ color: p.tag as string }}>
                <p className="font-bold text-lg">{p.name}</p>
                <p className="text-sm opacity-80" style={{ fontFamily: MONO }}>
                  {p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Three-up values */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-12 gap-4">
          {[
            {
              n: "01",
              title: "Open hardware.",
              body: "KiCad schematics, QMK firmware, the case file — all public. Fork it. Print it. Mail us a remix.",
              color: RED,
            },
            {
              n: "02",
              title: "Cross-platform app.",
              body: "macOS, Windows, Linux. Works with Claude, ChatGPT, Grok. Configure keys with a click.",
              color: YELLOW,
            },
            {
              n: "03",
              title: "Hand-assembled.",
              body: "Each pad built one at a time by a human who cares whether the seams line up. They do.",
              color: GREEN,
            },
          ].map((f) => (
            <div
              key={f.n}
              className="col-span-12 md:col-span-4 !rounded-[2rem] p-8 border"
              style={{ borderColor: "#E5E5E5" }}
            >
              <div
                className="w-12 h-12 !rounded-full mb-6 flex items-center justify-center text-sm font-bold"
                style={{ background: f.color, color: BLACK }}
              >
                {f.n}
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{f.title}</h3>
              <p style={{ color: MUTED }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Big quote / story */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20">
        <div
          className="!rounded-[2.5rem] p-8 sm:p-16 grid grid-cols-12 gap-8 items-center"
          style={{ background: INK, color: BG }}
        >
          <div className="col-span-12 md:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: YELLOW, fontFamily: MONO }}>
              The story
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              We made a tiny keyboard
              <br />
              because we got tired of
              <br />
              <span style={{ color: YELLOW }}>clicking &quot;allow.&quot;</span>
            </h2>
            <Link
              href="/mock/c"
              className="inline-block mt-8 px-6 py-3 text-sm font-semibold !rounded-full"
              style={{ background: BG, color: INK }}
            >
              Read the manifesto →
            </Link>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="relative aspect-square w-full !rounded-[2rem] overflow-hidden">
              <Image src="/images/products/pcb-front.jpeg" alt="PCB" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-12">
        <div className="!rounded-[2.5rem] p-8 sm:p-12 border" style={{ borderColor: "#E5E5E5" }}>
          <div className="grid grid-cols-12 gap-8 mb-10">
            <div className="col-span-12 md:col-span-5">
              <p className="font-extrabold text-3xl tracking-tight mb-3">
                sudo<span style={{ color: RED }}>.</span>supply
              </p>
              <p style={{ color: MUTED }} className="max-w-sm">
                Open hardware, fun colors, hand-assembled in small batches.
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
                      <Link href="/mock/c" className="hover:underline">{i}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: MUTED, fontFamily: MONO }}>
            <span>© sudo.supply</span>
            <Link href="/mock" className="hover:underline">← back to mocks</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
