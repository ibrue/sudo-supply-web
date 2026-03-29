"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const label = product.inStock ? "ADD TO CART" : "PRE-ORDER";
  const addedLabel = product.inStock ? "ADDED \u2713" : "PRE-ORDERED \u2713";

  return (
    <div className="mt-auto">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="btn-terminal px-3 py-1 text-xs"
        >
          [ - ]
        </button>
        <span className="font-mono text-lg tabular-nums w-8 text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="btn-terminal px-3 py-1 text-xs"
        >
          [ + ]
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="btn-terminal-accent w-full text-center"
      >
        {added ? `[ ${addedLabel} ]` : `[ ${label} ]`}
      </button>
      {!product.inStock && (
        <p className="text-text-muted text-xs mt-2 text-center">
          ships when back in stock
        </p>
      )}
    </div>
  );
}
