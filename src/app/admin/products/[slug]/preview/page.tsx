import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct } from "@/lib/products";
import { resolveImageUrl } from "@/lib/imageUrl";
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
      <div className="rounded-2xl border border-accent/40 bg-surface p-4 mb-8 flex flex-wrap items-center justify-between gap-3">
        <span className="text-accent text-sm">
          &#9679; Preview mode · {product.status === "draft" ? "this product is not live yet" : "viewing published product"}
        </span>
        <div className="flex gap-4">
          <Link href={`/admin/products/${product.slug}/edit`} className="text-accent text-sm hover:underline">
            edit
          </Link>
          <Link href={`/product/${product.slug}`} className="text-text-muted text-sm hover:text-text">
            live page
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Preview · /shop/{product.slug}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-3xl border border-border bg-surface overflow-hidden">
            <Image
              src={resolveImageUrl(product.images[0] || product.image)}
              alt={product.name}
              fill
              className="object-contain p-8"
              unoptimized
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border bg-surface">
                  <Image src={resolveImageUrl(img)} alt={`${product.name} ${i + 1}`} fill className="object-contain p-1" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold tracking-[-0.04em] mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold tabular-nums">
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

          <p className="text-text-muted text-base leading-relaxed mb-8">
            {product.longDescription}
          </p>

          {/* Specs */}
          <div className="rounded-3xl border border-border bg-surface overflow-hidden mb-8">
            <div className="px-5 py-3 border-b border-border text-text-muted text-xs uppercase tracking-[0.2em] font-mono">
              Specifications
            </div>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-text-muted whitespace-nowrap">
                      {key.replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-auto">
            <button
              disabled
              className="w-full px-5 py-3 text-sm font-semibold rounded-full text-black bg-accent opacity-50 cursor-not-allowed"
            >
              Add to cart
            </button>
            <p className="text-text-muted text-xs mt-3 text-center">
              (preview mode · buttons disabled)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
