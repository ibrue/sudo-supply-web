import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { defaultTiers } from "@/lib/bulkPricing";

/** Public endpoint to read settings (used by bulk page) */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (data?.value) {
      return NextResponse.json({ value: data.value });
    }
  } catch {
    // Table may not exist
  }

  // Return defaults
  if (key === "bulk_pricing_tiers") {
    return NextResponse.json({ value: defaultTiers });
  }
  return NextResponse.json({ value: null });
}
