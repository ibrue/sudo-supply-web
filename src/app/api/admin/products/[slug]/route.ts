import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const supabase = createServiceClient();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined) updates.name = body.name;
  if (body.price !== undefined) updates.price = body.price;
  if (body.description !== undefined) updates.description = body.description;
  if (body.longDescription !== undefined) updates.long_description = body.longDescription;
  if (body.inStock !== undefined) updates.in_stock = body.inStock;
  if (body.specs !== undefined) updates.specs = body.specs;
  if (body.shopifyVariantId !== undefined) updates.shopify_variant_id = body.shopifyVariantId;
  if (body.sortOrder !== undefined) updates.sort_order = body.sortOrder;
  if (body.slug !== undefined) updates.slug = body.slug;
  if (body.status !== undefined) updates.status = body.status;
  if (body.stockCount !== undefined) updates.stock_count = body.stockCount;
  if (body.leadTime !== undefined) updates.lead_time = body.leadTime;
  if (body.images !== undefined) {
    updates.images = body.images;
    if (Array.isArray(body.images) && body.images.length > 0) {
      updates.image = body.images[0];
    }
  }
  if (body.image !== undefined) updates.image = body.image;

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("slug", params.slug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("products").delete().eq("slug", params.slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
