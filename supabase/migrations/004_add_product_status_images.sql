-- Add status, images, stock count, and lead time to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS status text DEFAULT 'published' NOT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_count integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS lead_time text DEFAULT '';

-- Enable Supabase Storage for product images
-- (Storage bucket must be created via Supabase dashboard or API)
-- Bucket name: product-images, public: true
