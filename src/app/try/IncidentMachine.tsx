"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { roll as rollIncident, encodeRoll, type Roll } from "@/lib/incidents";
import { Postmortem } from "./Postmortem";

// Fragments the slot reels flicker through — funny on load, before any input.
const REEL = ["rm -rf ~", "prod", "git push -f", "DROP TABLE", "$4.2M", ":)", "sudo", "main", "yolo", ".env", "us-east-1"];
const SPIN_MS = 700;

export function IncidentMachine() {
  const [current, setCurrent] = useState<Roll | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(["rm -rf ~", "prod", ":)"]);
  const reelTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Idle reels keep flickering so the machine looks alive before you press it.
  useEffect(() => {
    if (current && !spinning) return; // settled — hold the reels still
    reelTimer.current = setInterval(() => {
      setReels([
        REEL[Math.floor(Math.random() * REEL.length)],
        REEL[Math.floor(Math.random() * REEL.length)],
        REEL[Math.floor(Math.random() * REEL.length)],
      ]);
    }, spinning ? 70 : 220);
    return () => {
      if (reelTimer.current) clearInterval(reelTimer.current);
    };
  }, [current, spinning]);

  function go() {
    if (spinning) return;
    setSpinning(true);
    window.setTimeout(() => {
      const r = rollIncident(Math.random);
      setCurrent(r);
      setReels(["INC", `-${r.inc}`, "✦"]);
      setSpinning(false);
    }, SPIN_MS);
  }

  const permalink = current ? `/try/i/${encodeRoll(current)}` : "/try";
  const tweet = current
    ? encodeURIComponent("my AI agent caused an incident. it has been added to the postmortem record. roll yours:")
    : "";
  const shareHref = current
    ? `https://twitter.com/intent/tweet?text=${tweet}&url=${encodeURIComponent(`https://sudo.supply${permalink}`)}`
    : "#";

  return (
    <div className="rounded-3xl border border-border bg-surface overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#A82D20]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#B58A17]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#2F7C53]" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-text-muted">
          ~/incidents — generate postmortem
        </span>
      </div>

      <div className="p-5 sm:p-8">
        {/* Slot reels */}
        <div className="flex items-stretch justify-center gap-2 mb-6">
          {reels.map((cell, k) => (
            <div
              key={k}
              className={`flex-1 max-w-[150px] rounded-xl border border-border bg-bg px-2 py-4 text-center font-mono text-sm sm:text-base text-accent overflow-hidden whitespace-nowrap ${
                spinning ? "blur-[1px] opacity-80" : ""
              }`}
            >
              {cell}
            </div>
          ))}
        </div>

        {/* The one button */}
        <button
          onClick={go}
          disabled={spinning}
          className="w-full px-6 py-4 text-base font-bold rounded-2xl text-black bg-accent hover:brightness-110 active:scale-[0.99] transition disabled:opacity-70"
        >
          {spinning ? "rolling…" : current ? "roll another incident" : "roll an incident →"}
        </button>

        {!current && (
          <p className="mt-3 text-center text-xs font-mono text-text-muted">
            while you slept, your agent did something. press the button to find out what.
          </p>
        )}

        {/* The postmortem */}
        {current && (
          <div key={encodeRoll(current)} className="mt-7 animate-fade-in">
            <div className="rounded-2xl border border-border bg-bg p-5 sm:p-6">
              <Postmortem roll={current} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={shareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
              >
                Post the incident on X
              </a>
              <Link
                href={permalink}
                className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                Permalink ↗
              </Link>
              <Link
                href="/product/sudo-macro-pad-v1"
                className="px-5 py-3 text-sm font-semibold rounded-full border border-border hover:bg-white/5 transition"
              >
                Get the real buttons
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
