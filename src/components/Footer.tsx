import Link from "next/link";

const sections: { title: string; items: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Shop",
    items: [
      { label: "Macro pad", href: "/shop" },
      { label: "Keycaps", href: "/shop" },
      { label: "Bulk", href: "/bulk" },
    ],
  },
  {
    title: "Open",
    items: [
      { label: "GitHub", href: "https://github.com/ibrue/sudo-supply-web", external: true },
      { label: "Firmware", href: "https://github.com/ibrue/sudo-app", external: true },
      { label: "Analytics", href: "/analytics" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "About", href: "/about" },
      { label: "App", href: "/download" },
      { label: "Account", href: "/account" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-12 pt-16">
      <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
        <div className="grid grid-cols-12 gap-8 mb-10">
          <div className="col-span-12 md:col-span-5">
            <p className="font-pixel text-3xl text-white mb-3">[sudo]</p>
            <p className="text-text-muted max-w-sm text-sm">
              Open hardware, hand-assembled in small batches. Approve, reject, and control AI agents with a physical command line.
            </p>
          </div>
          {sections.map((s) => (
            <div key={s.title} className="col-span-6 md:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted mb-3 font-mono">
                [ {s.title.toLowerCase()} ]
              </p>
              <ul className="space-y-2 text-sm">
                {s.items.map((i) =>
                  i.external ? (
                    <li key={i.label}>
                      <a
                        href={i.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-white transition-colors"
                      >
                        {i.label}
                      </a>
                    </li>
                  ) : (
                    <li key={i.label}>
                      <Link href={i.href} className="text-text-muted hover:text-white transition-colors">
                        {i.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-text-muted pt-6 border-t border-border font-mono">
          <span>© {new Date().getFullYear()} sudo.supply · open source hardware</span>
          <span className="flex items-center gap-2">
            built for humans in the loop
            <span className="font-pixel text-accent text-sm">:)</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
