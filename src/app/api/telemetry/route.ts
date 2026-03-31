import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, action, app, success, version, device_id } = body;

    if (!event || !device_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();
    await supabase.from("telemetry").insert({
      event, action, app, success, version, device_id,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
