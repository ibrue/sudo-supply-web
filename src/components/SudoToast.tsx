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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass-accent px-4 py-3 font-mono text-xs pointer-events-auto ${
            toast.exiting ? "toast-exit" : "toast-enter"
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-accent flex-shrink-0 select-none">
              {toast.typed}
              {!toast.done && (
                <span className="inline-block w-[6px] h-[12px] bg-accent ml-[1px] animate-blink align-middle" />
              )}
            </span>
          </div>
          {toast.done && toast.response && (
            <div className="text-text-muted mt-1 animate-fade-in">
              {toast.response}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
