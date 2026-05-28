"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { getBulkPrice, PricingTier } from "@/lib/bulkPricing";
import { toastBus, sudoCmd } from "@/lib/toastBus";

export function BulkCalculator({ products, tiers }: { products: Product[]; tiers?: PricingTier[] }) {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug || "");
  const [quantity, setQuantity] = useState(5);

  const product = products.find((p) => p.slug === selectedSlug) || products[0];
  const { perUnit, total, savings, tier } = getBulkPrice(product?.price || 40, quantity, tiers);

  function handleCalculate() {
    toastBus.emit(
      sudoCmd.bulkOrder(selectedSlug, quantity),
      tier?.discountPercent
        ? `Bulk pricing applied: ${tier.discountPercent}% off (${tier.label})`
        : "Custom pricing. Submit inquiry below."
    );
  }

  const inputClass =
    "w-full bg-transparent border border-border rounded-2xl px-4 py-2.5 text-sm font-mono focus:border-accent outline-none";

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 mb-8">
      <p className="text-xs uppercase tracking-[0.2em] mb-4 text-accent font-mono">
        Price calculator
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-text-muted text-xs block mb-1.5 font-mono">product</label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className={inputClass}
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-bg">
                {p.name} · ${p.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-text-muted text-xs block mb-1.5 font-mono">quantity (min 5)</label>
          <input
            type="number"
            min={5}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(5, parseInt(e.target.value) || 5))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Price breakdown — card */}
      <div className="rounded-2xl border border-border p-5 mb-6 space-y-2 font-mono text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Retail price</span>
          <span className="tabular-nums">${(product?.price || 40).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Quantity</span>
          <span className="tabular-nums">{quantity}</span>
        </div>
        {tier && tier.discountPercent > 0 && (
          <div className="flex justify-between text-accent">
            <span>Discount</span>
            <span>{tier.discountPercent}% ({tier.label})</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Unit price</span>
          <span className="tabular-nums">${perUnit.toFixed(2)}</span>
        </div>
        <div className="border-t border-border my-2" />
        <div className="flex justify-between text-base">
          <span className="font-semibold">Total</span>
          <span className="tabular-nums font-bold">${total.toFixed(2)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-accent">
            <span>You save</span>
            <span className="tabular-nums">${savings.toFixed(2)}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
      >
        {quantity >= 100 ? "Request custom quote →" : "Calculate"}
      </button>
    </div>
  );
}
