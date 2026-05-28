"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, type Order } from "@/lib/supabase";

const statusColors: Record<string, string> = {
  pending: "text-text-muted",
  confirmed: "text-accent",
  shipped: "text-accent",
  delivered: "text-accent",
  cancelled: "text-error",
};

export function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) console.error("Failed to fetch orders:", error);
      else setOrders(data ?? []);
      setLoading(false);
    }
    fetchOrders();
  }, [userId]);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Orders</h2>
        {!loading && <span className="text-sm text-text-muted font-mono">{orders.length}</span>}
      </div>

      {loading ? (
        <p className="text-text-muted text-sm font-mono">
          $ sudo apt list --installed <span className="animate-blink">▌</span>
        </p>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <p className="font-pixel text-accent text-3xl mb-4">[ :| ]</p>
          <p className="text-text-muted mb-6">No orders yet.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
          >
            Browse the shop →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm font-mono">
                    #{order.shopify_order_number}
                  </span>
                  <span
                    className={`text-xs uppercase font-mono tracking-wider ${
                      statusColors[order.status] ?? "text-text-muted"
                    }`}
                  >
                    {order.status === "delivered" || order.status === "shipped" ? "● " : "○ "}
                    {order.status}
                  </span>
                </div>
                <span className="font-mono text-base tabular-nums font-semibold">
                  ${order.total.toFixed(2)} {order.currency}
                </span>
              </div>

              <div className="text-sm text-text-muted space-y-1">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.title} × {item.quantity}
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <p className="text-xs text-text-muted font-mono">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-sm hover:underline"
                  >
                    Track shipment →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
