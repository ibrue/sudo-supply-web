"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface Photo {
  file: string;
  url: string;
  bytes: number;
}

export interface ProductPair {
  base: string;
  original?: Photo;
  dark?: Photo;
}

// Slots the user can assign a photo to. Map slot id → human label. Sourced
// from the actual surfaces that render product imagery — the assignments
// feed back into src/lib/products.ts and src/app/page.tsx.
const SLOTS: { id: string; label: string }[] = [
  { id: "macropad-hero", label: "macropad · hero" },
  { id: "macropad-gallery", label: "macropad · gallery" },
  { id: "pcb-hero", label: "pcb · hero" },
  { id: "pcb-gallery", label: "pcb · gallery" },
  { id: "keycaps-hero", label: "keycaps · hero" },
  { id: "keycaps-gallery", label: "keycaps · gallery" },
  { id: "home-hero-poster", label: "home · hero 3D poster" },
  { id: "home-lifestyle", label: "home · lifestyle strip" },
  { id: "home-pickyours", label: "home · pick-yours card" },
  { id: "home-mix-match", label: "home · mix & match card" },
  { id: "home-bento-pcb", label: "home · bento PCB card" },
  { id: "shop-card", label: "shop · card hero" },
  { id: "about-story", label: "about · story image" },
];

interface Selection {
  /** Whether the user wants this photo used at all. */
  use: boolean;
  /** Slot ids the photo should occupy. A photo can fill multiple slots. */
  slots: string[];
  /** Free-form notes (crops, edits, etc). */
  note: string;
}

type SelectionMap = Record<string, Selection>;

const STORAGE_KEY = "photos-audit-selection-v1";

function emptySelection(): Selection {
  return { use: false, slots: [], note: "" };
}

function fmtKB(bytes: number): string {
  return `${Math.round(bytes / 1024).toLocaleString()} KB`;
}

export function PhotosAuditClient({
  products,
  uploads,
}: {
  products: ProductPair[];
  uploads: Photo[];
}) {
  // Build the flat list of every photo URL the page renders, so the
  // selection store can be keyed on stable URLs.
  const allPhotos = useMemo(() => {
    const list: Photo[] = [];
    for (const pair of products) {
      if (pair.original) list.push(pair.original);
      if (pair.dark) list.push(pair.dark);
    }
    for (const u of uploads) list.push(u);
    return list;
  }, [products, uploads]);

  const [selection, setSelection] = useState<SelectionMap>({});
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<"all" | "selected" | "products" | "uploads">("all");

  // Load from localStorage on mount (client-only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelection(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration so we don't overwrite on first
  // render with the empty default state).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // storage may be unavailable in private mode
    }
  }, [selection, hydrated]);

  function update(key: string, patch: Partial<Selection>) {
    setSelection((prev) => {
      const cur = prev[key] ?? emptySelection();
      const next: Selection = { ...cur, ...patch };
      // If nothing is set, prune the entry so the export stays tight.
      if (!next.use && next.slots.length === 0 && !next.note.trim()) {
        const { [key]: _drop, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: next };
    });
  }

  function toggleSlot(key: string, slotId: string) {
    setSelection((prev) => {
      const cur = prev[key] ?? emptySelection();
      const has = cur.slots.includes(slotId);
      const slots = has ? cur.slots.filter((s) => s !== slotId) : [...cur.slots, slotId];
      // Selecting any slot also implies `use`.
      const next: Selection = { ...cur, slots, use: cur.use || slots.length > 0 };
      return { ...prev, [key]: next };
    });
  }

  const selectedEntries = useMemo(
    () =>
      Object.entries(selection)
        .filter(([, v]) => v.use || v.slots.length > 0 || v.note.trim())
        .sort((a, b) => a[0].localeCompare(b[0])),
    [selection],
  );

  function exportJson(): string {
    // Group by slot for the most actionable summary, with an "unassigned"
    // bucket for photos that are flagged "use" but have no slot yet.
    const bySlot: Record<string, Array<{ url: string; note?: string }>> = {};
    const unassigned: Array<{ url: string; note?: string }> = [];
    for (const [url, sel] of selectedEntries) {
      const entry = sel.note.trim() ? { url, note: sel.note.trim() } : { url };
      if (sel.slots.length === 0) {
        unassigned.push(entry);
      } else {
        for (const slot of sel.slots) {
          (bySlot[slot] ??= []).push(entry);
        }
      }
    }
    return JSON.stringify({ bySlot, unassigned }, null, 2);
  }

  async function copySelectionToClipboard() {
    try {
      await navigator.clipboard.writeText(exportJson());
      // eslint-disable-next-line no-alert
      alert("Selection copied to clipboard. Paste it back to me.");
    } catch {
      // eslint-disable-next-line no-alert
      alert("Clipboard blocked. Use the textarea at the bottom of the page instead.");
    }
  }

  function clearAll() {
    if (confirm("Clear all selections?")) {
      setSelection({});
    }
  }

  const usedUrls = useMemo(() => new Set(Object.keys(selection)), [selection]);

  const showProducts = filter === "all" || filter === "products" || filter === "selected";
  const showUploads = filter === "all" || filter === "uploads" || filter === "selected";

  function passesFilter(url: string): boolean {
    if (filter !== "selected") return true;
    const sel = selection[url];
    return Boolean(sel && (sel.use || sel.slots.length > 0 || sel.note.trim()));
  }

  return (
    <div className="pt-32 pb-24 max-w-[1400px] mx-auto px-4 sm:px-8">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-mono">
          $ sudo audit --photos
        </p>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] leading-[0.95] mb-4">
          Photo audit.
        </h1>
        <p className="text-text-muted leading-relaxed max-w-2xl">
          Every photo in <code className="text-accent">public/images/products</code> (with its
          bg-removed sibling) plus every photo you&apos;ve uploaded to{" "}
          <code className="text-accent">.context/attachments</code> (copied to{" "}
          <code className="text-accent">public/images/uploads</code>). Check the slots a
          photo should fill, leave a note if it needs a re-crop, then copy
          the JSON down at the bottom and paste it back to me.
        </p>
        <p className="mt-3 text-xs font-mono text-text-muted">
          {products.length} product bases · {uploads.length} uploads ·{" "}
          {selectedEntries.length} flagged
        </p>
      </header>

      {/* Sticky control bar */}
      <div className="sticky top-20 z-40 mb-8 -mx-2 px-2">
        <div className="rounded-2xl border border-border bg-bg/90 backdrop-blur p-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono">
            {(["all", "products", "uploads", "selected"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full border transition-colors ${
                  filter === f
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-muted hover:border-white/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-text-muted ml-auto">
            {selectedEntries.length} flagged
          </span>
          <button
            type="button"
            onClick={copySelectionToClipboard}
            className="px-4 py-2 text-xs font-semibold rounded-full text-black bg-accent hover:brightness-110"
          >
            Copy selection JSON
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="px-3 py-1.5 text-xs font-mono rounded-full border border-border text-text-muted hover:border-white/30"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Products section: pairs of original + dark side-by-side */}
      {showProducts && (
        <div className="space-y-10 mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-mono">
            products/ · originals vs -dark
          </h2>
          {products
            .filter(
              (pair) =>
                passesFilter(pair.original?.url ?? "") ||
                passesFilter(pair.dark?.url ?? ""),
            )
            .map((pair) => (
              <ProductPairRow
                key={pair.base}
                pair={pair}
                selection={selection}
                update={update}
                toggleSlot={toggleSlot}
              />
            ))}
        </div>
      )}

      {/* Uploads section: single column of every uploaded photo */}
      {showUploads && (
        <div className="space-y-10">
          <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-mono">
            uploads/ · your raw photos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploads
              .filter((u) => passesFilter(u.url))
              .map((u) => (
                <PhotoCard
                  key={u.url}
                  photo={u}
                  selection={selection[u.url]}
                  update={(patch) => update(u.url, patch)}
                  toggleSlot={(slot) => toggleSlot(u.url, slot)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Export readout */}
      <div className="mt-16">
        <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-mono mb-3">
          export · selection JSON
        </h2>
        <p className="text-text-muted text-sm mb-3">
          Pasted back to me, this is what I&apos;ll act on. Use the Copy button
          above or grab the textarea.
        </p>
        <textarea
          readOnly
          value={hydrated ? exportJson() : "{}"}
          className="w-full h-64 rounded-2xl border border-border bg-surface p-4 font-mono text-xs text-text-muted"
        />
        <p className="mt-2 text-[11px] font-mono text-text-muted/70">
          Stored locally in <code>localStorage.{STORAGE_KEY}</code>. Survives reloads
          on this machine; not synced anywhere.
        </p>
      </div>

      <p className="mt-8 text-[11px] font-mono text-text-muted/60">
        ▸ {usedUrls.size} photos have selections saved
      </p>
    </div>
  );
}

function ProductPairRow({
  pair,
  selection,
  update,
  toggleSlot,
}: {
  pair: ProductPair;
  selection: SelectionMap;
  update: (key: string, patch: Partial<Selection>) => void;
  toggleSlot: (key: string, slotId: string) => void;
}) {
  return (
    <section>
      <h3 className="text-sm font-mono text-accent mb-3">{pair.base}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PhotoCard
          photo={pair.original}
          label={`${pair.base}.jpeg`}
          selection={pair.original ? selection[pair.original.url] : undefined}
          update={(patch) => pair.original && update(pair.original.url, patch)}
          toggleSlot={(slot) => pair.original && toggleSlot(pair.original.url, slot)}
        />
        <PhotoCard
          photo={pair.dark}
          label={`${pair.base}-dark.jpeg`}
          selection={pair.dark ? selection[pair.dark.url] : undefined}
          update={(patch) => pair.dark && update(pair.dark.url, patch)}
          toggleSlot={(slot) => pair.dark && toggleSlot(pair.dark.url, slot)}
        />
      </div>
    </section>
  );
}

function PhotoCard({
  photo,
  label,
  selection,
  update,
  toggleSlot,
}: {
  photo?: Photo;
  label?: string;
  selection?: Selection;
  update: (patch: Partial<Selection>) => void;
  toggleSlot: (slotId: string) => void;
}) {
  if (!photo) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-bg/40 aspect-square flex items-center justify-center">
        <p className="text-xs font-mono text-text-muted">{label ?? "(missing)"}</p>
      </div>
    );
  }
  const sel = selection ?? emptySelection();
  return (
    <figure
      className={`rounded-2xl border bg-surface overflow-hidden transition-colors ${
        sel.use || sel.slots.length > 0
          ? "border-accent shadow-[0_0_0_1px_rgba(46,164,104,0.25)]"
          : "border-border"
      }`}
    >
      <div className="relative aspect-square bg-bg">
        <Image
          src={photo.url}
          alt={photo.file}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain"
          unoptimized
        />
        <label className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg/80 backdrop-blur cursor-pointer text-xs font-mono">
          <input
            type="checkbox"
            checked={sel.use}
            onChange={(e) => update({ use: e.target.checked })}
            className="accent-accent"
          />
          use
        </label>
      </div>
      <figcaption className="p-3 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-text-muted truncate">{label ?? photo.file}</span>
          <span className="text-text-muted/60 tabular-nums">{fmtKB(photo.bytes)}</span>
        </div>
        <p className="font-mono text-[11px] text-text-muted/70 truncate">{photo.url}</p>
        <div className="flex flex-wrap gap-1.5">
          {SLOTS.map((s) => {
            const on = sel.slots.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSlot(s.id)}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors ${
                  on
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-muted hover:border-white/30"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="note (crop / edit / etc)"
          value={sel.note}
          onChange={(e) => update({ note: e.target.value })}
          className="w-full bg-bg/60 border border-border rounded-lg px-3 py-2 text-xs font-mono placeholder:text-text-muted/40 focus:border-accent outline-none"
        />
      </figcaption>
    </figure>
  );
}
