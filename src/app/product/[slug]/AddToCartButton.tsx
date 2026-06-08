"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1500);
  };

  // Everything is always buyable — out-of-stock units become preorders that
  // ship with the next batch. The shipping estimate switches accordingly.
  const shipEstimate = product.inStock
    ? product.leadTime || "3–5 days"
    : product.preorderLeadTime || product.leadTime || "2–3 weeks";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border px-1.5 py-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors text-xl sm:text-lg leading-none"
            aria-label="decrease quantity"
          >
            −
          </button>
          <span className="font-mono text-base tabular-nums w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-11 h-11 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors text-xl sm:text-lg leading-none"
            aria-label="increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 px-5 sm:px-6 py-3.5 sm:py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
        >
          {added
            ? "Added ✓"
            : `Add to bag · $${(product.price * quantity).toFixed(2)}`}
        </button>
      </div>

      {!product.inStock && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm">
          <p className="text-accent font-mono text-xs uppercase tracking-wider mb-1">
            [ preorder ]
          </p>
          <p className="text-text">
            Current batch is sold out. Your order is reserved for the next batch, charged now, ships in <span className="text-accent font-semibold">{shipEstimate}</span>.
          </p>
        </div>
      )}

      {product.inStock && (
        <p className="text-text-muted text-xs font-mono">
          $ ships in <span className="text-accent">{shipEstimate}</span>
        </p>
      )}

      {quantity >= 5 && (
        <Link href="/bulk" className="text-accent text-sm hover:underline">
          Ordering {quantity}+? Check bulk pricing →
        </Link>
      )}
    </div>
  );
}
