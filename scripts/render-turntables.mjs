/**
 * Pre-render a still 3D loader image for each product card / hero.
 *
 * Why: a live <model-viewer> costs ~1 MB of three.js + a WebGL context + HDR
 * prefiltering before it shows anything. This renders a single high-res WebP
 * still (the model at its 0° resting pose) that paints instantly like any
 * image — zero WebGL — and crossfades into the live interactive model once it
 * mounts. (A CSS-stepped spinning sprite was tried first but read as glitchy
 * at the frame rate a filmstrip allows, so the motion lives only in the real
 * WebGL turntable; this is just a crisp placeholder.)
 *
 * The still is captured with the SAME GLB, HDR, tone-mapping, camera, and
 * per-mesh material overrides the live ProductModelViewer applies, so it lines
 * up with the live model and the crossfade has no scale/colour jump.
 *
 * Output: public/turntables/<id>.webp — one ~1200 px still per config.
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
// The loader is a single STILL (frame 0, 0°) that crossfades into the live
// model — so we render one crisp high-res frame per config rather than a
// low-res filmstrip. SIZE is the CSS box; CAPTURE_SCALE oversamples for retina.
const SIZE = 600;
const CAPTURE_SCALE = 2; // → 1200 px stills (≈2.7× the old 440 px filmstrip)
const ORBIT = "0deg 75deg auto"; // matches <model-viewer>'s default resting camera
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
  { id: "macropad-white", caseColor: hex("#AFAAA1"), keycaps: TRAFFIC, hide: null },
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
#mv{width:${SIZE}px;height:${SIZE}px;background:transparent;--poster-color:transparent}</style>
<script type="module" src="https://unpkg.com/@google/model-viewer@${MV_VERSION}/dist/model-viewer.min.js"></script>
</head><body>
<model-viewer id="mv"
  src="${BASE}/models/sudo-macropad.glb"
  environment-image="${BASE}/hdri/studio.hdr"
  tone-mapping="commerce" exposure="1.05"
  shadow-intensity="1" shadow-softness="0.8"
  interaction-prompt="none" camera-controls disable-zoom disable-pan
  camera-orbit="${ORBIT}" reveal="auto"></model-viewer>
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
      rgb = config.caseColor; rough = 0.82;
    } else if (config.caseColor && !hasCase && (name.startsWith("PCB_TOP") || name.startsWith("PCB_BODY"))) {
      rgb = config.caseColor; rough = 0.82;
    } else if (config.keycaps && name.startsWith("KEYCAP")) {
      const m = name.match(/KEYCAP_(\d+)/);
      const i = m ? parseInt(m[1], 10) : 0;
      rgb = config.keycaps[Math.min(i, config.keycaps.length - 1)];
      rough = 0.78;
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
      await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: CAPTURE_SCALE });
      await page.goto(`${BASE}/_turntable.html`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.waitForFunction(() => document.getElementById("mv")?.loaded === true, { timeout: 60000 });
      await page.evaluate(applyMaterials, { ...config, SCREW });

      // Per-config framing: hidden-mesh views (pcb/keycaps) keep the full
      // model's bounding box, so zoom in to fill the frame with the visible
      // part. `orbit` overrides the default resting camera.
      await page.evaluate((orbit) => {
        const mv = document.getElementById("mv");
        if (orbit) { mv.cameraOrbit = orbit; mv.jumpCameraToGoal(); }
      }, config.orbit || ORBIT);
      await new Promise((r) => setTimeout(r, 1200)); // env prefilter + render

      const el = await page.$("#mv");
      const shot = await el.screenshot({ omitBackground: true });
      await page.close();

      // Single high-res still at the live viewer's framing, so the crossfade
      // to the live model has no scale jump. Just transcode the capture to WebP.
      const outPath = path.join(OUT_DIR, `${config.id}.webp`);
      await sharp(shot)
        .webp({ quality: 90, alphaQuality: 100, effort: 6 })
        .toFile(outPath);
      const kb = Math.round((await fs.stat(outPath)).size / 1024);
      console.log(`OK  ${config.id}  → ${outPath}  (still ${SIZE * CAPTURE_SCALE}px, ${kb} KB)`);
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
