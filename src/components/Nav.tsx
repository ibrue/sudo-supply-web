"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth, UserButton } from "@clerk/nextjs";
import { AdminLink } from "./AdminLink";

export function Nav() {
  const { totalItems } = useCart();
  const { isSignedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = "hover-accent text-text-muted hover:text-text transition-colors";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="hover-accent flex items-center">
          <span className="font-pixel text-white text-lg">[sudo]</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/shop" className={linkClass}>~/shop</Link>
          <Link href="/download" className={linkClass}>~/app</Link>
          <Link href="/about" className={linkClass}>~/about</Link>
          <Link href="/bulk" className={linkClass}>~/bulk</Link>
          <Link href="/cart" className={linkClass}>
            ~/cart{totalItems > 0 && <span className="text-accent ml-1">[{totalItems}]</span>}
          </Link>
          {isSignedIn === true ? (
            <>
              <Link href="/account" className={linkClass}>~/account</Link>
              <AdminLink />
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7 border border-[#1e1e1e]" } }} />
            </>
          ) : isSignedIn === false ? (
            <Link href="/sign-in" className="hover-accent text-accent transition-colors">[ login ]</Link>
          ) : null}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="text-text-muted text-sm">
            ~/cart{totalItems > 0 && <span className="text-accent ml-1">[{totalItems}]</span>}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-text-muted hover:text-accent text-sm font-mono"
          >
            {menuOpen ? "[×]" : "[≡]"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-sm">
          <div className="px-4 py-4 flex flex-col gap-3 text-sm">
            <Link href="/shop" onClick={() => setMenuOpen(false)} className={linkClass}>~/shop</Link>
            <Link href="/download" onClick={() => setMenuOpen(false)} className={linkClass}>~/app</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className={linkClass}>~/about</Link>
            <Link href="/bulk" onClick={() => setMenuOpen(false)} className={linkClass}>~/bulk</Link>
            {isSignedIn === true ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)} className={linkClass}>~/account</Link>
                <AdminLink />
              </>
            ) : isSignedIn === false ? (
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="text-accent">[ login ]</Link>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
