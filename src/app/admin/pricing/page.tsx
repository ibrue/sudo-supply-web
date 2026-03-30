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
    "w-full bg-transparent border border-border px-3 py-2 text-sm text-text font-mono focus:border-accent outline-none";

  return (
    <div className="animate-fade-in-delay">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-accent text-xs font-mono">&gt; bulk pricing tiers</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-accent text-xs font-mono">&#9679; saved</span>}
          {error && <span className="text-error text-xs font-mono">{error}</span>}
          <button onClick={handleSave} disabled={saving} className="btn-terminal-accent text-xs disabled:opacity-50">
            {saving ? "[ SAVING... ]" : "[ SAVE TIERS ]"}
          </button>
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <p className="text-text-muted text-xs mb-4">
          Configure bulk pricing tiers. Set the last tier&apos;s max to empty for &quot;100+ units&quot; custom pricing.
          The starting discount % sets the tone for the whole tier structure.
        </p>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-3 text-text-muted text-xs font-mono uppercase tracking-wider pb-2 border-b border-border">
          <div className="col-span-2">min qty</div>
          <div className="col-span-2">max qty</div>
          <div className="col-span-3">discount %</div>
          <div className="col-span-3">per unit ($29)</div>
          <div className="col-span-2">actions</div>
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
                    ${(29 * (1 - tier.discountPercent / 100)).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-text-muted">custom</span>
                )}
              </span>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => removeTier(i)}
                className="text-error text-xs hover:underline font-mono"
              >
                [ remove ]
              </button>
            </div>
          </div>
        ))}

        <button onClick={addTier} className="btn-terminal text-xs mt-4">
          [ + ADD TIER ]
        </button>
      </div>

      {/* Preview */}
      <div className="glass p-6 mt-6">
        <h2 className="text-accent text-xs font-mono mb-4">&gt; preview (as shown on /bulk)</h2>
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-2">quantity</th>
              <th className="text-right py-2">discount</th>
              <th className="text-right py-2">per unit</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-2">{autoLabel(tier)}</td>
                <td className="py-2 text-right text-accent">
                  {tier.discountPercent > 0 ? `${tier.discountPercent}% off` : "custom"}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {tier.discountPercent > 0
                    ? `$${(29 * (1 - tier.discountPercent / 100)).toFixed(2)}`
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
