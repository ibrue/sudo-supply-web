import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "internal mocks · sudo.supply",
  robots: { index: false, follow: false },
};

const mocks = [
  {
    slug: "a",
    name: "Editorial Soft",
    blurb: "Warm off-white. Serif display. Teenage Engineering / Aesop / NuPhy energy.",
    bg: "#F5F1EA",
    fg: "#1A1814",
  },
  {
    slug: "b",
    name: "Sharp Tech",
    blurb: "Near-black with dotted grid. Big sans-serif. Linear / Vercel / Work Louder.",
    bg: "#0A0A0A",
    fg: "#FAFAFA",
  },
  {
    slug: "c",
    name: "Playful Bold",
    blurb: "Oversized type with color blocks pulled from the Rasta keycaps. Modern DTC.",
    bg: "#FAFAFA",
    fg: "#0A0A0A",
  },
  {
    slug: "d",
    name: "Press Buttons (fused)",
    blurb: "C's oversized type + B's dark palette + the [sudo] pixel mark. Recommended.",
    bg: "#0A0A0A",
    fg: "#2EA468",
  },
];

export default function MockIndex() {
  return (
    <div
      className="min-h-screen w-full px-6 py-16 sm:px-12 sm:py-24"
      style={{ background: "#fff", color: "#111", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">sudo.supply / mocks</p>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-6">
          Pick a direction.
        </h1>
        <p className="text-neutral-600 text-lg max-w-xl mb-12">
          Three takes on a clean Framer-style redesign. Click any to preview the full homepage. You can tell me which one to roll across the rest of the site.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mocks.map((m) => (
            <Link
              key={m.slug}
              href={`/mock/${m.slug}`}
              className="group block !rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-900 transition-all"
            >
              <div
                className="aspect-[4/5] flex items-end p-6"
                style={{ background: m.bg, color: m.fg }}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] opacity-60 mb-2">
                    Mock {m.slug.toUpperCase()}
                  </p>
                  <h2 className="text-2xl font-semibold mb-2">{m.name}</h2>
                  <p className="text-sm opacity-80 leading-snug">{m.blurb}</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-white text-sm text-neutral-900 flex items-center justify-between">
                <span>Preview →</span>
                <span className="text-neutral-400">/mock/{m.slug}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-sm text-neutral-500">
          <Link href="/" className="underline hover:text-neutral-900">← back to current site</Link>
        </div>
      </div>
    </div>
  );
}
