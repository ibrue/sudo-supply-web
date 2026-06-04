import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "app [sudo] · sudo.supply",
  description:
    "the [sudo] companion app for macOS. control AI agents with a physical macro pad. Windows & Linux coming soon.",
};

// macOS ships today; Windows & Linux are in progress.
const platforms = [
  {
    name: "macOS",
    sub: "Ventura 13.0+ · Apple Silicon",
    label: "Download .dmg",
    href: "https://github.com/ibrue/sudo-app/releases/latest",
    note: "Swift / SwiftUI menu bar app",
    available: true,
  },
  {
    name: "Windows",
    sub: "Windows 10+ · x64",
    note: "C# / .NET 8 system tray app",
    available: false,
  },
  {
    name: "Linux",
    sub: "X11 / Wayland · GTK3",
    note: "Python / GTK3 AppIndicator",
    available: false,
  },
];

// Latest release tag from GitHub (ISR-cached). Falls back to null so the page
// never breaks if the repo has no releases or the API is rate-limited.
async function getLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch("https://api.github.com/repos/ibrue/sudo-app/releases/latest", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.tag_name === "string" ? data.tag_name : null;
  } catch {
    return null;
  }
}

const buttonMap = [
  { color: "bg-[#2a2a2a]", border: "border-[#444]", num: "4", colorName: "black", action: "yolo (allow all)", hotkey: "ctrl+shift+F16", text: "text-white" },
  { color: "bg-[#c85c5c]", border: "border-[#a04848]", num: "3", colorName: "red", action: "reject / no", hotkey: "ctrl+shift+F14", text: "text-white" },
  { color: "bg-[#d4b85c]", border: "border-[#b09840]", num: "2", colorName: "yellow", action: "make it better", hotkey: "ctrl+shift+F15", text: "text-[#1a1a1a]" },
  { color: "bg-[#6abf73]", border: "border-[#4a9f53]", num: "1", colorName: "green", action: "approve / yes", hotkey: "ctrl+shift+F13", text: "text-[#1a1a1a]" },
];

const presets = [
  { preset: "ai agent", desc: "approve / reject / make it better / yolo for AI permission prompts" },
  { preset: "plan mode", desc: "plan-oriented actions for AI coding agents" },
  { preset: "claude code", desc: "optimized for claude code terminal workflows" },
  { preset: "system shortcuts", desc: "screenshot, copy, paste, undo, save, lock screen" },
  { preset: "media controls", desc: "play/pause, next, previous, volume" },
  { preset: "web browsing", desc: "tab navigation, back, forward, refresh" },
  { preset: "discord soundboard", desc: "trigger soundboard clips" },
];

const detection = [
  { feature: "system tray", mac: "MenuBarExtra", win: "NotifyIcon", linux: "AppIndicator3" },
  { feature: "hotkeys", mac: "CGEvent tap", win: "RegisterHotKey", linux: "pynput" },
  { feature: "button finding", mac: "AXUIElement", win: "UI Automation", linux: "AT-SPI2" },
  { feature: "OCR fallback", mac: "Apple Vision", win: "Windows.Media.Ocr", linux: "Tesseract" },
  { feature: "execution", mac: "AXPress", win: "InvokePattern", linux: "AT-SPI / xdotool" },
];

const firmware = [
  { keymap: "default", features: "Ctrl+Shift+F13–F16", reconfig: "reflash required" },
  { keymap: "VIA", features: "live remapping via usevia.app", reconfig: "no reflash needed" },
  { keymap: "Vial", features: "auto-detection, no draft definition", reconfig: "no reflash needed" },
];

export default async function DownloadPage() {
  const version = await getLatestVersion();

  return (
    <div className="pt-32 pb-16 max-w-[1280px] mx-auto px-4 sm:px-8 space-y-16">
      {/* Hero */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-4 text-accent font-pixel">
          The companion app
        </p>
        <h1 className="font-pixel text-white text-5xl sm:text-7xl mb-6 tracking-tight">[sudo]</h1>
        <p className="max-w-xl mx-auto text-text-muted text-lg leading-relaxed">
          The companion app for your sudo macro pad. Approve, reject, and control AI agents with a physical button press.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
            macOS{version ? ` · ${version}` : ""} · free
          </span>
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-mono text-text-muted">
            Windows &amp; Linux coming soon
          </span>
        </div>
      </section>

      {/* Downloads */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel">Get the app</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl border bg-surface p-6 ${
                p.available ? "border-border" : "border-border/60"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-2xl font-bold ${p.available ? "" : "text-text-muted"}`}>
                  {p.name}
                </h3>
                {!p.available && (
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    soon
                  </span>
                )}
              </div>
              <p className="text-text-muted text-xs font-mono mb-6">{p.sub}</p>
              {p.available ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-5 py-2.5 rounded-full text-black bg-accent font-semibold text-sm hover:brightness-110 transition mb-3"
                >
                  {p.label}
                  {version ? ` · ${version}` : ""}
                </a>
              ) : (
                <div className="block text-center px-5 py-2.5 rounded-full border border-border text-text-muted font-semibold text-sm mb-3 cursor-not-allowed select-none">
                  Coming soon
                </div>
              )}
              <p className="text-text-muted text-xs text-center">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install from source */}
      <section className="rounded-3xl border border-border bg-surface p-6">
        <p className="text-xs uppercase tracking-[0.2em] mb-4 text-text-muted font-pixel">Install from source</p>
        <div className="font-mono text-sm space-y-1 text-text-muted">
          <p><span className="text-accent">$</span> git clone https://github.com/ibrue/sudo-app</p>
          <p><span className="text-accent">$</span> cd sudo-app</p>
          <p><span className="text-accent">$</span> ./install.sh</p>
        </div>
      </section>

      {/* Button modes */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel">Button modes</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="text-xl font-bold text-accent mb-2">AI search mode</h3>
            <p className="text-text-muted text-sm mb-4">
              Automatically find and press buttons in AI apps using a 3-strategy pipeline.
            </p>
            <ul className="text-sm text-text-muted space-y-1.5">
              <li>· accessibility tree detection</li>
              <li>· vision OCR fallback</li>
              <li>· keyboard fallback</li>
              <li>· custom button labels per app</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="text-xl font-bold text-accent mb-2">Shortcuts &amp; macros</h3>
            <p className="text-text-muted text-sm mb-4">
              Assign keyboard shortcuts, media keys, or macro sequences to each button.
            </p>
            <ul className="text-sm text-text-muted space-y-1.5">
              <li>· keyboard shortcuts &amp; media keys</li>
              <li>· macro sequences with delays</li>
              <li>· per-app profiles with auto-switching</li>
              <li>· auto-approve rules engine</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Default button map */}
      <section className="flex flex-col items-center">
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel self-start">
          Default button map
        </p>
        <div className="w-full max-w-sm">
          <div className="bg-[#1a1a1a] rounded-3xl p-5 border border-border/60 shadow-lg">
            <div className="bg-bg border border-border rounded-xl px-4 py-2.5 mb-5 text-center">
              <span className="font-pixel text-accent text-sm">[sudo]</span>
            </div>
            <div className="space-y-3">
              {buttonMap.map((btn) => (
                <div key={btn.num} className={`${btn.color} ${btn.border} border rounded-2xl px-4 py-3`}>
                  <p className={`font-mono text-xs font-bold ${btn.text} mb-0.5`}>
                    {btn.num} · {btn.colorName}
                  </p>
                  <p className={`font-mono text-sm ${btn.text} opacity-90`}>{btn.action}</p>
                  <p className={`font-mono text-xs ${btn.text} opacity-50 mt-0.5`}>{btn.hotkey}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-text-muted text-xs text-center mt-4">
            All buttons are fully configurable with quick presets in the app.
          </p>
        </div>
      </section>

      {/* Quick presets */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel">Quick presets</p>
        <div className="rounded-3xl border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-normal font-mono">preset</th>
                <th className="px-5 py-3 text-left font-normal font-mono">description</th>
              </tr>
            </thead>
            <tbody>
              {presets.map((row) => (
                <tr key={row.preset} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-accent font-mono whitespace-nowrap">{row.preset}</td>
                  <td className="px-5 py-3 text-text-muted">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Developer tools */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel">Developer tools</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="text-lg font-bold text-accent mb-2">Local API</h3>
            <p className="text-text-muted text-sm mb-3">HTTP API on port 7483 for scripting and automation.</p>
            <ul className="text-sm text-text-muted space-y-1">
              <li>· simulate button presses</li>
              <li>· read/write button config</li>
              <li>· webhook notifications</li>
              <li>· action history</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="text-lg font-bold text-accent mb-2">MCP server</h3>
            <p className="text-text-muted text-sm mb-3">Gate AI tool use behind physical button approval.</p>
            <ul className="text-sm text-text-muted space-y-1">
              <li>· POST /mcp/request-approval</li>
              <li>· blocks until button press</li>
              <li>· works with any MCP client</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h3 className="text-lg font-bold text-accent mb-2">Plugin system</h3>
            <p className="text-text-muted text-sm mb-3">Extend functionality with JSON plugin files.</p>
            <ul className="text-sm text-text-muted space-y-1">
              <li>· drop .json files in plugins dir</li>
              <li>· custom actions &amp; search terms</li>
              <li>· automation rules</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Detection stack */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel">Detection stack</p>
        <div className="rounded-3xl border border-border bg-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-normal font-mono">feature</th>
                <th className="px-5 py-3 text-left font-normal font-mono">macOS</th>
                <th className="px-5 py-3 text-left font-normal font-mono">Windows</th>
                <th className="px-5 py-3 text-left font-normal font-mono">Linux</th>
              </tr>
            </thead>
            <tbody>
              {detection.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-accent font-mono whitespace-nowrap">{row.feature}</td>
                  <td className="px-5 py-3 text-text-muted font-mono text-xs">{row.mac}</td>
                  <td className="px-5 py-3 text-text-muted font-mono text-xs">{row.win}</td>
                  <td className="px-5 py-3 text-text-muted font-mono text-xs">{row.linux}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Firmware */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel">Firmware (QMK / VIA / Vial)</p>
        <p className="text-text-muted text-sm mb-4 max-w-2xl">
          The sudo macro pad runs QMK firmware on an RP2040 chip. Three keymap options:
        </p>
        <div className="rounded-3xl border border-border bg-surface overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-normal font-mono">keymap</th>
                <th className="px-5 py-3 text-left font-normal font-mono">features</th>
                <th className="px-5 py-3 text-left font-normal font-mono">reconfigure</th>
              </tr>
            </thead>
            <tbody>
              {firmware.map((row) => (
                <tr key={row.keymap} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-accent font-mono">{row.keymap}</td>
                  <td className="px-5 py-3 text-text-muted">{row.features}</td>
                  <td className="px-5 py-3 text-text-muted">{row.reconfig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3 flex-wrap">
          <a
            href="https://github.com/ibrue/sudo-app/tree/main/firmware"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition"
          >
            Firmware source ↗
          </a>
          <a
            href="https://usevia.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-medium rounded-full border border-border hover:bg-white/5 transition"
          >
            usevia.app ↗
          </a>
        </div>
      </section>

      {/* Supported apps */}
      <section>
        <p className="text-xs uppercase tracking-[0.2em] mb-6 text-accent font-pixel">Supported apps</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <p className="font-mono text-xs text-text-muted uppercase mb-3">Native apps</p>
            <p>Claude for Desktop</p>
            <p>ChatGPT</p>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6">
            <p className="font-mono text-xs text-text-muted uppercase mb-3">Editors &amp; terminals</p>
            <p className="text-sm">Cursor · VS Code · Windsurf · VSCodium · VS Code Insiders</p>
            <p className="text-sm mt-1">Terminal · iTerm2 · Warp · Ghostty · Kitty · Alacritty</p>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6">
            <p className="font-mono text-xs text-text-muted uppercase mb-3">Web apps</p>
            <p className="text-sm">claude.ai · chatgpt.com · grok.com</p>
            <p className="text-text-muted text-xs mt-2">
              Safari · Chrome · Firefox · Brave · Edge · Arc · Opera
            </p>
          </div>
        </div>
      </section>

      {/* Outro */}
      <section className="pt-8 border-t border-border flex items-center justify-between text-sm text-text-muted font-mono">
        <span>[sudo] is open source hardware + software</span>
        <a
          href="https://github.com/ibrue/sudo-app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          GitHub →
        </a>
      </section>
    </div>
  );
}
