"use client";

import { useEffect, useState } from "react";

interface PurchaseEvent {
  id: string;
  product: string;
  location: string;
  time: string;
}

export function LivePurchaseFeed() {
  const [events, setEvents] = useState<PurchaseEvent[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fetch recent purchases
    fetch("/api/recent-purchases")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data.slice(0, 3));
          setVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!visible || events.length === 0) return null;

  return (
    <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 z-40 max-w-[calc(100vw-1rem)] sm:max-w-xs hidden sm:block">
      <div className="glass-accent p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-accent text-xs font-mono">&gt; live_feed</span>
          <button
            onClick={() => setVisible(false)}
            className="text-text-muted hover:text-text text-xs font-mono"
          >
            [x]
          </button>
        </div>
        <div className="space-y-1">
          {events.map((event) => (
            <div key={event.id} className="text-xs font-mono text-text-muted">
              <span className="text-text-muted">[{event.time}]</span>{" "}
              <span className="text-text">{event.location}</span>{" "}
              <span className="text-accent">deployed</span>{" "}
              <span className="text-text">{event.product}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
