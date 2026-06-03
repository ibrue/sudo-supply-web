"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PROMPTS,
  ROUNDS,
  type Disposition,
  type RoundResult,
  scoreRound,
  tally,
  encodeResult,
} from "@/lib/gauntlet";

// The four sudo keys, in board order. Colours mirror the download-page button
// map; keys 1-4 (and the on-screen buttons) trigger them.
const KEYS: { d: Disposition; label: string; sub: string; key: string; cls: string }[] = [
  { d: "approve", label: "Approve", sub: "1 · green", key: "1", cls: "bg-[#2F7C53] text-white border-[#276844]" },
  { d: "reject", label: "Reject", sub: "2 · red", key: "2", cls: "bg-[#A82D20] text-white border-[#842318]" },
  { d: "better", label: "Make it better", sub: "3 · yellow", key: "3", cls: "bg-[#B58A17] text-black border-[#8f6d12]" },
  { d: "yolo", label: "YOLO", sub: "4 · black", key: "4", cls: "bg-[#1f1f1f] text-white border-[#444]" },
];

const PER_ROUND_MS = 4000;

type Phase = "intro" | "playing" | "feedback";

function shuffleIndices(): number[] {
  // Pick ROUNDS distinct prompts. Math.random is fine here (client-only game).
  const idx = PROMPTS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, ROUNDS);
}

export function Gauntlet() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [order, setOrder] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(1); // 0..1 fraction
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const lockedRef = useRef(false);

  const current = (phase === "playing" || phase === "feedback") && order.length ? PROMPTS[order[round]] : null;

  const finish = useCallback(
    (rs: RoundResult[]) => {
      const result = tally(rs);
      router.push(`/try/r/${encodeResult(result)}`);
    },
    [router],
  );

  const choose = useCallback(
    (choice: Disposition) => {
      if (phase !== "playing" || lockedRef.current || !current) return;
      lockedRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const correct = scoreRound(current, choice);
      const rs: RoundResult = { promptIndex: order[round], choice, correct };
      const next = [...results, rs];
      setResults(next);
      setFeedback({
        correct: choice === "yolo" ? true : correct,
        text: choice === "yolo" ? "YOLO. " + current.outcome : current.outcome,
      });
      setPhase("feedback");

      window.setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          finish(next);
          return;
        }
        setRound((r) => r + 1);
        setFeedback(null);
        lockedRef.current = false;
        setPhase("playing");
      }, 1100);
    },
    [phase, current, order, round, results, finish],
  );

  // Countdown bar; timeout counts as a missed (incorrect) round.
  useEffect(() => {
    if (phase !== "playing") return;
    lockedRef.current = false;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const frac = Math.max(0, 1 - (now - startRef.current) / PER_ROUND_MS);
      setTimeLeft(frac);
      if (frac <= 0) {
        // timed out -> record as a non-ideal "reject by inaction" miss
        if (!lockedRef.current && current) {
          lockedRef.current = true;
          const rs: RoundResult = { promptIndex: order[round], choice: "reject", correct: current.ideal === "reject" };
          const next = [...results, rs];
          setResults(next);
          setFeedback({ correct: rs.correct, text: rs.correct ? "you let the clock run. lucky." : "you hesitated. the agent did it anyway." });
          setPhase("feedback");
          window.setTimeout(() => {
            if (round + 1 >= ROUNDS) { finish(next); return; }
            setRound((r) => r + 1);
            setFeedback(null);
            setPhase("playing");
          }, 1100);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round]);

  // Keyboard: 1-4 map to the four keys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "intro" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        start();
        return;
      }
      const k = KEYS.find((x) => x.key === e.key);
      if (k) {
        e.preventDefault();
        choose(k.d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, choose]);

  function start() {
    setOrder(shuffleIndices());
    setRound(0);
    setResults([]);
    setFeedback(null);
    lockedRef.current = false;
    setPhase("playing");
  }

  const progress = useMemo(() => `${Math.min(round + 1, ROUNDS)} / ${ROUNDS}`, [round]);

  return (
    <div className="rounded-3xl border border-border bg-surface overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#A82D20]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#B58A17]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#2F7C53]" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-text-muted">
          permission-gauntlet — {phase === "playing" || phase === "feedback" ? progress : "ready"}
        </span>
      </div>

      <div className="p-5 sm:p-8 min-h-[340px] flex flex-col">
        {phase === "intro" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Your agents are about to ask for permission.
            </h2>
            <p className="text-text-muted max-w-md">
              {ROUNDS} requests. Four keys. Approve the safe stuff, reject the chaos, make the
              sketchy stuff better — before the timer runs out. YOLO at your own risk.
            </p>
            <button
              onClick={start}
              className="px-6 py-3 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 transition"
            >
              Start the gauntlet →
            </button>
            <p className="text-xs font-mono text-text-muted">press 1–4 (or tap). enter to start.</p>
          </div>
        )}

        {(phase === "playing" || phase === "feedback") && current && (
          <>
            {/* Countdown */}
            <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-5">
              <div
                className="h-full bg-accent transition-[width] duration-75 ease-linear"
                style={{ width: `${phase === "playing" ? timeLeft * 100 : 0}%` }}
              />
            </div>

            {/* Agent prompt card */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-text-muted">
                {current.app} wants to
              </p>
              <p className="font-mono text-lg sm:text-2xl text-white break-all px-2">
                <span className="text-accent">$</span> {current.command}
              </p>
              {phase === "feedback" && feedback && (
                <p className={`mt-2 text-sm font-mono ${feedback.correct ? "text-accent" : "text-error"}`}>
                  {feedback.correct ? "▸ " : "✗ "}
                  {feedback.text}
                </p>
              )}
            </div>

            {/* The four keys */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
              {KEYS.map((k) => (
                <button
                  key={k.d}
                  onClick={() => choose(k.d)}
                  disabled={phase === "feedback"}
                  className={`rounded-2xl border px-3 py-3 text-left transition active:scale-[0.97] disabled:opacity-40 ${k.cls}`}
                >
                  <span className="block font-bold text-sm leading-tight">{k.label}</span>
                  <span className="block font-mono text-[10px] opacity-70 mt-0.5">{k.sub}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
