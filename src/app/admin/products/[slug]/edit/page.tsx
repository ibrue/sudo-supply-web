import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { ProductForm } from "../../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Admin · Products</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">
          Edit: <span className="text-accent">{product.name}</span>
        </h1>
      </div>
      <ProductForm
        mode="edit"
        editSlug={params.slug}
        initialData={{
          slug: product.slug,
          name: product.name,
          price: product.price,
          description: product.description,
          longDescription: product.longDescription,
          inStock: product.inStock,
          images: product.images,
          specs: product.specs,
          shopifyVariantId: product.shopifyVariantId || "",
          sortOrder: 0,
          status: product.status,
        }}
      />
    </div>
  );
}
