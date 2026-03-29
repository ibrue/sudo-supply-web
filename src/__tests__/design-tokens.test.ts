import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("design token consistency", () => {
  const globalsCSS = fs.readFileSync(
    path.join(__dirname, "../app/globals.css"),
    "utf8"
  );

  it("globals.css defines all required CSS variables", () => {
    const requiredVars = [
      "--bg",
      "--bg-secondary",
      "--text",
      "--text-muted",
      "--accent",
      "--accent-dim",
      "--border",
      "--error",
    ];
    for (const v of requiredVars) {
      expect(globalsCSS).toContain(v);
    }
  });

  it("accent color is terminal green #00ff41", () => {
    expect(globalsCSS).toContain("--accent: #00ff41");
  });

  it("background is dark #0a0a0a", () => {
    expect(globalsCSS).toContain("--bg: #0a0a0a");
  });

  it("enforces zero border-radius globally", () => {
    expect(globalsCSS).toContain("border-radius: 0 !important");
  });

  it("uses monospace font family", () => {
    expect(globalsCSS).toContain("monospace");
  });

  it("has terminal button styles", () => {
    expect(globalsCSS).toContain(".btn-terminal");
    expect(globalsCSS).toContain(".btn-terminal-accent");
  });

  it("has scanline animation for CRT effect", () => {
    expect(globalsCSS).toContain("scanline-sweep");
    expect(globalsCSS).toContain(".scanline-overlay");
  });
});
