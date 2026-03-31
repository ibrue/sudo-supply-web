import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, device_id, version, button, mode, preset } = body;

    if (!event || !device_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();
    await supabase.from("telemetry").insert({
      event,
      device_id,
      version,
      // Generic fields — no action-specific data
      action: button ? `button_${button}` : (preset || event),
      app: mode || null,
      success: null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
