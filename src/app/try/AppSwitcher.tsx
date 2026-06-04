"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILES, KEY_COLORS, KEY_TEXT } from "@/lib/appProfiles";

const CYCLE_MS = 3200;

export function AppSwitcher() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-cycle through apps so the pad visibly remaps on its own; pauses for a
  // beat after a manual pick.
  useEffect(() => {
    if (!auto) return;
    timer.current = setInterval(() => setActive((i) => (i + 1) % PROFILES.length), CYCLE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [auto]);

  function pick(i: number) {
    setActive(i);
    setAuto(false);
    // resume auto-cycle after a short idle
    window.setTimeout(() => setAuto(true), 6000);
  }

  const p = PROFILES[active];

  return (
    <div className="rounded-3xl border border-border bg-surface overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E03C2B]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#F2C71F]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3FA66F]" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-text-muted">
          ~/sudo — context-aware
        </span>
        <span className="ml-auto font-mono text-[11px] text-text-muted flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${auto ? "bg-accent animate-pulse" : "bg-text-muted/40"}`} />
          {auto ? "auto-detecting" : "manual"}
        </span>
      </div>

      <div className="p-5 sm:p-7">
        {/* App switcher tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {PROFILES.map((prof, i) => (
            <button
              key={prof.id}
              onClick={() => pick(i)}
              className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
                i === active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:border-white/30"
              }`}
            >
              {prof.name}
            </button>
          ))}
        </div>

        {/* Detected-window line */}
        <p className="font-mono text-xs sm:text-sm text-text-muted mb-6">
          <span className="text-accent">$</span> active window{" "}
          <span className="text-text-muted/60">→</span>{" "}
          <span key={`${p.id}-name`} className="text-white animate-fade-in">{p.tag}</span>
          <span className="text-text-muted/50"> · detected via {p.detect}</span>
        </p>

        {/* The pad — four keys, fixed traffic colours, labels remap per app */}
        <div key={p.id} className="grid gap-2.5">
          {p.keys.map((k, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-2xl border border-black/10 px-4 py-3 animate-fade-in ${KEY_TEXT[i]}`}
              style={{ background: KEY_COLORS[i] }}
            >
              <span className="font-mono text-xs font-bold opacity-60 w-4 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <span className="block font-bold text-sm sm:text-base leading-tight truncate">
                  {k.label}
                </span>
                <span className="block font-mono text-[11px] opacity-70 truncate">{k.action}</span>
              </div>
              <span className="font-mono text-[11px] opacity-70 shrink-0">{k.hotkey}</span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs font-mono text-text-muted text-center">
          same four keys. the app decides what they do.
        </p>
      </div>
    </div>
  );
}
