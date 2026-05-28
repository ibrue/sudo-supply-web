"use client";

import { useEffect, useState } from "react";
import { toastBus } from "@/lib/toastBus";

interface Stats {
  totalPresses: number;
  activeDevices: number;
  actionCounts: Record<string, number>;
  topApps: { app: string; count: number }[];
  pressesPerDay: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/telemetry/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleBugSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          device_id: deviceId.trim() || undefined,
        }),
      });
      if (res.ok) {
        toastBus.emit("$ sudo report --bug", "bug report filed successfully");
        setDescription("");
        setDeviceId("");
      } else {
        toastBus.emit("$ sudo report --bug", "error: failed to submit report");
      }
    } catch {
      toastBus.emit("$ sudo report --bug", "error: network failure");
    } finally {
      setSubmitting(false);
    }
  }

  const maxDaily = stats ? Math.max(...stats.pressesPerDay.map((d) => d.count), 1) : 1;

  const inputClass =
    "w-full bg-transparent border border-border rounded-2xl px-4 py-2.5 text-sm text-text focus:border-accent outline-none";
  const labelClass = "text-text-muted text-xs block mb-1.5 font-mono";

  return (
    <div className="pt-32 pb-16 max-w-[1100px] mx-auto px-4 sm:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-mono">Telemetry</p>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em]">
          What everyone&apos;s pressing.
        </h1>
        <p className="mt-4 text-text-muted max-w-xl">
          Anonymous, opt-in telemetry from sudo macro pads in the wild.
        </p>
      </div>

      {loading && (
        <p className="text-text-muted text-sm font-mono mb-6">
          $ sudo telemetry --tail <span className="animate-blink">▌</span>
        </p>
      )}

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-mono mb-2">
            Total presses
          </p>
          <p className="text-4xl font-extrabold tabular-nums text-accent">
            {loading ? "..." : stats?.totalPresses.toLocaleString() ?? "0"}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-mono mb-2">
            Active devices (7d)
          </p>
          <p className="text-4xl font-extrabold tabular-nums text-accent">
            {loading ? "..." : stats?.activeDevices.toLocaleString() ?? "0"}
          </p>
        </div>
      </div>

      {!loading && !stats && (
        <p className="text-text-muted text-sm mb-8">No data yet.</p>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.keys(stats.actionCounts).length > 0 && (
            <div className="rounded-3xl border border-border bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-mono mb-4">
                Actions breakdown
              </p>
              <div className="space-y-2">
                {Object.entries(stats.actionCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([action, count]) => (
                    <div key={action} className="flex justify-between text-sm">
                      <span className="text-text-muted font-mono">{action}</span>
                      <span className="text-accent font-mono tabular-nums">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {stats.topApps.length > 0 && (
            <div className="rounded-3xl border border-border bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-mono mb-4">
                Top apps
              </p>
              <div className="space-y-2">
                {stats.topApps.map(({ app, count }) => (
                  <div key={app} className="flex justify-between text-sm">
                    <span className="text-text-muted font-mono">{app}</span>
                    <span className="text-accent font-mono tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {stats && (
        <div className="rounded-3xl border border-border bg-surface p-6 mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-mono mb-4">
            Presses per day (30d)
          </p>
          <div className="space-y-0.5">
            {stats.pressesPerDay.map(({ date, count }) => {
              const barLen = Math.round((count / maxDaily) * 40);
              return (
                <div key={date} className="font-mono text-xs flex items-center gap-3">
                  <span className="text-text-muted w-20 shrink-0">{date.slice(5)}</span>
                  <span className="text-accent">{"█".repeat(barLen || (count > 0 ? 1 : 0))}</span>
                  <span className="text-text-muted">{count > 0 ? count : ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bug report */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] mb-2 text-accent font-mono">
            Found a bug?
          </p>
          <h2 className="text-2xl font-bold">Tell us about it.</h2>
        </div>

        <form onSubmit={handleBugSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              placeholder="Describe what happened…"
              className={inputClass + " resize-none"}
            />
          </div>

          <div>
            <label className={labelClass}>Device ID (optional)</label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Your device ID"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !description.trim()}
            className="px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Submitting…" : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
}
