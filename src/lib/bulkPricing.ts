export interface PricingTier {
  min: number;
  max: number | null;
  discountPercent: number;
  label: string;
}

export const tiers: PricingTier[] = [
  { min: 5, max: 9, discountPercent: 20, label: "5–9 units" },
  { min: 10, max: 24, discountPercent: 25, label: "10–24 units" },
  { min: 25, max: 49, discountPercent: 30, label: "25–49 units" },
  { min: 50, max: 99, discountPercent: 35, label: "50–99 units" },
  { min: 100, max: null, discountPercent: 0, label: "100+ units" },
];

export function getTier(quantity: number): PricingTier | null {
  return tiers.find((t) => quantity >= t.min && (t.max === null || quantity <= t.max)) || null;
}

export function getBulkPrice(unitPrice: number, quantity: number) {
  const tier = getTier(quantity);
  if (!tier || tier.discountPercent === 0) {
    return { perUnit: unitPrice, total: unitPrice * quantity, savings: 0, tier };
  }
  const perUnit = unitPrice * (1 - tier.discountPercent / 100);
  const total = perUnit * quantity;
  const savings = unitPrice * quantity - total;
  return { perUnit, total, savings, tier };
}
