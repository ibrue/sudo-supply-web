import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const cities = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Portland, OR",
  "Denver, CO",
  "Chicago, IL",
  "Los Angeles, CA",
  "Boston, MA",
  "Berlin, DE",
  "London, UK",
  "Toronto, CA",
];

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data: orders } = await supabase
      .from("orders")
      .select("id, items, created_at, shipping_address")
      .order("created_at", { ascending: false })
      .limit(5);

    if (orders && orders.length > 0) {
      const events = orders.map((order) => {
        const items = order.items as Array<{ title: string }> | null;
        const addr = order.shipping_address as { city?: string; province?: string } | null;
        const location = addr?.city
          ? `${addr.city}${addr.province ? `, ${addr.province}` : ""}`
          : cities[Math.floor(Math.random() * cities.length)];
        const time = new Date(order.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return {
          id: order.id,
          product: items?.[0]?.title || "sudo macro pad",
          location,
          time,
        };
      });
      return NextResponse.json(events);
    }

    // No real orders yet — return empty (feed won't show)
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
