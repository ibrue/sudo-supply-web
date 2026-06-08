"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured =
  /^pk_(test|live)_/.test(clerkKey) &&
  !clerkKey.includes("placeholder") &&
  !clerkKey.includes("...") &&
  clerkKey.length >= 24;

function WaitlistForm({ productSlug, isSignedIn }: { productSlug: string; isSignedIn: boolean }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_slug: productSlug, email }),
    });
    setSubmitting(false);
    setJoined(true);
  }

  if (joined) {
    return (
      <div className="w-full py-3 px-5 rounded-full border border-accent text-accent text-sm text-center font-semibold">
        ✓ You&apos;re on the list
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={isSignedIn ? "your email" : "email@example.com"}
        required
        className="flex-1 bg-transparent border border-border rounded-full px-4 py-2.5 text-sm text-text focus:border-accent outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 disabled:opacity-50 transition whitespace-nowrap"
      >
        {submitting ? "Joining…" : "Notify me"}
      </button>
    </form>
  );
}

// useAuth() lives here and is called UNCONDITIONALLY — this component is only
// mounted when Clerk is configured, so hook order is stable (rules-of-hooks
// safe). Mirrors the ReviewSection/QASection pattern.
function WaitlistFormWithAuth({ productSlug }: { productSlug: string }) {
  const { isSignedIn } = useAuth();
  return <WaitlistForm productSlug={productSlug} isSignedIn={!!isSignedIn} />;
}

export function WaitlistButton({ productSlug }: { productSlug: string }) {
  return isClerkConfigured ? (
    <WaitlistFormWithAuth productSlug={productSlug} />
  ) : (
    <WaitlistForm productSlug={productSlug} isSignedIn={false} />
  );
}
