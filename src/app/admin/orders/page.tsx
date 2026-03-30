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
    <div className="animate-fade-in-delay">
      <h1 className="text-accent text-xs font-mono mb-6">&gt; orders</h1>

      {orders.length === 0 ? (
        <div className="glass p-6 text-text-muted text-sm">
          <p>No orders yet. Orders will appear here when customers purchase via Shopify.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">order</th>
                <th className="text-left px-4 py-3">status</th>
                <th className="text-right px-4 py-3">total</th>
                <th className="text-right px-4 py-3">date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={String(order.id)} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-accent">
                    #{String(order.shopify_order_number || order.id).slice(0, 8)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${order.status === "delivered" ? "text-accent" : "text-text-muted"}`}>
                      {String(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    ${Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-text-muted">
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
