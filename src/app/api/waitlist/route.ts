import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { product_slug, email } = await req.json();
  if (!product_slug || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { userId } = await auth();
  const supabase = createServiceClient();

  const { error } = await supabase.from("waitlist").upsert(
    {
      product_slug,
      user_id: userId || null,
      email,
    },
    { onConflict: "product_slug,email" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
