import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "download [sudo] \u2014 sudo.supply",
  description: "Download the [sudo] companion app for macOS, Windows, and Linux. Control AI agents with a physical macro pad.",
};

export default function DownloadPage() {
  return (
    <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
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
            <div className="border border-accent p-6">
              <h3 className="font-mono text-sm mb-1">macOS</h3>
              <p className="text-text-muted text-xs mb-4">ventura 13.0+ &middot; apple silicon + intel</p>
              <a
                href="https://github.com/ibrue/sudo-app/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-accent block text-center text-xs mb-2"
              >
                [ DOWNLOAD .DMG ]
              </a>
              <p className="text-text-muted text-xs text-center">Swift / SwiftUI menu bar app</p>
            </div>
            {/* Windows */}
            <div className="border border-accent p-6">
              <h3 className="font-mono text-sm mb-1">Windows</h3>
              <p className="text-text-muted text-xs mb-4">Windows 10+ &middot; x64</p>
              <a
                href="https://github.com/ibrue/sudo-app/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-accent block text-center text-xs mb-2"
              >
                [ DOWNLOAD .EXE ]
              </a>
              <p className="text-text-muted text-xs text-center">C# / .NET 8 system tray app</p>
            </div>
            {/* Linux */}
            <div className="border border-accent p-6">
              <h3 className="font-mono text-sm mb-1">Linux</h3>
              <p className="text-text-muted text-xs mb-4">X11 / Wayland &middot; GTK3</p>
              <a
                href="https://github.com/ibrue/sudo-app/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal-accent block text-center text-xs mb-2"
              >
                [ INSTALL SCRIPT ]
              </a>
              <p className="text-text-muted text-xs text-center">Python / GTK3 AppIndicator</p>
            </div>
          </div>
        </section>

        {/* Install from source */}
        <section className="border border-border p-6">
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
            <div className="border border-border p-5">
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
            <div className="border border-border p-5">
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

        {/* Default button map */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; default button map</h2>
          <div className="border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase">
                  <th className="px-4 py-2 text-left font-normal">button</th>
                  <th className="px-4 py-2 text-left font-normal">hotkey</th>
                  <th className="px-4 py-2 text-left font-normal">action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { btn: "1", key: "Ctrl+Shift+F13", action: "Approve / Yes" },
                  { btn: "2", key: "Ctrl+Shift+F14", action: "Reject / No" },
                  { btn: "3", key: "Ctrl+Shift+F15", action: "Continue" },
                  { btn: "4", key: "Ctrl+Shift+F16", action: "Stop" },
                ].map((row) => (
                  <tr key={row.btn} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-accent font-mono">{row.btn}</td>
                    <td className="px-4 py-2 font-mono text-text-muted">{row.key}</td>
                    <td className="px-4 py-2">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-muted text-xs mt-2">all hotkeys are fully configurable in the app settings</p>
        </section>

        {/* Detection stack */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; detection stack</h2>
          <div className="border border-border overflow-x-auto">
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
          <div className="border border-border overflow-x-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border p-5">
              <h3 className="font-mono text-xs text-text-muted uppercase mb-3">native apps</h3>
              <div className="space-y-1 text-sm">
                <p>Claude for Desktop</p>
                <p>ChatGPT</p>
              </div>
            </div>
            <div className="border border-border p-5">
              <h3 className="font-mono text-xs text-text-muted uppercase mb-3">web apps</h3>
              <div className="space-y-1 text-sm">
                <p>claude.ai &middot; chatgpt.com &middot; grok.com</p>
                <p className="text-text-muted text-xs mt-2">
                  Safari (macOS) &middot; Chrome &middot; Firefox &middot; Brave &middot; Edge &middot; Opera &middot; Chromium
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="font-mono text-xs text-accent mb-4">&gt; requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border p-4">
              <h3 className="font-mono text-xs text-accent mb-2">macOS</h3>
              <ul className="text-xs text-text-muted space-y-1">
                <li>macOS 13 Ventura+</li>
                <li>Accessibility permission</li>
                <li>Screen Recording (OCR)</li>
              </ul>
            </div>
            <div className="border border-border p-4">
              <h3 className="font-mono text-xs text-accent mb-2">Windows</h3>
              <ul className="text-xs text-text-muted space-y-1">
                <li>Windows 10+</li>
                <li>.NET 8 Runtime</li>
                <li>Run as Administrator (optional)</li>
              </ul>
            </div>
            <div className="border border-border p-4">
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
