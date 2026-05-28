"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/bulk", label: "Bulk inquiries" },
  { href: "/admin/pricing", label: "Pricing" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10">
      <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-mono">
        $ sudo admin --section
      </p>
      <div className="flex flex-wrap items-center gap-1 text-sm">
        {navLinks.map((l) => {
          // Dashboard ("/admin") only matches exactly; every other link is
          // active when the path starts with its href so nested routes
          // (e.g. /admin/products/<slug>/edit) keep the parent highlighted.
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`px-4 py-2 rounded-full border transition-colors ${
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:border-white/30 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
