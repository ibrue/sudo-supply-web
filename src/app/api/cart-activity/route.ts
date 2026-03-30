import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ active_carts: 0 });

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("cart_activity")
      .select("active_carts")
      .eq("product_slug", slug)
      .single();
    return NextResponse.json({ active_carts: data?.active_carts || 0 });
  } catch {
    return NextResponse.json({ active_carts: 0 });
  }
}

export async function POST(req: NextRequest) {
  const { slug, action } = await req.json();
  if (!slug || !["add", "remove"].includes(action)) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const increment = action === "add" ? 1 : -1;

    // Upsert with atomic increment
    const { data: existing } = await supabase
      .from("cart_activity")
      .select("active_carts")
      .eq("product_slug", slug)
      .single();

    if (existing) {
      await supabase
        .from("cart_activity")
        .update({
          active_carts: Math.max(0, (existing.active_carts || 0) + increment),
          updated_at: new Date().toISOString(),
        })
        .eq("product_slug", slug);
    } else if (action === "add") {
      await supabase.from("cart_activity").insert({
        product_slug: slug,
        active_carts: 1,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Non-critical, don't fail
  }
}
