"use client";

import { useEffect, useState } from "react";

interface Props {
  slug: string;
  soldCount?: number;
}

export function SocialProofBadge({ slug, soldCount = 0 }: Props) {
  const [activeCarts, setActiveCarts] = useState(0);

  useEffect(() => {
    // Fetch active cart count
    fetch(`/api/cart-activity?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.active_carts) setActiveCarts(data.active_carts);
      })
      .catch(() => {});
  }, [slug]);

  return (
    <div className="flex items-center gap-4 text-xs font-mono">
      {soldCount > 0 && (
        <span className="text-accent">
          &#9679; {soldCount} deployed
        </span>
      )}
      {activeCarts > 0 && (
        <span className="text-text-muted animate-fade-in">
          &#9679; in {activeCarts} {activeCarts === 1 ? "cart" : "carts"} right now
        </span>
      )}
    </div>
  );
}
