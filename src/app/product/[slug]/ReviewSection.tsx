"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured = clerkKey.startsWith("pk_") && !clerkKey.includes("placeholder");

// useAuth() throws when called outside <ClerkProvider/>. Isolate it in a
// child that only renders when Clerk is configured, so the parent never
// invokes the hook in environments without a key.
function SignedInOnly({ children }: { children: (signedIn: boolean) => React.ReactNode }) {
  const { isSignedIn } = useAuth();
  return <>{children(!!isSignedIn)}</>;
}

function AuthGate({ children }: { children: (signedIn: boolean) => React.ReactNode }) {
  if (!isClerkConfigured) return <>{children(false)}</>;
  return <SignedInOnly>{children}</SignedInOnly>;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  body: string;
  created_at: string;
}

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? "text-accent" : "text-text-muted/30"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ReviewSection({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .finally(() => setLoading(false));
  }, [slug, submitted]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_slug: slug, rating, body }),
    });
    setBody("");
    setSubmitting(false);
    setSubmitted((s) => !s);
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Reviews</h2>
        {avgRating !== null && (
          <div className="flex items-center gap-2">
            <Stars value={Math.round(avgRating)} />
            <span className="text-text-muted text-sm font-mono">
              {avgRating.toFixed(1)} / 5 · {reviews.length}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-text-muted text-sm font-mono">
          $ sudo cat /reviews/{slug} <span className="animate-blink">▌</span>
        </p>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 mb-6 text-center">
          <p className="font-pixel text-accent text-xl mb-2">[ :) ]</p>
          <p className="text-text-muted text-sm">No reviews yet. Be the first.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-2">
                <Stars value={review.rating} />
                <span className="text-text-muted text-xs font-mono">{review.user_name}</span>
              </div>
              <p className="text-text">{review.body}</p>
              <p className="text-text-muted text-xs mt-3 font-mono">
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <AuthGate>
        {(isSignedIn) => isSignedIn && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-mono">
            Leave a review
          </p>
          <div className="flex items-center gap-3">
            <span className="text-text-muted text-sm">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-xl transition-colors ${
                  n <= rating ? "text-accent" : "text-text-muted hover:text-white"
                }`}
                aria-label={`${n} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you think?"
            required
            rows={3}
            className="w-full bg-transparent border border-border rounded-xl p-3 text-sm text-text focus:border-accent outline-none resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </form>
        )}
      </AuthGate>
    </section>
  );
}
