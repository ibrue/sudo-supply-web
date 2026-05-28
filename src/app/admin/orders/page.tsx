import { createServiceClient } from "@/lib/supabase";

export default async function AdminOrdersPage() {
  let orders: Record<string, unknown>[] = [];

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) orders = data;
  } catch {
    // Table may not exist yet
  }

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Admin</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-8 text-text-muted text-sm">
          <p>No orders yet. Orders will appear here when customers purchase via Shopify.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-[0.2em] font-mono">
                <th className="text-left px-5 py-4">Order</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-5 py-4">Total</th>
                <th className="text-right px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={String(order.id)} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 text-accent font-mono">
                    #{String(order.shopify_order_number || order.id).slice(0, 8)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs ${order.status === "delivered" ? "text-accent" : "text-text-muted"}`}>
                      {String(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums font-mono">
                    ${Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right text-text-muted">
                    {new Date(String(order.created_at)).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
