import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "download [sudo] \u2014 sudo.supply",
  description: "Download the [sudo] companion app for macOS, Windows, and Linux. Control AI agents with a physical macro pad.",
};

export default function DownloadPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <p className="text-text-muted text-sm mb-8 animate-fade-in">~/download</p>

      <div className="space-y-10 animate-fade-in-delay">
        {/* Hero */}
        <section className="text-center py-8">
          <div className="flex items-center justify-center mb-6">
            <h2 className="font-pixel text-white text-3xl">[sudo]</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
            The cross-platform companion app for your sudo macro pad.
            Approve, reject, and control AI agents with a physical button press.
          </p>
          <p className="text-text-muted text-xs mt-2">
            macOS &middot; Windows &middot; Linux
          </p>
        </section>

        {/* Downloads */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-6">&gt; download</h2>
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
              <h3 className="font-mono text-sm text-accent mb-2">simple mode</h3>
              <p className="text-text-muted text-xs mb-3">
                Assign preset system shortcuts to each button.
              </p>
              <ul className="text-xs text-text-muted space-y-1">
                <li><span className="text-accent">&#9679;</span> screenshot, copy, paste, undo</li>
                <li><span className="text-accent">&#9679;</span> save, lock screen, media controls</li>
                <li><span className="text-accent">&#9679;</span> custom keyboard shortcuts</li>
              </ul>
            </div>
            <div className="glass p-5">
              <h3 className="font-mono text-sm text-accent mb-2">complex mode</h3>
              <p className="text-text-muted text-xs mb-3">
                AI agent button-finding with customizable search terms.
              </p>
              <ul className="text-xs text-text-muted space-y-1">
                <li><span className="text-accent">&#9679;</span> accessibility tree detection</li>
                <li><span className="text-accent">&#9679;</span> OCR vision fallback</li>
                <li><span className="text-accent">&#9679;</span> custom button labels per app</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Default button map — visual device */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; default button map</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Visual device */}
            <div className="w-48 flex-shrink-0 mx-auto md:mx-0">
              <div className="bg-[#1a1a1a] rounded-lg p-3 border border-border">
                {/* Screen */}
                <div className="bg-bg border border-border rounded px-3 py-2 mb-3 text-center">
                  <span className="font-mono text-accent text-xs font-bold">[sudo]</span>
                </div>
                {/* Buttons — top to bottom: black, red, yellow, green */}
                {[
                  { color: "bg-[#2a2a2a]", border: "border-[#3a3a3a]", label: "F16", name: "yolo (allow all)", key: "Ctrl+Shift+F16" },
                  { color: "bg-[#c85c5c]", border: "border-[#a04848]", label: "F14", name: "reject / no", key: "Ctrl+Shift+F14" },
                  { color: "bg-[#d4b85c]", border: "border-[#b09840]", label: "F15", name: "make it better", key: "Ctrl+Shift+F15" },
                  { color: "bg-[#6abf73]", border: "border-[#4a9f53]", label: "F13", name: "approve / yes", key: "Ctrl+Shift+F13" },
                ].map((btn) => (
                  <div
                    key={btn.label}
                    className={`${btn.color} ${btn.border} border rounded px-3 py-3 mb-2 last:mb-0`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white text-[10px] font-bold">{btn.label}</span>
                      <span className="font-mono text-white text-[10px] opacity-80">{btn.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button details table */}
            <div className="flex-1 w-full">
              <div className="glass">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-text-muted text-xs uppercase">
                      <th className="px-4 py-2 text-left font-normal">button</th>
                      <th className="px-4 py-2 text-left font-normal">color</th>
                      <th className="px-4 py-2 text-left font-normal">hotkey</th>
                      <th className="px-4 py-2 text-left font-normal">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { btn: "F13", color: "#6abf73", colorName: "green", key: "Ctrl+Shift+F13", action: "approve / yes" },
                      { btn: "F14", color: "#c85c5c", colorName: "red", key: "Ctrl+Shift+F14", action: "reject / no" },
                      { btn: "F15", color: "#d4b85c", colorName: "yellow", key: "Ctrl+Shift+F15", action: "make it better" },
                      { btn: "F16", color: "#2a2a2a", colorName: "black", key: "Ctrl+Shift+F16", action: "yolo (allow all)" },
                    ].map((row) => (
                      <tr key={row.btn} className="border-b border-border last:border-0">
                        <td className="px-4 py-2 text-accent font-mono">{row.btn}</td>
                        <td className="px-4 py-2 font-mono">
                          <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: row.color }} />
                          <span className="text-text-muted text-xs">{row.colorName}</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-text-muted text-xs">{row.key}</td>
                        <td className="px-4 py-2 font-mono">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-text-muted text-xs mt-2">all buttons are fully configurable in the app settings with quick presets</p>
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
            The sudo macro pad runs QMK firmware on an RP2040 chip. Three keymap options are available:
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
                  { keymap: "default", features: "Ctrl+Shift+F13\u2013F16", reconfig: "reflash required" },
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
                <p>Terminal &middot; iTerm2 &middot; Warp &middot; Ghostty</p>
              </div>
            </div>
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-text-muted uppercase mb-3">web apps</h3>
              <div className="space-y-1 text-sm">
                <p>claude.ai &middot; chatgpt.com &middot; grok.com</p>
                <p className="text-text-muted text-xs mt-2">
                  Safari &middot; Chrome &middot; Firefox &middot; Brave &middot; Edge
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
