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

    // 1. Save to internal tracker (fire-and-forget)
    fetch("/api/bulk-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});

    // 2. Open email to you
    const subject = `[sudo.supply] Bulk Order Inquiry — ${form.quantity}× ${product?.name || form.productSlug}`;
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
      <div className="glass p-6 text-center">
        <p className="text-accent font-mono text-sm mb-2">&#9679; inquiry ready</p>
        <p className="text-text-muted text-sm mb-4">
          Your email client should have opened with the inquiry pre-filled.
          Just hit send!
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-terminal text-xs"
        >
          [ START NEW INQUIRY ]
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent border border-border px-3 py-2 text-sm text-text font-mono focus:border-accent outline-none";

  return (
    <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
      <h2 className="text-accent text-xs font-mono mb-2">&gt; request a quote</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-text-muted text-xs block mb-1">company name</label>
          <input
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={inputClass}
            placeholder="optional"
          />
        </div>
        <div>
          <label className="text-text-muted text-xs block mb-1">contact name *</label>
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
          <label className="text-text-muted text-xs block mb-1">email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-text-muted text-xs block mb-1">phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
            placeholder="optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-text-muted text-xs block mb-1">product</label>
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
          <label className="text-text-muted text-xs block mb-1">quantity (min 5) *</label>
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
        <label className="text-text-muted text-xs block mb-1">notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className={inputClass + " resize-none"}
          placeholder="timeline, customization needs, etc."
        />
      </div>

      <button
        type="submit"
        className="btn-terminal-accent w-full text-center"
      >
        [ SUBMIT INQUIRY ]
      </button>

      <p className="text-text-muted text-xs text-center">
        opens your email client with the inquiry pre-filled
      </p>
    </form>
  );
}
