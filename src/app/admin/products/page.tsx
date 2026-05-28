import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Admin</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
        >
          + New product
        </Link>
      </div>

      <div className="rounded-3xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-[0.2em] font-mono">
              <th className="text-center px-3 py-4">Status</th>
              <th className="text-left px-5 py-4">Name</th>
              <th className="text-right px-5 py-4">Price</th>
              <th className="text-center px-5 py-4">Stock</th>
              <th className="text-right px-5 py-4">Sold</th>
              <th className="text-right px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug} className="border-b border-border last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-3 py-4 text-center">
                  {product.status === "published" ? (
                    <span className="text-accent text-xs">&#9679;</span>
                  ) : (
                    <span className="text-text-muted text-xs">&#9675;</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {product.name}
                  {product.status === "draft" && (
                    <span className="text-text-muted text-xs ml-2">(draft)</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right tabular-nums font-mono">${product.price.toFixed(2)}</td>
                <td className="px-5 py-4 text-center">
                  {product.inStock ? (
                    <span className="text-accent">&#9679;</span>
                  ) : (
                    <span className="text-text-muted">&#9675;</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-text-muted font-mono">
                  {product.soldCount || 0}
                </td>
                <td className="px-5 py-4 text-right space-x-4">
                  <Link
                    href={`/admin/products/${product.slug}/preview`}
                    className="text-text-muted hover:text-text text-sm"
                  >
                    preview
                  </Link>
                  <Link
                    href={`/admin/products/${product.slug}/edit`}
                    className="text-accent text-sm hover:underline"
                  >
                    edit
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
