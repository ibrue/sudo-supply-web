"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BEATS,
  type Disposition,
  type Choice,
  tally,
  formatDamage,
  encodeResult,
} from "@/lib/gauntlet";

// The four sudo keys, in board order. Colours mirror the macro pad.
const KEYS: { d: Disposition; label: string; key: string; cls: string }[] = [
  { d: "approve", label: "Approve", key: "1", cls: "bg-[#2F7C53] text-white border-[#276844]" },
  { d: "reject", label: "Reject", key: "2", cls: "bg-[#A82D20] text-white border-[#842318]" },
  { d: "better", label: "Make it better", key: "3", cls: "bg-[#B58A17] text-black border-[#8f6d12]" },
  { d: "yolo", label: "YOLO", key: "4", cls: "bg-[#1f1f1f] text-white border-[#444]" },
];

type Phase = "intro" | "playing";

export function Gauntlet() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [outcome, setOutcome] = useState<{ d: Disposition; text: string } | null>(null);
  const lockedRef = useRef(false);

  const beat = BEATS[index];
  const live = tally(choices);

  const finish = useCallback(
    (cs: Choice[]) => router.push(`/try/r/${encodeResult(tally(cs))}`),
    [router],
  );

  const choose = useCallback(
    (d: Disposition) => {
      if (phase !== "playing" || lockedRef.current || !beat) return;
      lockedRef.current = true;
      const next = [...choices, { beat, choice: d }];
      setChoices(next);
      setOutcome({ d, text: beat[d] });
      window.setTimeout(() => {
        if (index + 1 >= BEATS.length) {
          finish(next);
          return;
        }
        setIndex((i) => i + 1);
        setOutcome(null);
        lockedRef.current = false;
      }, 1600);
    },
    [phase, beat, choices, index, finish],
  );

  function start() {
    setIndex(0);
    setChoices([]);
    setOutcome(null);
    lockedRef.current = false;
    setPhase("playing");
  }

  // Keyboard: 1-4 fire the keys; Enter starts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "intro") {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); }
        return;
      }
      const k = KEYS.find((x) => x.key === e.key);
      if (k) { e.preventDefault(); choose(k.d); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, choose]);

  const outcomeColor =
    outcome?.d === "approve" ? "text-[#3FA66F]"
    : outcome?.d === "reject" ? "text-[#E0604F]"
    : outcome?.d === "better" ? "text-[#E3C04A]"
    : "text-white";

  return (
    <div className="rounded-3xl border border-border bg-surface overflow-hidden">
      {/* Terminal title bar + live damage meter */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#A82D20]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#B58A17]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#2F7C53]" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-text-muted">
          ~/agent --dangerously-skip-permissions
        </span>
        {phase === "playing" && (
          <span className="ml-auto font-mono text-[11px] text-text-muted">
            damage:{" "}
            <span className={live.damage > 0 ? "text-error" : "text-text-muted"}>
              {formatDamage(live.damage)}
            </span>
          </span>
        )}
      </div>

      <div className="p-5 sm:p-8 min-h-[380px] flex flex-col">
        {phase === "intro" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
            <div className="font-pixel text-accent text-2xl">[ agent connected ]</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-md">
              An AI agent wants to help. It will not stop wanting to help.
            </h2>
            <p className="text-text-muted max-w-md">
              It’s going to ask permission for {BEATS.length} increasingly questionable things.
              Approve, reject, make it better, or YOLO — there are no right answers, only consequences.
            </p>
            <button
              onClick={start}
              className="px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
            >
              Hand it the keys →
            </button>
            <p className="text-xs font-mono text-text-muted">press 1–4 (or tap). enter to begin.</p>
          </div>
        )}

        {phase === "playing" && beat && (
          <>
            {/* Progress dots */}
            <div className="flex gap-1.5 mb-6">
              {BEATS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i < index ? "bg-accent/60" : i === index ? "bg-accent" : "bg-white/10"}`}
                />
              ))}
            </div>

            {/* Agent request */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-text-muted">
                {beat.app} wants permission to
              </p>
              <p className="font-mono text-lg sm:text-2xl text-white leading-snug [overflow-wrap:anywhere] px-2">
                {beat.request}
              </p>
              {outcome && (
                <p key={index} className={`mt-1 text-sm sm:text-base font-mono animate-fade-in ${outcomeColor}`}>
                  ▸ {outcome.text}
                </p>
              )}
            </div>

            {/* The four keys */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
              {KEYS.map((k) => (
                <button
                  key={k.d}
                  onClick={() => choose(k.d)}
                  disabled={!!outcome}
                  className={`rounded-2xl border px-3 py-3 font-bold text-sm transition active:scale-[0.97] disabled:opacity-40 ${k.cls}`}
                >
                  <span className="block leading-tight">{k.label}</span>
                  <span className="block font-mono text-[10px] opacity-70 mt-0.5">{k.key}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => finish(choices)}
              className="mt-4 mx-auto text-xs font-mono text-text-muted hover:text-white transition"
            >
              I&apos;ve seen enough → the carnage report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
