/**
 * Pre-render turntable sprite-sheets for the product cards / hero.
 *
 * Why: a live <model-viewer> costs ~1 MB of three.js + a WebGL context + HDR
 * prefiltering before it shows anything. A pre-rendered turntable is a single
 * WebP that paints instantly (like any image) and loops via CSS steps() — so
 * the card shows a spinning product the moment the page paints, on mobile and
 * desktop, with zero WebGL. The live interactive viewer then crossfades in.
 *
 * The frames are captured with the SAME GLB, HDR, tone-mapping, and per-mesh
 * material overrides the live ProductModelViewer applies, so the sprite and
 * the live model line up and the crossfade is seamless.
 *
 * Output: public/turntables/<id>.webp — a vertical filmstrip of FRAMES+1
 * frames (the +1 duplicates frame 0 so the CSS steps() loop wraps seamlessly).
 *
 * Run (puppeteer is installed transiently, not in package.json, so it never
 * touches the Vercel build):
 *   npm i puppeteer --no-save
 *   node scripts/render-turntables.mjs        # dev server must be on :3000
 */

import puppeteer from "puppeteer";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "http://localhost:3000";
const MV_VERSION = "4.2.0";
const FRAMES = 36; // 10° per frame
const FRAME = 440; // px per frame (440×(37) = 16280 < WebP's 16383 limit)
const CAPTURE_SCALE = 2; // render at 2× then downscale for crisp edges
const OUT_DIR = path.resolve("public/turntables");

// Mirror of ProductModelViewer's per-mesh overrides. Kept in sync by hand;
// the live viewer is the source of truth.
const SCREW = [16 / 255, 16 / 255, 18 / 255];
const TRAFFIC = [
  [0x1a / 255, 0x1a / 255, 0x1a / 255],
  [0xa8 / 255, 0x2d / 255, 0x20 / 255],
  [0xb5 / 255, 0x8a / 255, 0x17 / 255],
  [0x2f / 255, 0x7c / 255, 0x53 / 255],
];
const hex = (h) => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

// id → { caseColor, keycaps, hide } matching each surface's live config.
const CONFIGS = [
  { id: "macropad-white", caseColor: hex("#928E86"), keycaps: TRAFFIC, hide: null },
  { id: "macropad-black", caseColor: hex("#1A1A1A"), keycaps: TRAFFIC, hide: null },
  { id: "pcb", caseColor: null, keycaps: null, hide: "^(CASE|KEYCAP|SCREW)" },
  {
    id: "keycaps",
    caseColor: null,
    keycaps: TRAFFIC,
    hide: "^(CASE|SCREW|SUBSTRATE|SILKSCREEN|METAL|COMPONENT|PCB)",
  },
];

const harnessHtml = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:transparent}
#mv{width:${FRAME}px;height:${FRAME}px;background:transparent;--poster-color:transparent}</style>
<script type="module" src="https://unpkg.com/@google/model-viewer@${MV_VERSION}/dist/model-viewer.min.js"></script>
</head><body>
<model-viewer id="mv"
  src="${BASE}/models/sudo-macropad.glb"
  environment-image="${BASE}/hdri/studio.hdr"
  tone-mapping="commerce" exposure="1.1"
  shadow-intensity="1" shadow-softness="0.7"
  interaction-prompt="none" camera-controls disable-zoom disable-pan
  camera-orbit="0deg 75deg auto" reveal="auto"></model-viewer>
</body></html>`;

function applyMaterials(config) {
  // Runs in the page. Mirrors ProductModelViewer material logic.
  const mv = document.getElementById("mv");
  const hideRe = config.hide ? new RegExp(config.hide) : null;
  const hasCase = mv.model.materials.some((m) => (m.name || "").startsWith("CASE"));
  for (const mat of mv.model.materials) {
    const name = mat.name || "";
    const pbr = mat.pbrMetallicRoughness;
    if (hideRe && hideRe.test(name)) {
      mat.setAlphaMode("MASK");
      mat.setAlphaCutoff(0.5);
      pbr.setBaseColorFactor([0, 0, 0, 0]);
      continue;
    }
    let rgb, rough, metal = 0;
    if (name.startsWith("SCREW")) {
      rgb = config.SCREW; rough = 0.4; metal = 0.85;
    } else if (config.caseColor && hasCase && name.startsWith("CASE")) {
      rgb = config.caseColor; rough = 0.72;
    } else if (config.caseColor && !hasCase && (name.startsWith("PCB_TOP") || name.startsWith("PCB_BODY"))) {
      rgb = config.caseColor; rough = 0.72;
    } else if (config.keycaps && name.startsWith("KEYCAP")) {
      const m = name.match(/KEYCAP_(\d+)/);
      const i = m ? parseInt(m[1], 10) : 0;
      rgb = config.keycaps[Math.min(i, config.keycaps.length - 1)];
      rough = 0.65;
    }
    if (rgb) pbr.setBaseColorFactor([rgb[0], rgb[1], rgb[2], 1]);
    if (rough !== undefined) { pbr.setRoughnessFactor(rough); pbr.setMetallicFactor(metal); }
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile("public/_turntable.html", harnessHtml);

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });

  try {
    for (const config of CONFIGS) {
      const page = await browser.newPage();
      await page.setViewport({ width: FRAME, height: FRAME, deviceScaleFactor: CAPTURE_SCALE });
      await page.goto(`${BASE}/_turntable.html`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.waitForFunction(() => document.getElementById("mv")?.loaded === true, { timeout: 60000 });
      await page.evaluate(applyMaterials, { ...config, SCREW });
      await new Promise((r) => setTimeout(r, 1200)); // env prefilter + first render

      const el = await page.$("#mv");
      const frameBufs = [];
      for (let i = 0; i < FRAMES; i++) {
        const theta = (i * 360) / FRAMES;
        await page.evaluate((t) => {
          const mv = document.getElementById("mv");
          mv.cameraOrbit = `${t}deg 75deg auto`;
          mv.jumpCameraToGoal();
        }, theta);
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const shot = await el.screenshot({ omitBackground: true });
        // Downscale the 2× capture to FRAME px, keep alpha.
        frameBufs.push(await sharp(shot).resize(FRAME, FRAME, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer());
      }
      await page.close();

      // Vertical filmstrip with a duplicate of frame 0 appended so the CSS
      // steps() loop wraps seamlessly (steps(FRAMES) over FRAMES+1 frames).
      const strip = [...frameBufs, frameBufs[0]];
      const composites = await Promise.all(
        strip.map(async (b, i) => ({ input: b, top: i * FRAME, left: 0 })),
      );
      const outPath = path.join(OUT_DIR, `${config.id}.webp`);
      await sharp({
        create: { width: FRAME, height: FRAME * strip.length, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
      })
        .composite(composites)
        .webp({ quality: 82, alphaQuality: 90, effort: 6 })
        .toFile(outPath);
      const kb = Math.round((await fs.stat(outPath)).size / 1024);
      console.log(`OK  ${config.id}  → ${outPath}  (${strip.length} frames, ${kb} KB)`);
    }
  } finally {
    await browser.close();
    await fs.rm("public/_turntable.html", { force: true });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
