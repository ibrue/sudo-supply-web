"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/imageUrl";

interface ProductFormData {
  slug: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  inStock: boolean;
  stockCount: number;
  leadTime: string;
  images: string[];
  specs: Record<string, string>;
  shopifyVariantId: string;
  sortOrder: number;
  status: "draft" | "published";
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
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormData>({
    slug: initialData?.slug || "",
    name: initialData?.name || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    inStock: initialData?.inStock ?? true,
    stockCount: initialData?.stockCount || 0,
    leadTime: initialData?.leadTime || "",
    images: initialData?.images || [],
    specs: initialData?.specs || {},
    shopifyVariantId: initialData?.shopifyVariantId || "",
    sortOrder: initialData?.sortOrder || 0,
    status: initialData?.status || "draft",
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

  // --- Image upload ---
  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", form.slug || "product");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [form.slug]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach(uploadFile);
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
    e.target.value = "";
  }, [uploadFile]);

  function removeImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= form.images.length) return;
    setForm((prev) => {
      const imgs = [...prev.images];
      [imgs[index], imgs[newIndex]] = [imgs[newIndex], imgs[index]];
      return { ...prev, images: imgs };
    });
  }

  function addImageUrl(url: string) {
    if (!url.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url.trim()] }));
  }

  // --- Save ---
  async function save(status?: "draft" | "published") {
    setSaving(true);
    setError(null);

    const payload = { ...form };
    if (status) payload.status = status;

    const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${editSlug}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    "w-full bg-transparent border border-border rounded-2xl px-4 py-2.5 text-sm text-text focus:border-accent outline-none";
  const labelClass = "text-text-muted text-xs block mb-1.5 font-mono uppercase tracking-[0.2em]";

  return (
    <div className="space-y-6">
      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            form.status === "published"
              ? "border-accent text-accent"
              : "border-border text-text-muted"
          }`}
        >
          {form.status === "published" ? "● Published" : "○ Draft"}
        </span>
        {mode === "edit" && (
          <a
            href={`/admin/products/${editSlug}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-sm hover:underline"
          >
            preview
          </a>
        )}
      </div>

      {error && (
        <p className="text-error text-sm rounded-2xl border border-error/40 bg-error/10 p-4">{error}</p>
      )}

      {/* Image dropbox */}
      <div className="rounded-3xl border border-border bg-surface p-6">
        <label className={labelClass}>Images</label>

        {/* Image grid with reordering */}
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {form.images.map((url, i) => (
              <div key={`${url}-${i}`} className="relative group rounded-2xl overflow-hidden border border-border w-24 h-24 bg-bg">
                <Image
                  src={resolveImageUrl(url)}
                  alt={`Image ${i + 1}`}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-accent text-black text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                    MAIN
                  </span>
                )}
                <div className="absolute inset-0 bg-bg/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    className="text-accent text-xs disabled:opacity-30"
                    disabled={i === 0}
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-error text-xs"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    className="text-accent text-xs disabled:opacity-30"
                    disabled={i === form.images.length - 1}
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-accent bg-accent/10" : "border-border hover:border-accent"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <p className="text-accent text-sm">Uploading...</p>
          ) : (
            <>
              <p className="text-text text-sm mb-1">
                Drag &amp; drop images here
              </p>
              <p className="text-text-muted text-xs">
                or click to browse · jpg, png, webp, svg
              </p>
            </>
          )}
        </div>

        {/* Manual URL input */}
        <div className="flex gap-2 mt-3">
          <input
            placeholder="or paste image URL..."
            className={inputClass + " flex-1"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImageUrl((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
              addImageUrl(input.value);
              input.value = "";
            }}
            className="px-5 py-2.5 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Core fields */}
      <div className="rounded-3xl border border-border bg-surface p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Slug</label>
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              required
              className={inputClass}
              placeholder="my-product"
            />
          </div>
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className={inputClass}
              placeholder="my product"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Price ($)</label>
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
            <label className={labelClass}>Sort order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => update("sortOrder", parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock count</label>
            <input
              type="number"
              min={0}
              value={form.stockCount}
              onChange={(e) => update("stockCount", parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div className="flex items-end">
            <label className="text-text-muted text-sm flex items-center gap-2 cursor-pointer pb-2.5">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => update("inStock", e.target.checked)}
                className="accent-accent"
              />
              In stock
            </label>
          </div>
        </div>

        {!form.inStock && (
          <div>
            <label className={labelClass}>Lead time (shown when out of stock)</label>
            <input
              value={form.leadTime}
              onChange={(e) => update("leadTime", e.target.value)}
              className={inputClass}
              placeholder="e.g. 2-3 weeks, ships March 2026"
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
            rows={2}
            className={inputClass + " resize-none"}
          />
        </div>

        <div>
          <label className={labelClass}>Long description</label>
          <textarea
            value={form.longDescription}
            onChange={(e) => update("longDescription", e.target.value)}
            rows={4}
            className={inputClass + " resize-none"}
          />
        </div>

        <div>
          <label className={labelClass}>Shopify variant ID</label>
          <input
            value={form.shopifyVariantId}
            onChange={(e) => update("shopifyVariantId", e.target.value)}
            className={inputClass}
            placeholder="gid://shopify/ProductVariant/..."
          />
        </div>
      </div>

      {/* Specs editor */}
      <div className="rounded-3xl border border-border bg-surface p-6">
        <label className={labelClass}>Specifications</label>
        <div className="space-y-2 mb-4">
          {Object.entries(form.specs).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3 text-sm rounded-2xl border border-border px-4 py-2.5">
              <span className="text-text-muted font-mono">{key}:</span>
              <span className="flex-1">{value}</span>
              <button
                type="button"
                onClick={() => removeSpec(key)}
                className="text-error text-sm hover:underline"
              >
                remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="key" className={inputClass + " flex-1"} />
          <input value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="value" className={inputClass + " flex-1"} />
          <button
            type="button"
            onClick={addSpec}
            className="px-5 py-2.5 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => save("draft")}
          disabled={saving}
          className="flex-1 px-5 py-2.5 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save draft"}
        </button>
        <button
          type="button"
          onClick={() => save("published")}
          disabled={saving}
          className="flex-1 px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
