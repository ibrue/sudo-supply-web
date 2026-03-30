import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("bulk_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json([]);
    }
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
