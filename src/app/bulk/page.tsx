import type { Metadata } from "next";
import { products } from "@/lib/products";
import { defaultTiers, PricingTier } from "@/lib/bulkPricing";
import { createServiceClient } from "@/lib/supabase";
import { BulkCalculator } from "./BulkCalculator";
import { BulkInquiryForm } from "./BulkInquiryForm";

export const metadata: Metadata = {
  title: "bulk orders · sudo.supply",
  description:
    "Equip your whole team with sudo macro pads. Minimum order of 5. Bulk pricing with volume discounts.",
};

async function loadTiers(): Promise<PricingTier[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "bulk_pricing_tiers")
      .single();
    if (Array.isArray(data?.value) && data.value.length > 0) {
      return data.value;
    }
  } catch {
    // Table may not exist yet
  }
  return defaultTiers;
}

export default async function BulkPage() {
  const tiers = await loadTiers();

  return (
    <div className="pt-32 pb-16 max-w-[1100px] mx-auto px-4 sm:px-8">
      {/* Intro */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-pixel">
          Bulk · for teams
        </p>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95]">
          Equip the
          <br />
          <span className="text-accent">whole team.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-text-muted leading-relaxed">
          Minimum order of 5 units. The more you order, the better the per-unit price. Orders of 100+ get custom pricing. Reach out and we&apos;ll build a quote.
        </p>
      </div>

      {/* Pricing tiers */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 mb-8">
        <p className="text-xs uppercase tracking-[0.2em] mb-4 text-accent font-pixel">
          Pricing tiers
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left py-3 font-mono font-normal">Quantity</th>
                <th className="text-right py-3 font-mono font-normal">Discount</th>
                <th className="text-right py-3 font-mono font-normal">Per unit (pad)</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.label} className="border-b border-border last:border-0">
                  <td className="py-3">{tier.label}</td>
                  <td className="py-3 text-right text-accent font-mono">
                    {tier.discountPercent > 0 ? `${tier.discountPercent}% off` : "custom"}
                  </td>
                  <td className="py-3 text-right tabular-nums font-mono">
                    {tier.discountPercent > 0
                      ? `$${(40.0 * (1 - tier.discountPercent / 100)).toFixed(2)}`
                      : "contact us"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculator */}
      <BulkCalculator products={products} tiers={tiers} />

      {/* Inquiry form */}
      <BulkInquiryForm products={products} />
    </div>
  );
}
