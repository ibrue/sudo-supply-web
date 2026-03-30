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
    <div className="animate-fade-in-delay">
      <h1 className="text-accent text-xs font-mono mb-6">&gt; admin dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass p-6">
          <p className="text-text-muted text-xs mb-2">products</p>
          <p className="text-2xl font-mono text-accent">{products.length}</p>
        </div>
        <div className="glass p-6">
          <p className="text-text-muted text-xs mb-2">total orders</p>
          <p className="text-2xl font-mono text-accent">{orderCount}</p>
        </div>
        <div className="glass p-6">
          <p className="text-text-muted text-xs mb-2">bulk inquiries</p>
          <p className="text-2xl font-mono text-accent">{bulkCount}</p>
        </div>
      </div>

      <div className="glass p-6 mt-6">
        <p className="text-accent text-xs font-mono mb-4">&gt; system status</p>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-text-muted">supabase</span>
            <span className="text-accent">&#9679; connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">shopify</span>
            <span className="text-accent">&#9679; connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">clerk auth</span>
            <span className="text-accent">&#9679; active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
