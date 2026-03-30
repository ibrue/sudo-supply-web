-- Key-value settings store for admin-configurable options
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are publicly readable" ON settings FOR SELECT USING (true);
CREATE POLICY "Service role can manage settings" ON settings FOR ALL USING (true);

-- Seed default bulk pricing tiers
INSERT INTO settings (key, value) VALUES (
  'bulk_pricing_tiers',
  '[
    {"min": 5, "max": 9, "discountPercent": 20, "label": "5–9 units"},
    {"min": 10, "max": 24, "discountPercent": 25, "label": "10–24 units"},
    {"min": 25, "max": 49, "discountPercent": 30, "label": "25–49 units"},
    {"min": 50, "max": 99, "discountPercent": 35, "label": "50–99 units"},
    {"min": 100, "max": null, "discountPercent": 0, "label": "100+ units"}
  ]'::jsonb
) ON CONFLICT (key) DO NOTHING;
