"""
Background-remove every product photo and composite it onto the site's dark
card background (#141414) with consistent square framing.

Pipeline per photo:
  1. EXIF-orient
  2. rembg mask (ISNet general-use — clean alpha edges)
  3. tight bbox crop of the masked subject
  4. scale so the subject's longest side = TARGET_FRACTION of the canvas
  5. paste centred onto an OUT_SIZE × OUT_SIZE solid-#141414 canvas
  6. JPEG quality 95 → public/images/products/<name>-dark.jpeg

The output is a sibling file; originals are never touched.

Usage:
  /tmp/rembg-venv/bin/python scripts/bg-remove-photos.py
"""

from __future__ import annotations

import io
import os
import sys
from pathlib import Path

from PIL import Image, ImageOps
from rembg import remove, new_session

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT / "public" / "images" / "products"

# Site card surface — pulled from globals.css `--surface: #141414`.
BG_RGB = (0x14, 0x14, 0x14)
# Output canvas: 1:1 square at 1600 px so retina (2x) lays out at ~800 css px
# without visible pixelation. JPEG at this size is still <300 KB.
OUT_SIZE = 1600
# Subject's longest side as a fraction of OUT_SIZE — keep ~12% padding on
# every side so the subject never crowds the card edge.
TARGET_FRACTION = 0.76

# Per-file framing overrides. Most photos look right at TARGET_FRACTION; a
# couple need a tighter or wider treatment (e.g. the all-four lineup is
# already a long horizontal row, so we want a slightly larger fraction so
# the keys are readable).
OVERRIDES: dict[str, dict] = {
    "lineup-all-four.jpeg":         {"fraction": 0.88},
    "lineup-all-four-clean.jpeg":   {"fraction": 0.88},
    "lifestyle-desk-color.jpeg":    {"fraction": 0.82},
    "lifestyle-desk-white.jpeg":    {"fraction": 0.82},
    "hero-white-hand-landscape.jpeg": {"fraction": 0.82},
    "pcb-back.jpeg":                {"fraction": 0.78},
    "pcb-front.jpeg":               {"fraction": 0.78},
    "pcb-front-clean.jpeg":         {"fraction": 0.78},
}


def process(session, input_path: Path) -> Path:
    out_path = input_path.with_name(input_path.stem + "-dark.jpeg")

    # 1. EXIF-orient + decode
    src = Image.open(input_path)
    src = ImageOps.exif_transpose(src).convert("RGB")

    # 2. rembg → RGBA with subject isolated.
    #
    # We deliberately do NOT use alpha_matting here: with low-contrast pairings
    # (white case on white paper, black case on dark wood) the matting trimap
    # erodes into the actual product edge and the white wordmark on the case
    # gets sliced off. birefnet-general produces clean enough alpha edges on
    # its own; post_process_mask=True closes the small holes that would
    # otherwise show as black pinholes after compositing.
    raw = io.BytesIO()
    src.save(raw, format="PNG")
    cut_bytes = remove(
        raw.getvalue(),
        session=session,
        post_process_mask=True,
    )
    cut = Image.open(io.BytesIO(cut_bytes)).convert("RGBA")

    # 3. Tight crop to non-transparent bbox so per-photo padding can be
    # normalised regardless of how much empty bg the original had.
    bbox = cut.getbbox()
    if bbox is None:
        raise RuntimeError(f"rembg produced an empty mask for {input_path.name}")
    subject = cut.crop(bbox)

    # 4. Scale so the longer side of the subject = fraction * OUT_SIZE.
    fraction = OVERRIDES.get(input_path.name, {}).get("fraction", TARGET_FRACTION)
    target = int(OUT_SIZE * fraction)
    sw, sh = subject.size
    scale = target / max(sw, sh)
    new_w, new_h = max(1, int(round(sw * scale))), max(1, int(round(sh * scale)))
    subject = subject.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # 5. Paste centred onto a solid-colour canvas. Use the subject's alpha as
    # the paste mask so edges blend smoothly into BG_RGB instead of stair-
    # stepping. The canvas is RGB (not RGBA) so the JPEG encoder doesn't
    # silently drop alpha.
    canvas = Image.new("RGB", (OUT_SIZE, OUT_SIZE), BG_RGB)
    cx = (OUT_SIZE - new_w) // 2
    cy = (OUT_SIZE - new_h) // 2
    canvas.paste(subject, (cx, cy), subject)

    # 6. Save as JPEG at high quality.
    canvas.save(out_path, format="JPEG", quality=95, optimize=True, progressive=True)
    return out_path


# Sources to process. We re-mask the originals (never the *-clean variants),
# since the originals carry the most pixel detail and rembg works best on
# untouched data.
SOURCES = [
    "card-black.jpeg",
    "card-white.jpeg",
    "card-rasta.jpeg",
    "angle-black-white.jpeg",
    "hero-rasta-angle.jpeg",
    "hero-color-iso.jpeg",
    "hero-white-hand.jpeg",
    "hero-white-hand-2.jpeg",
    "hero-white-hand-landscape.jpeg",
    "lineup-all-four.jpeg",
    "lifestyle-desk-color.jpeg",
    "lifestyle-desk-white.jpeg",
    "detail-bottom.jpeg",
    "pcb-front.jpeg",
    "pcb-back.jpeg",
]


def main():
    # birefnet-general: highest-quality general segmentation in rembg as of
    # writing — significantly cleaner edges than ISNet on the white-case-on-
    # white-paper and black-case-on-dark-wood pairings where ISNet's mask
    # was eating into the subject. ~1 GB model downloaded on first run,
    # cached under ~/.u2net afterwards.
    session = new_session("birefnet-general")
    ok = 0
    for name in SOURCES:
        src = PRODUCTS_DIR / name
        if not src.exists():
            print(f"SKIP {name} (missing)", file=sys.stderr)
            continue
        try:
            out = process(session, src)
            size_kb = out.stat().st_size // 1024
            print(f"OK   {name:36s} → {out.name:42s} ({size_kb} KB)")
            ok += 1
        except Exception as e:
            print(f"FAIL {name}: {e}", file=sys.stderr)
    print(f"\nProcessed {ok}/{len(SOURCES)} photos.")


if __name__ == "__main__":
    main()
