"use client";

import { ReactNode, useEffect, useState } from "react";

interface Props {
  name: string;
  children: ReactNode;
}

// Terminal-style boot sequence shown on first render of the account page.
// Lines type out one at a time; once the full sequence has played the
// children (account header + order history) fade in.
//
// Speeds are tuned so the whole boot lands in ~1.6s — fast enough that a
// returning user isn't waiting, slow enough that the typing is readable.

const TYPE_CHAR_MS = 22;
const LINE_GAP_MS = 180;

interface Line {
  /** Command line typed character-by-character. */
  cmd?: string;
  /** Output line that appears all at once after the command. */
  out?: string;
  /** Optional tone for the output line. */
  outTone?: "ok" | "info" | "muted";
}

function buildLines(name: string): Line[] {
  const safeName = (name || "user").toLowerCase().replace(/[^a-z0-9._-]/g, "");
  return [
    { cmd: `sudo login --user=${safeName}` },
    { out: "[ok] session opened · sudo privileges active", outTone: "ok" },
    { cmd: "sudo whoami" },
  ];
}

export function AccountWelcome({ name, children }: Props) {
  const lines = buildLines(name);
  // step indexes which line is currently being typed/revealed.
  // chars indexes how much of the current cmd has typed (0..len).
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step >= lines.length) {
      setDone(true);
      return;
    }
    const line = lines[step];
    // For an "out"-only line, hold for the line gap then advance.
    if (!line.cmd) {
      const t = window.setTimeout(() => {
        setStep((s) => s + 1);
        setChars(0);
      }, LINE_GAP_MS);
      return () => window.clearTimeout(t);
    }
    // Typing a cmd line: advance one char at a time, then gap, then next.
    if (chars < line.cmd.length) {
      const t = window.setTimeout(() => setChars((c) => c + 1), TYPE_CHAR_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setStep((s) => s + 1);
      setChars(0);
    }, LINE_GAP_MS);
    return () => window.clearTimeout(t);
  }, [step, chars, lines]);

  return (
    <div>
      {/* Terminal preamble — fixed-height box so the page doesn't reflow as
          lines stream in. Height accommodates the 3 sequence lines + the
          final headline that appears under them. */}
      <pre
        aria-live="polite"
        className="font-mono text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-wrap mb-2 min-h-[5.5rem]"
      >
        {lines.slice(0, step + 1).map((line, i) => {
          const isCurrent = i === step;
          // Render command lines char-by-char while typing, full once advanced.
          if (line.cmd !== undefined) {
            const text = isCurrent ? line.cmd.slice(0, chars) : line.cmd;
            const showCursor = isCurrent && !done;
            return (
              <span key={i} className="block">
                <span className="text-accent">$</span> {text}
                {showCursor && <span className="animate-blink text-accent">▋</span>}
              </span>
            );
          }
          if (line.out !== undefined) {
            const tone =
              line.outTone === "ok"
                ? "text-accent"
                : line.outTone === "info"
                  ? "text-text"
                  : "text-text-muted";
            return (
              <span key={i} className={`block ${tone}`}>
                {line.out}
              </span>
            );
          }
          return null;
        })}
      </pre>

      {/* Headline reveals after the last command lands. */}
      <h1
        className={`text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] mb-10 transition-all duration-500 ${
          done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        Hey, <span className="text-accent">{name}.</span>
      </h1>

      {/* Account content drops in once the sequence is finished. */}
      <div
        className={`space-y-6 transition-all duration-500 delay-100 ${
          done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
