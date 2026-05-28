import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Admin · Products</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">New product</h1>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
