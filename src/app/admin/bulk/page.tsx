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
    <div className="animate-fade-in-delay">
      <h1 className="text-accent text-xs font-mono mb-6">&gt; bulk inquiry tracker</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass p-4">
          <p className="text-text-muted text-xs mb-1">total inquiries</p>
          <p className="text-xl font-mono text-accent">{inquiries.length}</p>
        </div>
        <div className="glass p-4">
          <p className="text-text-muted text-xs mb-1">active</p>
          <p className="text-xl font-mono text-accent">{activeCount}</p>
        </div>
        <div className="glass p-4">
          <p className="text-text-muted text-xs mb-1">total units requested</p>
          <p className="text-xl font-mono text-accent">{totalUnits}</p>
        </div>
        <div className="glass p-4">
          <p className="text-text-muted text-xs mb-1">awaiting response</p>
          <p className="text-xl font-mono text-accent">
            {inquiries.filter((i) => i.status === "new").length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass p-6 text-text-muted text-sm">Loading...</div>
      ) : inquiries.length === 0 ? (
        <div className="glass p-6 text-text-muted text-sm">
          <p>No bulk inquiries yet. They&apos;ll appear here when companies submit the form on /bulk.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const days = daysSince(inq.created_at);
            const isExpanded = expandedId === inq.id;
            const isUrgent = inq.status === "new" && days >= 2;

            return (
              <div key={inq.id} className={`glass p-4 ${isUrgent ? "border-error" : ""}`}>
                {/* Summary row */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                >
                  <span className={`text-xs font-mono ${STATUS_COLORS[inq.status] || "text-text-muted"}`}>
                    &#9679; {inq.status}
                  </span>
                  <span className="font-mono text-sm flex-1">
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
                  <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <span className="text-text-muted">email: </span>
                        <a href={`mailto:${inq.email}`} className="text-accent hover-accent">
                          {inq.email}
                        </a>
                      </div>
                      {inq.phone && (
                        <div>
                          <span className="text-text-muted">phone: </span>
                          <span>{inq.phone}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-text-muted">product: </span>
                        <span>{inq.product_slug}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">quantity: </span>
                        <span className="text-accent">{inq.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-text-muted">submitted: </span>
                        <span>
                          {new Date(inq.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted">waiting: </span>
                        <span className={isUrgent ? "text-error" : ""}>
                          {waitLabel(days)}
                        </span>
                      </div>
                    </div>

                    {inq.notes && (
                      <div className="text-sm">
                        <span className="text-text-muted font-mono">notes: </span>
                        <p className="text-text mt-1">{inq.notes}</p>
                      </div>
                    )}

                    {/* Status update */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-text-muted text-xs font-mono">status:</span>
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(inq.id, s)}
                          className={`text-xs font-mono px-2 py-1 border transition-colors ${
                            inq.status === s
                              ? "border-accent text-accent"
                              : "border-border text-text-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-3 pt-1">
                      <a
                        href={`mailto:${inq.email}?subject=Re: Bulk Order Inquiry — ${inq.quantity}× ${inq.product_slug}`}
                        className="btn-terminal text-xs"
                      >
                        [ REPLY ]
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
