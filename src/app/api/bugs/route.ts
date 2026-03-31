import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, version, os_version, detected_app, connected, action_log, settings, device_id } = body;

    const supabase = createServiceClient();
    await supabase.from("bug_reports").insert({
      description, version, os_version, detected_app, connected, action_log, settings, device_id,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
