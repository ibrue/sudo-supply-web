interface FaqItem {
  q: string;
  a: React.ReactNode;
}

const items: FaqItem[] = [
  {
    q: "Which AI tools does this actually work with?",
    a: (
      <>
        Out of the box: Claude (desktop + claude.ai), ChatGPT (desktop + web), Grok, Cursor, VS Code,
        Windsurf, and any terminal-based agent. The companion app detects buttons via the
        accessibility tree first, then OCR, then keyboard fallback, so it adapts to most AI surfaces
        without a custom integration.
      </>
    ),
  },
  {
    q: "Can I remap the keys?",
    a: (
      <>
        Yes. The pad ships with QMK firmware and VIA + Vial support, so you can remap keys live
        without reflashing. There&apos;s also a 4-button quick-preset library in the companion app
        (approve / reject / make-it-better / yolo, media controls, system shortcuts, Discord
        soundboard, etc.).
      </>
    ),
  },
  {
    q: "Are the switches hot-swap?",
    a: (
      <>
        Yes, all four switches are MX-style hot-swap. Bring your favorite tactile, linear, or
        clicky switches. Stock units ship with quiet linears.
      </>
    ),
  },
  {
    q: "What OS support is there?",
    a: (
      <>
        The companion app is macOS 13+ today (Apple Silicon native). Windows support is coming soon.
        The macropad itself is plain USB-HID, so it works as a keyboard on any machine with a USB
        port (macOS, Windows, or Linux) even without the app.
      </>
    ),
  },
  {
    q: "What's the return policy on a hand-assembled unit?",
    a: (
      <>
        30 days, unopened and in original packaging, for a full refund. If something arrives broken
        or fails within the 1-year warranty period, we replace it. Just email us with a photo.
      </>
    ),
  },
  {
    q: "Do you ship internationally?",
    a: (
      <>
        Yes. Free shipping in the US on orders over $100. International is flat-rate at checkout;
        duties and taxes are calculated by the carrier on delivery.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] mb-2 text-accent font-mono">
          $ sudo --help
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Frequently asked.
        </h2>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-border bg-surface overflow-hidden [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <span className="font-semibold text-text">{item.q}</span>
              <span className="text-text-muted text-2xl leading-none shrink-0 group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-text-muted leading-relaxed border-t border-border pt-4">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
