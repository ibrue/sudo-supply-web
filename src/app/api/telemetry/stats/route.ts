import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Total button presses
    const { count: totalPresses } = await supabase
      .from("telemetry")
      .select("*", { count: "exact", head: true })
      .eq("event", "button_press");

    // Active devices (unique device_ids in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentDevices } = await supabase
      .from("telemetry")
      .select("device_id")
      .gte("created_at", sevenDaysAgo);

    const activeDevices = new Set(recentDevices?.map((r) => r.device_id)).size;

    // Presses by action type
    const { data: actionRows } = await supabase
      .from("telemetry")
      .select("action")
      .eq("event", "button_press");

    const actionCounts: Record<string, number> = {};
    actionRows?.forEach((r) => {
      const key = r.action || "unknown";
      actionCounts[key] = (actionCounts[key] || 0) + 1;
    });

    // Top apps
    const { data: appRows } = await supabase
      .from("telemetry")
      .select("app")
      .eq("event", "button_press")
      .not("app", "is", null);

    const appCounts: Record<string, number> = {};
    appRows?.forEach((r) => {
      if (r.app) appCounts[r.app] = (appCounts[r.app] || 0) + 1;
    });
    const topApps = Object.entries(appCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([app, count]) => ({ app, count }));

    // Presses per day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: dailyRows } = await supabase
      .from("telemetry")
      .select("created_at")
      .eq("event", "button_press")
      .gte("created_at", thirtyDaysAgo);

    const dailyCounts: Record<string, number> = {};
    dailyRows?.forEach((r) => {
      const day = r.created_at.slice(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    // Fill in missing days with 0
    const pressesPerDay: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      pressesPerDay.push({ date: key, count: dailyCounts[key] || 0 });
    }

    return NextResponse.json({
      totalPresses: totalPresses || 0,
      activeDevices,
      actionCounts,
      topApps,
      pressesPerDay,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
