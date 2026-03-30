import { createServiceClient } from "@/lib/supabase";

export default async function AdminBulkPage() {
  let inquiries: Record<string, unknown>[] = [];

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("bulk_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) inquiries = data;
  } catch {
    // Table may not exist yet
  }

  return (
    <div className="animate-fade-in-delay">
      <h1 className="text-accent text-xs font-mono mb-6">&gt; bulk inquiries</h1>

      {inquiries.length === 0 ? (
        <div className="glass p-6 text-text-muted text-sm">
          <p>No bulk inquiries yet. They will appear here when companies submit the bulk order form.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">company</th>
                <th className="text-left px-4 py-3">contact</th>
                <th className="text-left px-4 py-3">product</th>
                <th className="text-right px-4 py-3">qty</th>
                <th className="text-center px-4 py-3">status</th>
                <th className="text-right px-4 py-3">date</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={String(inq.id)} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{String(inq.company_name || "—")}</td>
                  <td className="px-4 py-3">
                    <div>{String(inq.contact_name)}</div>
                    <div className="text-text-muted text-xs">{String(inq.email)}</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{String(inq.product_slug)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-accent">{String(inq.quantity)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs ${inq.status === "new" ? "text-accent" : "text-text-muted"}`}>
                      {String(inq.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-text-muted">
                    {new Date(String(inq.created_at)).toLocaleDateString()}
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
