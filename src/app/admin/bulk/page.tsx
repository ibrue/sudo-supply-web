"use client";

import { useEffect, useState } from "react";

interface BulkInquiry {
  id: string;
  company_name: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  product_slug: string;
  quantity: number;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = ["new", "contacted", "quoted", "accepted", "rejected", "completed"];
const STATUS_COLORS: Record<string, string> = {
  new: "text-accent",
  contacted: "text-text",
  quoted: "text-text",
  accepted: "text-accent",
  rejected: "text-error",
  completed: "text-text-muted",
};

function daysSince(date: string): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

function waitLabel(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export default function AdminBulkPage() {
  const [inquiries, setInquiries] = useState<BulkInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/bulk-inquiries")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    fetch(`/api/admin/bulk-inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
  }

  const activeCount = inquiries.filter((i) => !["rejected", "completed"].includes(i.status)).length;
  const totalUnits = inquiries
    .filter((i) => !["rejected"].includes(i.status))
    .reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-3">Admin</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">Bulk inquiries</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-text-muted text-xs block mb-2 font-mono uppercase tracking-[0.2em]">Total</p>
          <p className="text-2xl font-extrabold tabular-nums">{inquiries.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-text-muted text-xs block mb-2 font-mono uppercase tracking-[0.2em]">Active</p>
          <p className="text-2xl font-extrabold tabular-nums">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-text-muted text-xs block mb-2 font-mono uppercase tracking-[0.2em]">Units requested</p>
          <p className="text-2xl font-extrabold tabular-nums">{totalUnits}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-text-muted text-xs block mb-2 font-mono uppercase tracking-[0.2em]">Awaiting</p>
          <p className="text-2xl font-extrabold tabular-nums">
            {inquiries.filter((i) => i.status === "new").length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-border bg-surface p-8 text-text-muted text-sm">Loading...</div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-8 text-text-muted text-sm">
          <p>No bulk inquiries yet. They&apos;ll appear here when companies submit the form on /bulk.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const days = daysSince(inq.created_at);
            const isExpanded = expandedId === inq.id;
            const isUrgent = inq.status === "new" && days >= 2;

            return (
              <div
                key={inq.id}
                className={`rounded-2xl border bg-surface p-5 ${
                  isUrgent ? "border-error" : "border-border"
                }`}
              >
                {/* Summary row */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                >
                  <span className={`text-xs ${STATUS_COLORS[inq.status] || "text-text-muted"}`}>
                    &#9679; {inq.status}
                  </span>
                  <span className="text-sm flex-1">
                    {inq.contact_name}
                    {inq.company_name && (
                      <span className="text-text-muted"> @ {inq.company_name}</span>
                    )}
                  </span>
                  <span className="text-accent font-mono text-sm tabular-nums">
                    {inq.quantity}×
                  </span>
                  <span className="text-text-muted font-mono text-xs">
                    {inq.product_slug}
                  </span>
                  <span className={`font-mono text-xs tabular-nums ${isUrgent ? "text-error" : "text-text-muted"}`}>
                    {waitLabel(days)}
                  </span>
                  <span className="text-text-muted text-xs">
                    {isExpanded ? "▾" : "▸"}
                  </span>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] block mb-1">Email</span>
                        <a href={`mailto:${inq.email}`} className="text-accent hover:underline">
                          {inq.email}
                        </a>
                      </div>
                      {inq.phone && (
                        <div>
                          <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] block mb-1">Phone</span>
                          <span>{inq.phone}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] block mb-1">Product</span>
                        <span>{inq.product_slug}</span>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] block mb-1">Quantity</span>
                        <span className="text-accent">{inq.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] block mb-1">Submitted</span>
                        <span>
                          {new Date(inq.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] block mb-1">Waiting</span>
                        <span className={isUrgent ? "text-error" : ""}>
                          {waitLabel(days)}
                        </span>
                      </div>
                    </div>

                    {inq.notes && (
                      <div className="text-sm">
                        <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em] block mb-1">Notes</span>
                        <p className="text-text mt-1">{inq.notes}</p>
                      </div>
                    )}

                    {/* Status update. Selected status gets the filled accent
                        pill so admins can see at a glance which state a
                        row is in without parsing colour-only changes. */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em]">Status</span>
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(inq.id, s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            inq.status === s
                              ? "border-accent bg-accent/10 text-accent font-semibold"
                              : "border-border text-text-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Quick actions — primary CTA matches the site's accent
                        pill so replies stand out as the main action on a row. */}
                    <div className="flex gap-3 pt-1">
                      <a
                        href={`mailto:${inq.email}?subject=Re: Bulk Order Inquiry · ${inq.quantity}× ${inq.product_slug}`}
                        className="px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
                      >
                        Reply →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
