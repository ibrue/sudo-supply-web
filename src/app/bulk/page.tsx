import type { Metadata } from "next";
import { products } from "@/lib/products";
import { defaultTiers, PricingTier } from "@/lib/bulkPricing";
import { createServiceClient } from "@/lib/supabase";
import { BulkCalculator } from "./BulkCalculator";
import { BulkInquiryForm } from "./BulkInquiryForm";

export const metadata: Metadata = {
  title: "bulk orders — sudo.supply",
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
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <p className="text-text-muted text-sm mb-8 animate-fade-in">~/bulk</p>

      {/* Intro */}
      <div className="animate-fade-in-delay mb-12">
        <h1 className="font-mono text-lg mb-4">
          <span className="text-accent">$</span> sudo apt install --bulk
        </h1>
        <p className="text-text-muted text-sm leading-relaxed max-w-2xl">
          Equip your team with sudo macro pads. Minimum order of 5 units.
          The more you order, the better the per-unit price. Orders of 100+
          get custom pricing — reach out and we&apos;ll build a quote.
        </p>
      </div>

      {/* Pricing tiers */}
      <div className="glass p-6 mb-8 animate-fade-in-delay">
        <h2 className="text-accent text-xs font-mono mb-4">&gt; pricing tiers</h2>
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-2">quantity</th>
              <th className="text-right py-2">discount</th>
              <th className="text-right py-2">per unit (pad)</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.label} className="border-b border-border last:border-0">
                <td className="py-2">{tier.label}</td>
                <td className="py-2 text-right text-accent">
                  {tier.discountPercent > 0 ? `${tier.discountPercent}% off` : "custom"}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {tier.discountPercent > 0
                    ? `$${(29.0 * (1 - tier.discountPercent / 100)).toFixed(2)}`
                    : "contact us"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculator */}
      <BulkCalculator products={products} tiers={tiers} />

      {/* Inquiry form */}
      <BulkInquiryForm products={products} />
    </div>
  );
}
