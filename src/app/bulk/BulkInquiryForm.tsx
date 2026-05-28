"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { toastBus } from "@/lib/toastBus";

const CONTACT_EMAIL = "ianbrueggeman@gmail.com";

export function BulkInquiryForm({ products }: { products: Product[] }) {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    productSlug: products[0]?.slug || "",
    quantity: 5,
    notes: "",
  });

  function update(key: string, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const product = products.find((p) => p.slug === form.productSlug);

    fetch("/api/bulk-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});

    const subject = `[sudo.supply] Bulk Order Inquiry · ${form.quantity}× ${product?.name || form.productSlug}`;
    const body = [
      `Bulk Order Inquiry`,
      ``,
      `Contact: ${form.contactName}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
      form.companyName ? `Company: ${form.companyName}` : null,
      ``,
      `Product: ${product?.name || form.productSlug}`,
      `Quantity: ${form.quantity}`,
      form.notes ? `\nNotes:\n${form.notes}` : null,
      ``,
      `---`,
      `Sent from sudo.supply/bulk`,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");

    toastBus.emit(
      `$ sudo bulk-order --submit --company="${form.companyName || "direct"}" --qty=${form.quantity}`,
      "Opening email client..."
    );
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <p className="text-accent font-semibold mb-2">✓ Inquiry ready</p>
        <p className="text-text-muted mb-6">
          Your email client should have opened with the inquiry pre-filled. Just hit send.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-5 py-2.5 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition"
        >
          Start new inquiry
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent border border-border rounded-2xl px-4 py-2.5 text-sm text-text focus:border-accent outline-none";
  const labelClass = "text-text-muted text-xs block mb-1.5 font-mono";

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] mb-2 text-accent font-mono">
          Request a quote
        </p>
        <h2 className="text-2xl font-bold">Tell us what you need.</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company name</label>
          <input
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className={labelClass}>Contact name *</label>
          <input
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product</label>
          <select
            value={form.productSlug}
            onChange={(e) => update("productSlug", e.target.value)}
            className={inputClass}
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-bg">
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Quantity (min 5) *</label>
          <input
            type="number"
            min={5}
            value={form.quantity}
            onChange={(e) => update("quantity", Math.max(5, parseInt(e.target.value) || 5))}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className={inputClass + " resize-none"}
          placeholder="Timeline, customization needs, etc."
        />
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 text-base font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
      >
        Submit inquiry
      </button>

      <p className="text-text-muted text-xs text-center">
        Opens your email client with the inquiry pre-filled.
      </p>
    </form>
  );
}
