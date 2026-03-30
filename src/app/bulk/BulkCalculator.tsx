"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { getBulkPrice, PricingTier } from "@/lib/bulkPricing";
import { toastBus, sudoCmd } from "@/lib/toastBus";

function dotFill(label: string, value: string, width: number = 45) {
  const dots = Math.max(2, width - label.length - value.length);
  return `${label} ${"·".repeat(dots)} ${value}`;
}

export function BulkCalculator({ products, tiers }: { products: Product[]; tiers?: PricingTier[] }) {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug || "");
  const [quantity, setQuantity] = useState(5);

  const product = products.find((p) => p.slug === selectedSlug) || products[0];
  const { perUnit, total, savings, tier } = getBulkPrice(product?.price || 29, quantity, tiers);

  function handleCalculate() {
    toastBus.emit(
      sudoCmd.bulkOrder(selectedSlug, quantity),
      tier?.discountPercent
        ? `Bulk pricing applied: ${tier.discountPercent}% off (${tier.label})`
        : "Custom pricing — submit inquiry below."
    );
  }

  return (
    <div className="glass p-6 mb-8">
      <h2 className="text-accent text-xs font-mono mb-4">&gt; price calculator</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-text-muted text-xs block mb-1">product</label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full bg-transparent border border-border px-3 py-2 text-sm text-text font-mono focus:border-accent outline-none"
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-bg">
                {p.name} — ${p.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-text-muted text-xs block mb-1">quantity (min 5)</label>
          <input
            type="number"
            min={5}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(5, parseInt(e.target.value) || 5))}
            className="w-full bg-transparent border border-border px-3 py-2 text-sm text-text font-mono focus:border-accent outline-none"
          />
        </div>
      </div>

      {/* Terminal-style price breakdown */}
      <div className="font-mono text-sm space-y-1 mb-4">
        <p className="text-accent">bulk@sudo.supply ~&gt;</p>
        <p className="whitespace-pre text-text-muted">
          {dotFill("retail_price", `$${(product?.price || 29).toFixed(2)}`)}
        </p>
        <p className="whitespace-pre text-text-muted">
          {dotFill("quantity", String(quantity))}
        </p>
        {tier && tier.discountPercent > 0 && (
          <p className="whitespace-pre text-accent">
            {dotFill("discount", `${tier.discountPercent}% (${tier.label})`)}
          </p>
        )}
        <p className="whitespace-pre">
          {dotFill("unit_price", `$${perUnit.toFixed(2)}`)}
        </p>
        <div className="border-t border-border my-2" />
        <p className="whitespace-pre text-base">
          {dotFill("total", `$${total.toFixed(2)}`)}
        </p>
        {savings > 0 && (
          <p className="whitespace-pre text-accent">
            {dotFill("savings", `$${savings.toFixed(2)}`)}
          </p>
        )}
      </div>

      <button onClick={handleCalculate} className="btn-terminal-accent text-xs w-full text-center">
        {quantity >= 100 ? "[ REQUEST CUSTOM QUOTE ]" : "[ CALCULATE ]"}
      </button>
    </div>
  );
}
