import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*, answers(*)")
    .eq("product_slug", slug)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_slug, body } = await req.json();
  if (!product_slug || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("clerk_user_id", userId)
    .single();

  const { error } = await supabase.from("questions").insert({
    product_slug,
    user_id: userId,
    user_name: profile?.name || profile?.email || "anonymous",
    body,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
