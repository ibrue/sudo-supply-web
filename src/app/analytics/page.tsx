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

  // Bug report form state
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

  const maxDaily = stats
    ? Math.max(...stats.pressesPerDay.map((d) => d.count), 1)
    : 1;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <p className="text-text-muted text-sm mb-8 animate-fade-in font-mono">
        ~/analytics
      </p>

      {/* Stats section */}
      <div className="space-y-6 animate-fade-in-delay">
        <div className="glass p-6">
          <h2 className="font-mono text-xs text-accent mb-6">
            &gt; telemetry dashboard
          </h2>

          {loading ? (
            <p className="font-mono text-text-muted text-sm">loading stats...</p>
          ) : !stats ? (
            <p className="font-mono text-text-muted text-sm">
              no data available yet
            </p>
          ) : (
            <div className="space-y-6">
              {/* Counters */}
              <div className="flex gap-8 flex-wrap">
                <div>
                  <p className="font-mono text-text-muted text-xs mb-1">
                    total presses
                  </p>
                  <p className="font-mono text-accent text-2xl">
                    {stats.totalPresses.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-text-muted text-xs mb-1">
                    active devices (7d)
                  </p>
                  <p className="font-mono text-accent text-2xl">
                    {stats.activeDevices.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action breakdown */}
              {Object.keys(stats.actionCounts).length > 0 && (
                <div>
                  <p className="font-mono text-text-muted text-xs mb-2">
                    actions breakdown
                  </p>
                  <div className="space-y-1">
                    {Object.entries(stats.actionCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([action, count]) => (
                        <div
                          key={action}
                          className="font-mono text-sm flex justify-between"
                        >
                          <span className="text-text-muted">{action}</span>
                          <span className="text-accent">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Top apps */}
              {stats.topApps.length > 0 && (
                <div>
                  <p className="font-mono text-text-muted text-xs mb-2">
                    top apps
                  </p>
                  <div className="space-y-1">
                    {stats.topApps.map(({ app, count }) => (
                      <div
                        key={app}
                        className="font-mono text-sm flex justify-between"
                      >
                        <span className="text-text-muted">{app}</span>
                        <span className="text-accent">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily chart */}
              <div>
                <p className="font-mono text-text-muted text-xs mb-2">
                  presses / day (30d)
                </p>
                <div className="space-y-0.5">
                  {stats.pressesPerDay.map(({ date, count }) => {
                    const barLen = Math.round((count / maxDaily) * 30);
                    return (
                      <div
                        key={date}
                        className="font-mono text-xs flex items-center gap-2"
                      >
                        <span className="text-text-muted w-20 shrink-0">
                          {date.slice(5)}
                        </span>
                        <span className="text-accent">
                          {"█".repeat(barLen || (count > 0 ? 1 : 0))}
                        </span>
                        <span className="text-text-muted">
                          {count > 0 ? count : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bug report section */}
        <div className="glass p-6">
          <h2 className="font-mono text-xs text-accent mb-6">
            &gt; report a bug
          </h2>

          <form onSubmit={handleBugSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-text-muted text-xs block mb-1">
                description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="describe what happened..."
                className="w-full bg-transparent border border-border rounded px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <div>
              <label className="font-mono text-text-muted text-xs block mb-1">
                device id (optional)
              </label>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="your device id"
                className="w-full bg-transparent border border-border rounded px-3 py-2 font-mono text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="btn-terminal text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "[ submitting... ]" : "[ submit report ]"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
