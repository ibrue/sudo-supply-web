import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-accent text-xs font-mono mb-6 animate-fade-in">
        &gt; new product
      </h1>
      <ProductForm mode="create" />
    </div>
  );
}
