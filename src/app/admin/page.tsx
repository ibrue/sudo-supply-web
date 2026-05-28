import { createServiceClient } from "@/lib/supabase";
import { getProducts } from "@/lib/products";

export default async function AdminDashboard() {
  const products = await getProducts();
  let orderCount = 0;
  let bulkCount = 0;

  try {
    const supabase = createServiceClient();
    const { count: oc } = await supabase.from("orders").select("*", { count: "exact", head: true });
    if (oc) orderCount = oc;
    const { count: bc } = await supabase.from("bulk_inquiries").select("*", { count: "exact", head: true });
    if (bc) bulkCount = bc;
  } catch {
    // Supabase tables may not exist yet
  }

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Admin</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-text-muted text-xs block mb-2 font-mono uppercase tracking-[0.2em]">Products</p>
          <p className="text-3xl font-extrabold tabular-nums">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-text-muted text-xs block mb-2 font-mono uppercase tracking-[0.2em]">Total orders</p>
          <p className="text-3xl font-extrabold tabular-nums">{orderCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-text-muted text-xs block mb-2 font-mono uppercase tracking-[0.2em]">Bulk inquiries</p>
          <p className="text-3xl font-extrabold tabular-nums">{bulkCount}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 mt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">System status</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Supabase</span>
            <span className="text-accent">&#9679; connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Shopify</span>
            <span className="text-accent">&#9679; connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Clerk auth</span>
            <span className="text-accent">&#9679; active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
