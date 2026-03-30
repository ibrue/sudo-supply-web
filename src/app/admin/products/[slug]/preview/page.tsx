import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct } from "@/lib/products";
import Link from "next/link";

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div>
      {/* Preview banner */}
      <div className="glass-accent p-3 mb-6 flex items-center justify-between">
        <span className="text-accent text-xs font-mono">
          &#9679; preview mode — {product.status === "draft" ? "this product is not live yet" : "viewing published product"}
        </span>
        <div className="flex gap-3">
          <Link href={`/admin/products/${product.slug}/edit`} className="text-accent text-xs font-mono hover-accent">
            [ edit ]
          </Link>
          <Link href={`/product/${product.slug}`} className="text-text-muted text-xs font-mono hover-accent">
            [ live page ]
          </Link>
        </div>
      </div>

      {/* Product preview — mirrors the real product page */}
      <p className="text-text-muted text-sm mb-8">~/shop/{product.slug}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-bg-secondary glass overflow-hidden">
            <Image
              src={product.images[0] || product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              unoptimized
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 border border-border bg-bg-secondary">
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-contain p-1" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-mono text-lg sm:text-xl mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-mono tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs">
              {product.inStock ? (
                <span className="text-accent">&#9679; IN STOCK</span>
              ) : (
                <span className="text-text-muted">&#9675; OUT OF STOCK</span>
              )}
            </span>
          </div>

          <p className="text-text-muted text-sm leading-relaxed mb-8">
            {product.longDescription}
          </p>

          {/* Specs */}
          <div className="glass mb-8">
            <div className="px-4 py-2 border-b border-border text-text-muted text-xs uppercase tracking-wider">
              specifications
            </div>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-text-muted whitespace-nowrap">
                      {key.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-auto">
            <button disabled className="btn-terminal-accent w-full text-center opacity-50 cursor-not-allowed">
              [ ADD TO CART ]
            </button>
            <p className="text-text-muted text-xs mt-2 text-center">
              (preview mode — buttons disabled)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
