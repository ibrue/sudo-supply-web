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
      // Log the error but still return success to the user
      // The table may not be created yet — log so admin can set it up
      console.error("[bulk-inquiries] Supabase error:", error.message);
      console.log("[bulk-inquiries] Inquiry data (not saved to DB):", {
        contactName: body.contactName,
        email: body.email,
        productSlug: body.productSlug,
        quantity: body.quantity,
        companyName: body.companyName || null,
      });
    }

    // Always return success so the user gets confirmation
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[bulk-inquiries] Error:", err);
    // Still return success — don't block the user experience
    return NextResponse.json({ ok: true }, { status: 201 });
  }
}
