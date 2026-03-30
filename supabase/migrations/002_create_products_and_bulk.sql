-- Products table (migrated from hardcoded products.ts)
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  description text NOT NULL,
  long_description text NOT NULL DEFAULT '',
  in_stock boolean DEFAULT true,
  image text NOT NULL DEFAULT '/images/macro-pad-placeholder.svg',
  specs jsonb DEFAULT '{}',
  shopify_variant_id text,
  sold_count integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart activity for social proof
CREATE TABLE IF NOT EXISTS cart_activity (
  product_slug text PRIMARY KEY REFERENCES products(slug),
  active_carts integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Bulk order inquiries
CREATE TABLE IF NOT EXISTS bulk_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  product_slug text NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 5),
  notes text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
CREATE POLICY "Service role can manage products" ON products FOR ALL USING (true);

ALTER TABLE cart_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cart activity is publicly readable" ON cart_activity FOR SELECT USING (true);
CREATE POLICY "Service role can manage cart activity" ON cart_activity FOR ALL USING (true);

ALTER TABLE bulk_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage bulk inquiries" ON bulk_inquiries FOR ALL USING (true);

-- Function to increment sold count
CREATE OR REPLACE FUNCTION increment_sold_count(p_slug text, qty integer)
RETURNS void AS $$
BEGIN
  UPDATE products SET sold_count = sold_count + qty, updated_at = now()
  WHERE slug = p_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
