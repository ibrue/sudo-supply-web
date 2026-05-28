"use client";

import { useState, useEffect } from "react";
import { PricingTier, defaultTiers } from "@/lib/bulkPricing";

export default function AdminPricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>(defaultTiers);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings?key=bulk_pricing_tiers")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.value) && data.value.length > 0) {
          setTiers(data.value);
        }
      })
      .catch(() => {});
  }, []);

  function updateTier(index: number, field: keyof PricingTier, value: string | number | null) {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
    setSaved(false);
  }

  function addTier() {
    const last = tiers[tiers.length - 1];
    const newMin = last ? (last.max ? last.max + 1 : last.min + 50) : 5;
    setTiers((prev) => [
      ...prev,
      { min: newMin, max: newMin + 9, discountPercent: 0, label: `${newMin}–${newMin + 9} units` },
    ]);
    setSaved(false);
  }

  function removeTier(index: number) {
    setTiers((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  function autoLabel(tier: PricingTier): string {
    if (tier.max === null) return `${tier.min}+ units`;
    return `${tier.min}–${tier.max} units`;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    // Auto-generate labels
    const updated = tiers.map((t) => ({ ...t, label: autoLabel(t) }));

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "bulk_pricing_tiers", value: updated }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setTiers(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border border-border rounded-2xl px-4 py-2.5 text-sm text-text focus:border-accent outline-none";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Admin</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">Bulk pricing tiers</h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-accent text-sm">&#9679; saved</span>}
          {error && <span className="text-error text-sm">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save tiers"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 space-y-4">
        <p className="text-text-muted text-sm mb-2">
          Configure bulk pricing tiers. Set the last tier&apos;s max to empty for &quot;100+ units&quot; custom pricing.
          The starting discount % sets the tone for the whole tier structure.
        </p>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-3 text-text-muted text-xs font-mono uppercase tracking-[0.2em] pb-3 border-b border-border">
          <div className="col-span-2">Min qty</div>
          <div className="col-span-2">Max qty</div>
          <div className="col-span-3">Discount %</div>
          <div className="col-span-3">Per unit ($40)</div>
          <div className="col-span-2">Actions</div>
        </div>

        {tiers.map((tier, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-2">
              <input
                type="number"
                min={1}
                value={tier.min}
                onChange={(e) => updateTier(i, "min", parseInt(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min={tier.min}
                value={tier.max ?? ""}
                placeholder="none"
                onChange={(e) =>
                  updateTier(i, "max", e.target.value ? parseInt(e.target.value) : null)
                }
                className={inputClass}
              />
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={tier.discountPercent}
                  onChange={(e) => updateTier(i, "discountPercent", parseInt(e.target.value) || 0)}
                  className={inputClass}
                />
                <span className="text-text-muted text-sm">%</span>
              </div>
            </div>
            <div className="col-span-3">
              <span className="font-mono text-sm tabular-nums">
                {tier.discountPercent > 0 ? (
                  <span className="text-accent">
                    ${(40 * (1 - tier.discountPercent / 100)).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-text-muted">custom</span>
                )}
              </span>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => removeTier(i)}
                className="text-error text-sm hover:underline"
              >
                remove
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addTier}
          className="px-5 py-2.5 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition mt-4"
        >
          + Add tier
        </button>
      </div>

      {/* Preview */}
      <div className="rounded-3xl border border-border bg-surface p-6 mt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">Preview (as shown on /bulk)</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-[0.2em] font-mono">
              <th className="text-left py-3">Quantity</th>
              <th className="text-right py-3">Discount</th>
              <th className="text-right py-3">Per unit</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-3">{autoLabel(tier)}</td>
                <td className="py-3 text-right text-accent">
                  {tier.discountPercent > 0 ? `${tier.discountPercent}% off` : "custom"}
                </td>
                <td className="py-3 text-right tabular-nums font-mono">
                  {tier.discountPercent > 0
                    ? `$${(40 * (1 - tier.discountPercent / 100)).toFixed(2)}`
                    : "contact us"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
