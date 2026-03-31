import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "app [sudo] — sudo.supply",
  description: "the [sudo] companion app for macOS, Windows, and Linux. control AI agents with a physical macro pad.",
};

export default function DownloadPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <p className="text-text-muted text-sm mb-8 animate-fade-in">~/app</p>

      <div className="space-y-10 animate-fade-in-delay">
        {/* Hero */}
        <section className="text-center py-8">
          <div className="flex items-center justify-center mb-6">
            <h2 className="font-pixel text-white text-3xl">[sudo]</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
            the cross-platform companion app for your sudo macro pad.
            approve, reject, and control AI agents with a physical button press.
          </p>
          <p className="text-text-muted text-xs mt-2">
            macOS &middot; Windows &middot; Linux
          </p>
        </section>

        {/* Downloads */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-6">&gt; get the app</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* macOS */}
            <div className="glass-accent p-6">
              <h3 className="font-mono text-sm mb-2">macOS</h3>
              <p className="text-text-muted text-xs mb-6">ventura 13.0+ &middot; apple silicon</p>
              <a
                href="https://github.com/ibrue/sudo-app/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-accent block text-center text-xs mb-4"
              >
                [ DOWNLOAD .DMG ]
              </a>
              <p className="text-text-muted text-xs text-center">Swift / SwiftUI menu bar app</p>
            </div>
            {/* Windows */}
            <div className="glass-accent p-6">
              <h3 className="font-mono text-sm mb-2">Windows</h3>
              <p className="text-text-muted text-xs mb-6">Windows 10+ &middot; x64</p>
              <a
                href="https://github.com/ibrue/sudo-app/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-accent block text-center text-xs mb-4"
              >
                [ DOWNLOAD .EXE ]
              </a>
              <p className="text-text-muted text-xs text-center">C# / .NET 8 system tray app</p>
            </div>
            {/* Linux */}
            <div className="glass-accent p-6">
              <h3 className="font-mono text-sm mb-2">Linux</h3>
              <p className="text-text-muted text-xs mb-6">X11 / Wayland &middot; GTK3</p>
              <a
                href="https://github.com/ibrue/sudo-app/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-accent block text-center text-xs mb-4"
              >
                [ INSTALL SCRIPT ]
              </a>
              <p className="text-text-muted text-xs text-center">Python / GTK3 AppIndicator</p>
            </div>
          </div>
        </section>

        {/* Install from source */}
        <section className="glass p-6">
          <h3 className="text-text-muted text-xs uppercase tracking-wider mb-4">
            &gt; install from source
          </h3>
          <div className="font-mono text-sm space-y-1 text-text-muted">
            <p><span className="text-accent">$</span> git clone https://github.com/ibrue/sudo-app</p>
            <p><span className="text-accent">$</span> cd sudo-app</p>
            <p><span className="text-accent">$</span> ./install.sh</p>
          </div>
        </section>

        {/* Button Modes */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; button modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-5">
              <h3 className="font-mono text-sm text-accent mb-2">ai search mode</h3>
              <p className="text-text-muted text-xs mb-3">
                automatically find and press buttons in AI apps using a 3-strategy pipeline.
              </p>
              <ul className="text-xs text-text-muted space-y-1">
                <li><span className="text-accent">&#9679;</span> accessibility tree detection</li>
                <li><span className="text-accent">&#9679;</span> vision OCR fallback</li>
                <li><span className="text-accent">&#9679;</span> keyboard fallback</li>
                <li><span className="text-accent">&#9679;</span> custom button labels per app</li>
              </ul>
            </div>
            <div className="glass p-5">
              <h3 className="font-mono text-sm text-accent mb-2">shortcuts & macros</h3>
              <p className="text-text-muted text-xs mb-3">
                assign keyboard shortcuts, media keys, or macro sequences to each button.
              </p>
              <ul className="text-xs text-text-muted space-y-1">
                <li><span className="text-accent">&#9679;</span> keyboard shortcuts & media keys</li>
                <li><span className="text-accent">&#9679;</span> macro sequences with delays</li>
                <li><span className="text-accent">&#9679;</span> per-app profiles with auto-switching</li>
                <li><span className="text-accent">&#9679;</span> auto-approve rules engine</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Default button map — unified device */}
        <section className="flex flex-col items-center">
          <h2 className="font-mono text-xs text-accent mb-4 self-start">&gt; default button map</h2>
          <div className="w-full max-w-sm">
            <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-border/60 shadow-lg">
              {/* OLED screen */}
              <div className="bg-bg border border-border rounded-lg px-4 py-2.5 mb-5 text-center">
                <span className="font-pixel text-accent text-sm">[sudo]</span>
              </div>
              {/* Buttons — top to bottom: 4 black, 3 red, 2 yellow, 1 green */}
              <div className="space-y-3">
                {[
                  { bg: "bg-[#2a2a2a]", border: "border-[#444]", num: "4", colorName: "black", action: "yolo (allow all)", hotkey: "ctrl+shift+F16", textColor: "text-white" },
                  { bg: "bg-[#c85c5c]", border: "border-[#a04848]", num: "3", colorName: "red", action: "reject / no", hotkey: "ctrl+shift+F14", textColor: "text-white" },
                  { bg: "bg-[#d4b85c]", border: "border-[#b09840]", num: "2", colorName: "yellow", action: "make it better", hotkey: "ctrl+shift+F15", textColor: "text-[#1a1a1a]" },
                  { bg: "bg-[#6abf73]", border: "border-[#4a9f53]", num: "1", colorName: "green", action: "approve / yes", hotkey: "ctrl+shift+F13", textColor: "text-[#1a1a1a]" },
                ].map((btn) => (
                  <div
                    key={btn.num}
                    className={`${btn.bg} ${btn.border} border rounded-lg px-4 py-3`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-xs font-bold ${btn.textColor}`}>
                        {btn.num} &mdash; {btn.colorName}
                      </span>
                    </div>
                    <p className={`font-mono text-sm ${btn.textColor} opacity-90`}>{btn.action}</p>
                    <p className={`font-mono text-xs ${btn.textColor} opacity-50 mt-0.5`}>{btn.hotkey}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-text-muted text-xs text-center mt-4">
              all buttons are fully configurable with quick presets in the app
            </p>
          </div>
        </section>

        {/* Quick Presets */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; quick presets</h2>
          <div className="glass overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase">
                  <th className="px-4 py-2 text-left font-normal">preset</th>
                  <th className="px-4 py-2 text-left font-normal">description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { preset: "ai agent", desc: "approve / reject / make it better / yolo for AI permission prompts" },
                  { preset: "plan mode", desc: "plan-oriented actions for AI coding agents" },
                  { preset: "claude code", desc: "optimized for claude code terminal workflows" },
                  { preset: "system shortcuts", desc: "screenshot, copy, paste, undo, save, lock screen" },
                  { preset: "media controls", desc: "play/pause, next, previous, volume" },
                  { preset: "web browsing", desc: "tab navigation, back, forward, refresh" },
                  { preset: "discord soundboard", desc: "trigger soundboard clips" },
                ].map((row) => (
                  <tr key={row.preset} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-accent font-mono whitespace-nowrap">{row.preset}</td>
                    <td className="px-4 py-2 text-text-muted">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Developer Tools */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; developer tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-5">
              <h3 className="font-mono text-sm text-accent mb-2">local API</h3>
              <p className="text-text-muted text-xs mb-3">
                HTTP API on port 7483 for scripting and automation.
              </p>
              <ul className="text-xs text-text-muted space-y-1">
                <li><span className="text-accent">&#9679;</span> simulate button presses</li>
                <li><span className="text-accent">&#9679;</span> read/write button config</li>
                <li><span className="text-accent">&#9679;</span> webhook notifications</li>
                <li><span className="text-accent">&#9679;</span> action history</li>
              </ul>
            </div>
            <div className="glass p-5">
              <h3 className="font-mono text-sm text-accent mb-2">MCP server</h3>
              <p className="text-text-muted text-xs mb-3">
                gate AI tool use behind physical button approval.
              </p>
              <ul className="text-xs text-text-muted space-y-1">
                <li><span className="text-accent">&#9679;</span> POST /mcp/request-approval</li>
                <li><span className="text-accent">&#9679;</span> blocks until button press</li>
                <li><span className="text-accent">&#9679;</span> works with any MCP client</li>
              </ul>
            </div>
            <div className="glass p-5">
              <h3 className="font-mono text-sm text-accent mb-2">plugin system</h3>
              <p className="text-text-muted text-xs mb-3">
                extend functionality with json plugin files.
              </p>
              <ul className="text-xs text-text-muted space-y-1">
                <li><span className="text-accent">&#9679;</span> drop .json files in plugins dir</li>
                <li><span className="text-accent">&#9679;</span> custom actions & search terms</li>
                <li><span className="text-accent">&#9679;</span> automation rules</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detection stack */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; detection stack</h2>
          <div className="glass overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase">
                  <th className="px-4 py-2 text-left font-normal">feature</th>
                  <th className="px-4 py-2 text-left font-normal">macOS</th>
                  <th className="px-4 py-2 text-left font-normal">Windows</th>
                  <th className="px-4 py-2 text-left font-normal">Linux</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "system tray", mac: "MenuBarExtra", win: "NotifyIcon", linux: "AppIndicator3" },
                  { feature: "hotkeys", mac: "CGEvent tap", win: "RegisterHotKey", linux: "pynput" },
                  { feature: "button finding", mac: "AXUIElement", win: "UI Automation", linux: "AT-SPI2" },
                  { feature: "OCR fallback", mac: "Apple Vision", win: "Windows.Media.Ocr", linux: "Tesseract" },
                  { feature: "execution", mac: "AXPress", win: "InvokePattern", linux: "AT-SPI / xdotool" },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-accent font-mono whitespace-nowrap">{row.feature}</td>
                    <td className="px-4 py-2 text-text-muted font-mono text-xs">{row.mac}</td>
                    <td className="px-4 py-2 text-text-muted font-mono text-xs">{row.win}</td>
                    <td className="px-4 py-2 text-text-muted font-mono text-xs">{row.linux}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Firmware */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; firmware (QMK / VIA / Vial)</h2>
          <p className="text-text-muted text-sm mb-4">
            the sudo macro pad runs QMK firmware on an RP2040 chip. three keymap options are available:
          </p>
          <div className="glass overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase">
                  <th className="px-4 py-2 text-left font-normal">keymap</th>
                  <th className="px-4 py-2 text-left font-normal">features</th>
                  <th className="px-4 py-2 text-left font-normal">reconfigure</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { keymap: "default", features: "Ctrl+Shift+F13–F16", reconfig: "reflash required" },
                  { keymap: "VIA", features: "live remapping via usevia.app", reconfig: "no reflash needed" },
                  { keymap: "Vial", features: "auto-detection, no draft definition", reconfig: "no reflash needed" },
                ].map((row) => (
                  <tr key={row.keymap} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-accent font-mono">{row.keymap}</td>
                    <td className="px-4 py-2 text-text-muted">{row.features}</td>
                    <td className="px-4 py-2 text-text-muted">{row.reconfig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-4">
            <a
              href="https://github.com/ibrue/sudo-app/tree/main/firmware"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-terminal text-xs"
            >
              [ firmware source ]
            </a>
            <a
              href="https://usevia.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-terminal text-xs"
            >
              [ usevia.app ]
            </a>
          </div>
        </section>

        {/* Supported apps */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; supported apps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-text-muted uppercase mb-3">native apps</h3>
              <div className="space-y-1 text-sm">
                <p>Claude for Desktop</p>
                <p>ChatGPT</p>
              </div>
            </div>
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-text-muted uppercase mb-3">editors &amp; terminals</h3>
              <div className="space-y-1 text-sm">
                <p>Cursor &middot; VS Code &middot; Windsurf</p>
                <p>VSCodium &middot; VS Code Insiders</p>
                <p>Terminal &middot; iTerm2 &middot; Warp</p>
                <p>Ghostty &middot; Kitty &middot; Alacritty</p>
              </div>
            </div>
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-text-muted uppercase mb-3">web apps</h3>
              <div className="space-y-1 text-sm">
                <p>claude.ai &middot; chatgpt.com &middot; grok.com</p>
                <p className="text-text-muted text-xs mt-2">
                  Safari &middot; Chrome &middot; Firefox &middot; Brave &middot; Edge &middot; Arc &middot; Opera
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-4">
              <h3 className="font-mono text-xs text-accent mb-2">macOS</h3>
              <ul className="text-xs text-text-muted space-y-1">
                <li>macOS 13 Ventura+</li>
                <li>Accessibility permission</li>
                <li>Screen Recording (OCR)</li>
              </ul>
            </div>
            <div className="glass p-4">
              <h3 className="font-mono text-xs text-accent mb-2">Windows</h3>
              <ul className="text-xs text-text-muted space-y-1">
                <li>Windows 10+</li>
                <li>.NET 8 Runtime</li>
                <li>Run as Administrator (optional)</li>
              </ul>
            </div>
            <div className="glass p-4">
              <h3 className="font-mono text-xs text-accent mb-2">Linux</h3>
              <ul className="text-xs text-text-muted space-y-1">
                <li>X11 or Wayland</li>
                <li>Python 3.8+, GTK3</li>
                <li>Tesseract OCR (optional)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t border-border pt-6">
          <div className="flex items-center justify-between text-sm text-text-muted">
            <span>[sudo] is open source hardware + software</span>
            <a
              href="https://github.com/ibrue/sudo-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover-accent"
            >
              GitHub &rarr;
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
