"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  body: string;
  created_at: string;
}

export function ReviewSection({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    fetch(`/api/reviews?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .finally(() => setLoading(false));
  }, [slug, submitted]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  function renderStars(n: number) {
    return "*".repeat(n) + "-".repeat(5 - n);
  }

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
    <section className="mt-16">
      <h2 className="font-mono text-xs text-accent mb-4">
        &gt; reviews {avgRating && `[${avgRating}/5]`}
      </h2>

      {loading ? (
        <p className="text-text-muted text-sm">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-text-muted text-sm mb-6">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((review) => (
            <div key={review.id} className="glass p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-accent text-xs font-mono">[{renderStars(review.rating)}]</span>
                <span className="text-text-muted text-xs">{review.user_name}</span>
              </div>
              <p className="text-text-muted text-sm">{review.body}</p>
              <p className="text-text-muted text-xs mt-2">
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {isSignedIn && (
        <form onSubmit={handleSubmit} className="glass p-4 space-y-4">
          <p className="text-xs text-text-muted">write a review</p>
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-xs">rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-sm font-mono ${n <= rating ? "text-accent" : "text-text-muted"}`}
              >
                *
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="your review..."
            required
            rows={3}
            className="w-full bg-transparent border border-border p-3 text-sm text-text font-mono focus:border-accent outline-none resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="btn-terminal text-xs disabled:opacity-50"
          >
            {submitting ? "[ SUBMITTING... ]" : "[ SUBMIT REVIEW ]"}
          </button>
        </form>
      )}
    </section>
  );
}
