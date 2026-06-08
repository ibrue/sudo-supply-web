"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toastBus } from "@/lib/toastBus";

interface Toast {
  id: number;
  command: string;
  response?: string;
  typed: string;
  done: boolean;
  exiting: boolean;
}

let nextId = 0;

export function SudoToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const intervalsRef = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map());

  const addToast = useCallback((command: string, response?: string) => {
    const id = nextId++;
    const toast: Toast = { id, command, response, typed: "", done: false, exiting: false };
    setToasts((prev) => [...prev.slice(-2), toast]);

    // Type out the command character by character
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      if (charIndex >= command.length) {
        clearInterval(interval);
        intervalsRef.current.delete(id);
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, typed: command, done: true } : t))
        );
        // Auto-dismiss after 2.5s
        setTimeout(() => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
          );
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, 300);
        }, 2500);
      } else {
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, typed: command.slice(0, charIndex) } : t
          )
        );
      }
    }, 18);
    intervalsRef.current.set(id, interval);
  }, []);

  useEffect(() => {
    const unsub = toastBus.on(addToast);
    const intervals = intervalsRef.current;
    return () => {
      unsub();
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-1rem)] w-[calc(100vw-1rem)] sm:w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-card pointer-events-auto ${
            toast.exiting ? "toast-exit" : "toast-enter"
          }`}
        >
          {/* Terminal title bar: traffic-light dots + prompt label. */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E03C2B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2C71F]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3FA66F]" />
            <span className="ml-2 font-mono text-[10px] tracking-wide text-text-muted select-none">
              sudo@supply ~ %
            </span>
          </div>

          {/* Body: typed command (wraps) + cursor, then the response. */}
          <div className="px-3 py-2.5 font-mono text-xs leading-relaxed">
            <span className="text-accent whitespace-pre-wrap [overflow-wrap:anywhere] select-none">
              {toast.typed}
              {!toast.done && (
                <span className="inline-block w-[6px] h-[12px] bg-accent ml-[1px] animate-blink align-middle" />
              )}
            </span>
            {toast.done && toast.response && (
              <div className="text-text-muted mt-1.5 flex gap-1.5 animate-fade-in [overflow-wrap:anywhere]">
                <span className="text-accent select-none">✓</span>
                <span>{toast.response}</span>
              </div>
            )}
          </div>

          {/* Countdown bar — depletes over the auto-dismiss window. */}
          {toast.done && <div className="toast-progress" />}
        </div>
      ))}
    </div>
  );
}
