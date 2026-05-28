import Image from "next/image";
import Link from "next/link";

const BG = "#F5F1EA";
const FG = "#1A1814";
const MUTED = "#6B6358";
const ACCENT = "#C44E2D";
const RULE = "#D9D2C5";

export default function MockA() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: BG,
        color: FG,
        fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Top bar */}
      <header className="border-b" style={{ borderColor: RULE }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xl tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, serif", fontStyle: "italic" }}
            >
              sudo
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: MUTED, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
            >
              .supply
            </span>
          </div>
          <nav
            className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em]"
            style={{ color: MUTED, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
          >
            <Link href="/mock/a">Shop</Link>
            <Link href="/mock/a">Device</Link>
            <Link href="/mock/a">App</Link>
            <Link href="/mock/a">Open Source</Link>
            <Link href="/mock/a">Journal</Link>
          </nav>
          <Link
            href="/mock/a"
            className="text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            Bag (0)
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid grid-cols-12 gap-6 sm:gap-10 items-end">
          <div className="col-span-12 lg:col-span-6">
            <p
              className="text-[10px] uppercase tracking-[0.3em] mb-6"
              style={{ color: ACCENT, fontFamily: "ui-monospace, monospace" }}
            >
              001 — Macro Pad v1
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight font-normal">
              A small object
              <br />
              <span style={{ fontStyle: "italic", color: ACCENT }}>between you</span>
              <br />
              and the machine.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed" style={{ color: MUTED }}>
              Four mechanical keys. One open hardware design. Approve, reject, run — without lifting your hands off the rest of your craft.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/mock/a"
                className="inline-block px-6 py-3 text-sm uppercase tracking-[0.2em] !rounded-full"
                style={{
                  background: FG,
                  color: BG,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                Shop · $40
              </Link>
              <Link
                href="/mock/a"
                className="text-sm uppercase tracking-[0.2em] underline-offset-4 hover:underline"
                style={{ color: FG, fontFamily: "ui-monospace, monospace" }}
              >
                Read the build →
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden !rounded-3xl">
              <Image
                src="/images/products/hero-white-hand.jpeg"
                alt="sudo macro pad in hand"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs" style={{ color: MUTED, fontFamily: "ui-monospace, monospace" }}>
              <span>EDITION 01</span>
              <span className="text-center">SHIPS WORLDWIDE</span>
              <span className="text-right">MADE TO ORDER</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wide spec row */}
      <section className="border-y" style={{ borderColor: RULE }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["Keys", "4 × MX hot-swap"],
            ["Firmware", "QMK · VIA · Vial"],
            ["Interface", "USB-C"],
            ["Compatibility", "macOS · Windows · Linux"],
          ].map(([label, value]) => (
            <div key={label}>
              <p
                className="text-[10px] uppercase tracking-[0.25em] mb-2"
                style={{ color: MUTED, fontFamily: "ui-monospace, monospace" }}
              >
                {label}
              </p>
              <p className="text-base" style={{ fontFamily: "ui-monospace, monospace" }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured + collection */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl sm:text-5xl tracking-tight">The collection</h2>
          <Link
            href="/mock/a"
            className="text-xs uppercase tracking-[0.2em] hidden sm:block"
            style={{ color: MUTED, fontFamily: "ui-monospace, monospace" }}
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Large card */}
          <Link
            href="/mock/a"
            className="col-span-12 md:col-span-7 group block !rounded-3xl overflow-hidden border"
            style={{ borderColor: RULE, background: "#FBF8F2" }}
          >
            <div className="relative aspect-[5/4] w-full">
              <Image src="/images/products/lineup-all-four.jpeg" alt="all four colorways" fill className="object-cover" />
            </div>
            <div className="p-6 sm:p-8 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: ACCENT, fontFamily: "ui-monospace, monospace" }}>
                  Four colorways
                </p>
                <h3 className="text-2xl sm:text-3xl">Macro Pad v1</h3>
              </div>
              <span className="text-base" style={{ fontFamily: "ui-monospace, monospace" }}>$40</span>
            </div>
          </Link>

          {/* Right column — two cards */}
          <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-6">
            {[
              {
                title: "Keycap set",
                price: "$12",
                tag: "PBT · Cherry",
                img: "/images/products/card-rasta.jpeg",
              },
              {
                title: "PCB only",
                price: "$18",
                tag: "Open source · KiCad",
                img: "/images/products/pcb-back.jpeg",
              },
            ].map((p) => (
              <Link
                key={p.title}
                href="/mock/a"
                className="!rounded-3xl overflow-hidden border block"
                style={{ borderColor: RULE, background: "#FBF8F2" }}
              >
                <div className="grid grid-cols-2 h-full">
                  <div className="relative">
                    <Image src={p.img} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.25em] mb-2"
                        style={{ color: MUTED, fontFamily: "ui-monospace, monospace" }}
                      >
                        {p.tag}
                      </p>
                      <h3 className="text-xl">{p.title}</h3>
                    </div>
                    <span className="text-sm" style={{ fontFamily: "ui-monospace, monospace" }}>
                      {p.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial split */}
      <section className="border-t" style={{ borderColor: RULE }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20 sm:py-28 grid grid-cols-12 gap-6 sm:gap-10">
          <div className="col-span-12 md:col-span-5">
            <p
              className="text-[10px] uppercase tracking-[0.3em] mb-4"
              style={{ color: ACCENT, fontFamily: "ui-monospace, monospace" }}
            >
              On openness
            </p>
            <h2 className="text-3xl sm:text-5xl leading-[1.05] tracking-tight">
              Designed in the
              <br />
              <span style={{ fontStyle: "italic" }}>open</span>. Built to be
              <br />
              taken apart.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7">
            <div className="relative aspect-[16/10] w-full !rounded-3xl overflow-hidden">
              <Image src="/images/products/pcb-front.jpeg" alt="PCB" fill className="object-cover" />
            </div>
            <p className="mt-6 text-lg leading-relaxed max-w-xl" style={{ color: MUTED }}>
              Every part of the macro pad — the PCB, the case, the firmware, the companion app — is open source. Fork it, remix it, etch your initials into the back. We just want you to make something with it.
            </p>
            <Link
              href="/mock/a"
              className="inline-block mt-6 text-sm uppercase tracking-[0.2em] underline underline-offset-4"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              View on GitHub →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: RULE }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2">
            <p className="text-2xl tracking-tight mb-2" style={{ fontStyle: "italic" }}>sudo</p>
            <p style={{ color: MUTED }}>Open hardware, slowly made.</p>
          </div>
          {[
            ["Shop", ["Macro pad", "Keycaps", "PCB", "Bulk"]],
            ["Open", ["GitHub", "Schematics", "Firmware"]],
            ["Studio", ["About", "Journal", "Contact"]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <p
                className="text-[10px] uppercase tracking-[0.25em] mb-3"
                style={{ color: MUTED, fontFamily: "ui-monospace, monospace" }}
              >
                {title}
              </p>
              <ul className="space-y-2">
                {(items as string[]).map((i) => (
                  <li key={i}>
                    <Link href="/mock/a" className="hover:underline underline-offset-4">{i}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="max-w-[1400px] mx-auto px-6 sm:px-10 py-6 text-xs flex justify-between"
          style={{ color: MUTED, fontFamily: "ui-monospace, monospace" }}
        >
          <span>© sudo.supply</span>
          <Link href="/mock">← back to mocks</Link>
        </div>
      </footer>
    </div>
  );
}
