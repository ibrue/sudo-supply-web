"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormData {
  slug: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  inStock: boolean;
  image: string;
  specs: Record<string, string>;
  shopifyVariantId: string;
  sortOrder: number;
}

interface Props {
  initialData?: Partial<ProductFormData>;
  mode: "create" | "edit";
  editSlug?: string;
}

export function ProductForm({ initialData, mode, editSlug }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductFormData>({
    slug: initialData?.slug || "",
    name: initialData?.name || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    inStock: initialData?.inStock ?? true,
    image: initialData?.image || "/images/macro-pad-placeholder.svg",
    specs: initialData?.specs || {},
    shopifyVariantId: initialData?.shopifyVariantId || "",
    sortOrder: initialData?.sortOrder || 0,
  });

  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSpec() {
    if (!specKey.trim()) return;
    update("specs", { ...form.specs, [specKey.trim()]: specValue.trim() });
    setSpecKey("");
    setSpecValue("");
  }

  function removeSpec(key: string) {
    const next = { ...form.specs };
    delete next[key];
    update("specs", next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${editSlug}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border border-border px-3 py-2 text-sm text-text font-mono focus:border-accent outline-none";

  return (
    <form onSubmit={handleSubmit} className="glass p-6 space-y-6 animate-fade-in-delay">
      {error && (
        <p className="text-error text-xs border border-error p-3">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-text-muted text-xs block mb-1">slug</label>
          <input
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            required
            className={inputClass}
            placeholder="my-product"
          />
        </div>
        <div>
          <label className="text-text-muted text-xs block mb-1">name</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className={inputClass}
            placeholder="my product"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-text-muted text-xs block mb-1">price ($)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-text-muted text-xs block mb-1">sort order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => update("sortOrder", parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div className="flex items-end gap-3">
          <label className="text-text-muted text-xs flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => update("inStock", e.target.checked)}
              className="accent-[#00ff41]"
            />
            in stock
          </label>
        </div>
      </div>

      <div>
        <label className="text-text-muted text-xs block mb-1">image URL</label>
        <input
          value={form.image}
          onChange={(e) => update("image", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-text-muted text-xs block mb-1">description</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          rows={2}
          className={inputClass + " resize-none"}
        />
      </div>

      <div>
        <label className="text-text-muted text-xs block mb-1">long description</label>
        <textarea
          value={form.longDescription}
          onChange={(e) => update("longDescription", e.target.value)}
          rows={4}
          className={inputClass + " resize-none"}
        />
      </div>

      <div>
        <label className="text-text-muted text-xs block mb-1">shopify variant ID</label>
        <input
          value={form.shopifyVariantId}
          onChange={(e) => update("shopifyVariantId", e.target.value)}
          className={inputClass}
          placeholder="gid://shopify/ProductVariant/..."
        />
      </div>

      {/* Specs editor */}
      <div>
        <label className="text-text-muted text-xs block mb-2">specifications</label>
        <div className="space-y-1 mb-3">
          {Object.entries(form.specs).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm font-mono">
              <span className="text-text-muted">{key}:</span>
              <span className="flex-1">{value}</span>
              <button
                type="button"
                onClick={() => removeSpec(key)}
                className="text-error text-xs hover:underline"
              >
                [x]
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            placeholder="key"
            className={inputClass + " flex-1"}
          />
          <input
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            placeholder="value"
            className={inputClass + " flex-1"}
          />
          <button
            type="button"
            onClick={addSpec}
            className="btn-terminal text-xs px-3"
          >
            [+]
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-terminal-accent w-full text-center disabled:opacity-50"
      >
        {saving
          ? "[ SAVING... ]"
          : mode === "create"
          ? "[ CREATE PRODUCT ]"
          : "[ SAVE CHANGES ]"}
      </button>
    </form>
  );
}
