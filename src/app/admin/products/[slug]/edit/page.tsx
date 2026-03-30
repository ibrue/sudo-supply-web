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
      <h1 className="text-accent text-xs font-mono mb-6 animate-fade-in">
        &gt; edit: {product.name}
      </h1>
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
          image: product.image,
          specs: product.specs,
          shopifyVariantId: product.shopifyVariantId || "",
          sortOrder: 0,
        }}
      />
    </div>
  );
}
