"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth, UserButton } from "@clerk/nextjs";
import { AdminLink } from "./AdminLink";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured = /^pk_(test|live)_/.test(clerkKey) && !clerkKey.includes("placeholder") && !clerkKey.includes("...") && clerkKey.length >= 24;

function AuthSlot({ onNavigate }: { onNavigate?: () => void }) {
  const { isSignedIn } = useAuth();
  if (isSignedIn === true) {
    // Account itself now lives in the main nav (so it's reachable even when
    // signed out via the sign-in redirect on /account). This slot just
    // surfaces the admin link + the Clerk avatar menu for signed-in users.
    return (
      <>
        <AdminLink />
        {!onNavigate && (
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
        )}
      </>
    );
  }
  if (isSignedIn === false) {
    return (
      <Link
        href="/sign-in"
        onClick={onNavigate}
        className="px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
      >
        Sign in
      </Link>
    );
  }
  return null;
}

export function Nav() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/try", label: "Try" },
    { href: "/download", label: "App" },
    { href: "/about", label: "About" },
    { href: "/bulk", label: "Bulk" },
    // Account is reachable signed-out too — /account redirects to sign-in if
    // the user isn't authenticated, then Clerk lands them back on the page.
    // Surfacing it here makes "check my orders" a top-level affordance.
    { href: "/account", label: "Account" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-full border border-border backdrop-blur bg-bg/75">
        <Link href="/" className="font-pixel text-white text-lg pl-2 tracking-tight">
          [sudo]
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm text-text-muted">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="hidden md:flex items-center gap-2 text-sm text-text-muted">
          {isClerkConfigured && <AuthSlot />}
          <Link
            href="/cart"
            className="px-4 py-2 text-sm font-medium rounded-full text-black bg-accent hover:brightness-110 transition"
          >
            Bag{totalItems > 0 ? ` · ${totalItems}` : ""}
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/cart"
            className="px-3 py-1.5 text-sm font-medium rounded-full text-black bg-accent"
          >
            Bag{totalItems > 0 ? ` · ${totalItems}` : ""}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-text-muted hover:text-white text-2xl w-11 h-11 flex items-center justify-center -mr-2 leading-none"
            aria-label="menu"
          >
            {menuOpen ? "×" : "≡"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden max-w-[1280px] mx-auto mt-2 rounded-2xl border border-border bg-bg/95 backdrop-blur p-2 flex flex-col gap-1 text-base">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl hover:bg-white/10 text-text-muted hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          {isClerkConfigured && (
            <div className="flex flex-col gap-1 pt-2 border-t border-border mt-2">
              <AuthSlot onNavigate={() => setMenuOpen(false)} />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
