"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function WaitlistButton({ productSlug }: { productSlug: string }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isSignedIn } = useAuth();

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
      <div className="w-full py-3 border border-accent text-accent uppercase text-sm text-center">
        [ ON WAITLIST ]
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={isSignedIn ? "your email for notifications" : "email@example.com"}
        required
        className="w-full bg-transparent border border-border p-3 text-sm text-text font-mono focus:border-accent outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn-terminal-accent w-full text-center disabled:opacity-50"
      >
        {submitting ? "[ JOINING... ]" : "[ NOTIFY ME WHEN AVAILABLE ]"}
      </button>
    </form>
  );
}
