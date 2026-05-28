#!/usr/bin/env node
// Clean product photos: sample bg, pad, rotate, crop to target aspect.
// Writes <name>-clean.jpeg siblings; never overwrites originals.

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.resolve(__dirname, '../public/images/products');

const JOBS = [
  { file: 'hero-color-iso.jpeg',     rotate: 0,   aspect: [5, 4]  },
  { file: 'card-white.jpeg',         rotate: -1,  aspect: [1, 1]  },
  { file: 'card-black.jpeg',         rotate: 2,   aspect: [1, 1]  },
  { file: 'card-rasta.jpeg',         rotate: 0,   aspect: [1, 1]  },
  { file: 'lineup-all-four.jpeg',    rotate: 0,   aspect: [16, 9] },
  { file: 'pcb-front.jpeg',          rotate: 90,  aspect: [4, 3]  },
  { file: 'hero-white-hand.jpeg',    rotate: 0,   aspect: [4, 5]  },
  // lifestyle-desk-color.jpeg: skipped per instructions (preserve lifestyle vibe)
];

const toHex = (r, g, b) =>
  '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

// Sample average bg color from mid-edge strips only (skip corners to avoid vignette).
// Top strip: 20px tall, spanning 25%-75% of width. Same for bottom strip.
// IMPORTANT: sharp's .stats() reads the SOURCE image, not the extracted region;
// must materialize via toBuffer() before calling stats().
async function sampleMidEdges(buffer, width, height) {
  const stripH = 20;
  const xStart = Math.floor(width * 0.25);
  const xEnd = Math.floor(width * 0.75);
  const stripW = Math.max(10, xEnd - xStart);

  const regions = [
    { left: xStart, top: 0,               width: stripW, height: stripH }, // Top mid strip
    { left: xStart, top: height - stripH, width: stripW, height: stripH }, // Bot mid strip
  ];

  let totals = [0, 0, 0];
  for (const r of regions) {
    const cropped = await sharp(buffer)
      .extract({ left: r.left, top: r.top, width: r.width, height: r.height })
      .toBuffer();
    const stats = await sharp(cropped).stats();
    totals[0] += stats.channels[0].mean;
    totals[1] += stats.channels[1].mean;
    totals[2] += stats.channels[2].mean;
  }
  const avg = totals.map((t) => t / regions.length);
  return { hex: toHex(avg[0], avg[1], avg[2]), rgb: avg };
}

async function processOne(job) {
  const inputPath = path.join(PRODUCTS_DIR, job.file);
  const base = job.file.replace(/\.jpe?g$/i, '');
  const outputPath = path.join(PRODUCTS_DIR, `${base}-clean.jpeg`);

  // Auto-orient via EXIF first to normalize pixel dims.
  const oriented = await sharp(inputPath).rotate().toBuffer({ resolveWithObject: true });
  const W = oriented.info.width;
  const H = oriented.info.height;

  const { hex: bgHex } = await sampleMidEdges(oriented.data, W, H);

  // Pad generously (1.5x each dim), rotate with bg fill, then crop to centered target aspect.
  const padX = Math.floor(W * 0.25);
  const padY = Math.floor(H * 0.25);
  const paddedW = W + padX * 2;
  const paddedH = H + padY * 2;

  let pipeline = sharp(oriented.data)
    .extend({ top: padY, bottom: padY, left: padX, right: padX, background: bgHex });

  if (job.rotate !== 0) {
    pipeline = pipeline.rotate(job.rotate, { background: bgHex });
  }

  // After rotate, dims change. Materialize to get post-rotate dims.
  const rotated = await pipeline.toBuffer({ resolveWithObject: true });
  const rW = rotated.info.width;
  const rH = rotated.info.height;

  // Compute centered crop with target aspect ratio.
  const [aw, ah] = job.aspect;
  const targetRatio = aw / ah;
  const currentRatio = rW / rH;

  let cropW, cropH;
  if (currentRatio > targetRatio) {
    // Too wide -> limit by height
    cropH = rH;
    cropW = Math.round(cropH * targetRatio);
  } else {
    // Too tall -> limit by width
    cropW = rW;
    cropH = Math.round(cropW / targetRatio);
  }

  // Pull crop in a bit so we trim rotation artifacts at edges (5% inset of pad).
  const inset = Math.floor(Math.min(padX, padY) * 0.6);
  cropW = Math.max(100, cropW - inset * 2);
  cropH = Math.max(100, cropH - inset * 2);
  // Re-fit aspect after inset
  if (cropW / cropH > targetRatio) {
    cropW = Math.round(cropH * targetRatio);
  } else {
    cropH = Math.round(cropW / targetRatio);
  }

  const left = Math.max(0, Math.floor((rW - cropW) / 2));
  const top = Math.max(0, Math.floor((rH - cropH) / 2));

  await sharp(rotated.data)
    .extract({ left, top, width: cropW, height: cropH })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outputPath);

  return {
    file: job.file,
    out: path.basename(outputPath),
    rotate: job.rotate,
    aspect: `${aw}:${ah}`,
    bgHex,
    origDims: `${W}x${H}`,
    outDims: `${cropW}x${cropH}`,
  };
}

async function main() {
  const results = [];
  for (const job of JOBS) {
    try {
      const r = await processOne(job);
      console.log(
        `OK  ${r.file}  ->  ${r.out}  | rot=${r.rotate}  aspect=${r.aspect}  bg=${r.bgHex}  ${r.origDims} -> ${r.outDims}`
      );
      results.push(r);
    } catch (err) {
      console.error(`FAIL ${job.file}: ${err.message}`);
    }
  }
  console.log(`\nProcessed ${results.length}/${JOBS.length} files.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
