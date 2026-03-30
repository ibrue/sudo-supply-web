import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: body.slug,
      name: body.name,
      price: body.price,
      description: body.description,
      long_description: body.longDescription || "",
      in_stock: body.inStock ?? true,
      image: body.image || "/images/macro-pad-placeholder.svg",
      specs: body.specs || {},
      shopify_variant_id: body.shopifyVariantId || null,
      sort_order: body.sortOrder || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
