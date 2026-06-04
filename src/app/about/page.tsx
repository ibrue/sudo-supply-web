import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "about · sudo.supply",
  description:
    "We made a tiny keyboard because we got tired of clicking 'allow.' The story behind sudo.supply: open hardware for AI workflows.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-16 max-w-[1100px] mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-pixel">
          About · the studio
        </p>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95]">
          We made a tiny keyboard
          <br />
          because we got tired of
          <br />
          <span className="text-accent">clicking &quot;allow.&quot;</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* The story */}
        <section className="md:col-span-7 rounded-3xl border border-border bg-surface p-8">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-pixel">The story</p>
          <h2 className="text-2xl font-bold mb-4">Permission, with friction.</h2>
          <p className="text-text-muted leading-relaxed">
            sudo.supply was born from a simple frustration: AI agents asking for permission, and having no satisfying way to say yes. We build mechanical macro pads for developers who live in the terminal and work alongside AI every day. A tactile way to approve, reject, or override, because critical decisions shouldn&apos;t be buried in a terminal prompt.
          </p>
        </section>

        {/* OSHW badge */}
        <section className="md:col-span-5 rounded-3xl border border-border bg-surface p-8 flex flex-col">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-pixel">Open hardware</p>
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/images/oshw-logo.svg"
              alt="OSHW Logo"
              width={56}
              height={56}
              style={{ filter: "invert(55%) sepia(95%) saturate(1000%) hue-rotate(90deg) brightness(105%)" }}
            />
            <h2 className="text-xl font-bold">Certified OSHW.</h2>
          </div>
          <p className="text-text-muted leading-relaxed text-sm">
            The sudo macro pad is certified Open Source Hardware. You can manufacture, modify, and distribute it freely. All design files live in our GitHub repo.
          </p>
        </section>

        {/* Ecosystem */}
        <section className="md:col-span-12 rounded-3xl border border-border bg-surface p-8">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-pixel">The ecosystem</p>
          <h2 className="text-2xl font-bold mb-4">More than one button.</h2>
          <p className="text-text-muted leading-relaxed max-w-3xl">
            What started as a single approve button has grown into a full developer platform. The companion app detects AI apps automatically, finds buttons via accessibility tree + OCR + keyboard fallback, and supports macro sequences, per-app profiles, and quick presets for everything from Claude Code to Discord soundboards. A local developer API on port 7483 with webhooks, an MCP server mode for gating AI tool use behind physical approval, and a plugin system make it extensible. Anonymous telemetry feeds a public analytics dashboard, and OTA updates keep everything current.
          </p>
        </section>
      </div>

      {/* Contact card */}
      <section className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.2em] mb-3 text-accent font-pixel">Get in touch</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">
          Email or fork. Both work.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          {[
            { label: "Email", value: "ianbrueggeman@gmail.com", href: "mailto:ianbrueggeman@gmail.com" },
            { label: "Repo · web", value: "ibrue/sudo-supply-web", href: "https://github.com/ibrue/sudo-supply-web" },
            { label: "Repo · app", value: "ibrue/sudo-app", href: "https://github.com/ibrue/sudo-app" },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group block rounded-2xl border border-border p-5 hover:border-accent/40 transition-colors"
            >
              <p className="text-xs tracking-[0.2em] mb-2 text-text-muted font-mono">
                [ {c.label.toLowerCase()} ]
              </p>
              <p className="font-mono text-accent group-hover:underline break-all">{c.value}</p>
            </a>
          ))}
        </div>
        <Link
          href="/shop"
          className="inline-block mt-8 px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
        >
          Shop the pad · $40
        </Link>
      </section>
    </div>
  );
}
