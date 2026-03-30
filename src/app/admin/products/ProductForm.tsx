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
    "w-full bg-transparent border border-border px-3 py-2 text-sm text-text font-mono focus:border-accent outline-none";

  return (
    <div className="space-y-6 animate-fade-in-delay">
      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span className={`text-xs font-mono px-2 py-1 border ${
          form.status === "published" ? "border-accent text-accent" : "border-text-muted text-text-muted"
        }`}>
          {form.status === "published" ? "● published" : "○ draft"}
        </span>
        {mode === "edit" && (
          <a
            href={`/admin/products/${editSlug}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-xs font-mono hover-accent"
          >
            [ preview ]
          </a>
        )}
      </div>

      {error && (
        <p className="text-error text-xs border border-error p-3">{error}</p>
      )}

      {/* Image dropbox */}
      <div className="glass p-6">
        <label className="text-text-muted text-xs block mb-3">images</label>

        {/* Image grid with reordering */}
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {form.images.map((url, i) => (
              <div key={`${url}-${i}`} className="relative group border border-border w-24 h-24 bg-bg-secondary">
                <Image
                  src={resolveImageUrl(url)}
                  alt={`Image ${i + 1}`}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
                {i === 0 && (
                  <span className="absolute top-0 left-0 bg-accent text-bg text-[9px] px-1 font-mono">
                    MAIN
                  </span>
                )}
                <div className="absolute inset-0 bg-bg/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    className="text-accent text-xs font-mono disabled:opacity-30"
                    disabled={i === 0}
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-error text-xs font-mono"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    className="text-accent text-xs font-mono disabled:opacity-30"
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
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-accent bg-accent-dim" : "border-border hover:border-accent"
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
            <p className="text-accent text-xs font-mono">uploading...</p>
          ) : (
            <>
              <p className="text-text-muted text-xs font-mono mb-1">
                drag &amp; drop images here
              </p>
              <p className="text-text-muted text-[10px] font-mono">
                or click to browse &middot; jpg, png, webp, svg
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
            className="btn-terminal text-xs px-3"
          >
            [+]
          </button>
        </div>
      </div>

      {/* Core fields */}
      <div className="glass p-6 space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div>
            <label className="text-text-muted text-xs block mb-1">stock count</label>
            <input
              type="number"
              min={0}
              value={form.stockCount}
              onChange={(e) => update("stockCount", parseInt(e.target.value) || 0)}
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

        {!form.inStock && (
          <div>
            <label className="text-text-muted text-xs block mb-1">lead time (shown when out of stock)</label>
            <input
              value={form.leadTime}
              onChange={(e) => update("leadTime", e.target.value)}
              className={inputClass}
              placeholder="e.g. 2-3 weeks, ships March 2026"
            />
          </div>
        )}

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
      </div>

      {/* Specs editor */}
      <div className="glass p-6">
        <label className="text-text-muted text-xs block mb-2">specifications</label>
        <div className="space-y-1 mb-3">
          {Object.entries(form.specs).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm font-mono">
              <span className="text-text-muted">{key}:</span>
              <span className="flex-1">{value}</span>
              <button type="button" onClick={() => removeSpec(key)} className="text-error text-xs hover:underline">
                [x]
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="key" className={inputClass + " flex-1"} />
          <input value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="value" className={inputClass + " flex-1"} />
          <button type="button" onClick={addSpec} className="btn-terminal text-xs px-3">[+]</button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => save("draft")}
          disabled={saving}
          className="btn-terminal flex-1 text-center disabled:opacity-50"
        >
          {saving ? "[ SAVING... ]" : "[ SAVE DRAFT ]"}
        </button>
        <button
          type="button"
          onClick={() => save("published")}
          disabled={saving}
          className="btn-terminal-accent flex-1 text-center disabled:opacity-50"
        >
          {saving ? "[ PUBLISHING... ]" : "[ PUBLISH ]"}
        </button>
      </div>
    </div>
  );
}
