import Link from "next/link";
import { getProducts } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="animate-fade-in-delay">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-accent text-xs font-mono">&gt; products</h1>
        <Link href="/admin/products/new" className="btn-terminal-accent text-xs">
          [ + NEW PRODUCT ]
        </Link>
      </div>

      <div className="glass overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">name</th>
              <th className="text-left px-4 py-3">slug</th>
              <th className="text-right px-4 py-3">price</th>
              <th className="text-center px-4 py-3">stock</th>
              <th className="text-right px-4 py-3">sold</th>
              <th className="text-right px-4 py-3">actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug} className="border-b border-border last:border-0 hover:bg-bg-secondary transition-colors">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3 text-text-muted">{product.slug}</td>
                <td className="px-4 py-3 text-right tabular-nums">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  {product.inStock ? (
                    <span className="text-accent">&#9679;</span>
                  ) : (
                    <span className="text-text-muted">&#9675;</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-text-muted">
                  {product.soldCount || 0}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.slug}/edit`}
                    className="text-accent hover-accent text-xs"
                  >
                    [ edit ]
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
