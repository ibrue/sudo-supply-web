import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.contactName || !body.email || !body.productSlug || !body.quantity) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (body.quantity < 5) {
    return NextResponse.json({ error: "Minimum order is 5 units" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("bulk_inquiries").insert({
      company_name: body.companyName || null,
      contact_name: body.contactName,
      email: body.email,
      phone: body.phone || null,
      product_slug: body.productSlug,
      quantity: body.quantity,
      notes: body.notes || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
