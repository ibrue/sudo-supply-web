"""
Convert the KiCad OBJ export to a single .glb with:

  - One glTF node per `g BodyN` group from the source OBJ
  - Per-body PBR materials (matte ABS / black steel) inferred from each body's
    dominant MTL material name and bbox heuristics
  - A baked "explode" animation that translates KEYCAP_n / SCREW_n /
    COMPONENT_n nodes outward from t=0 to t=1; the runtime scrubs
    currentTime to drive a smooth eased transition

Why custom parsing: trimesh's OBJ loader merges by material (losing `g`
identity); pywavefront errors on `g` statements. The OBJ is straightforward
to parse line-by-line.

Usage:
  /tmp/cad-venv/bin/python3 scripts/cad-to-glb.py INPUT.obj OUTPUT_DIR
"""

from __future__ import annotations

import os
import re
import sys
from collections import Counter, defaultdict
from typing import Dict, List, Tuple

import numpy as np
import trimesh
from trimesh.visual import TextureVisuals
from trimesh.visual.material import PBRMaterial

import pygltflib
from pygltflib import (
    GLTF2,
    Animation,
    AnimationChannel,
    AnimationChannelTarget,
    AnimationSampler,
    Accessor,
    BufferView,
)


# ──────────────────────────────────────────────────────────────────────────
# Role definitions
# ──────────────────────────────────────────────────────────────────────────

ROLE_DEFAULTS = {
    "CASE":      {"color": (26, 26, 26, 255),    "metallic": 0.0,  "roughness": 0.55},  # black ABS
    "KEYCAP":    {"color": (242, 240, 235, 255), "metallic": 0.0,  "roughness": 0.50},  # white ABS
    "SCREW":     {"color": (16, 16, 18, 255),    "metallic": 0.85, "roughness": 0.35},  # black steel
    "PCB_TOP":   {"color": (60, 60, 60, 255),    "metallic": 0.0,  "roughness": 0.55},
    "PCB_BODY":  {"color": (45, 45, 45, 255),    "metallic": 0.0,  "roughness": 0.55},
    "COMPONENT": {"color": (38, 38, 40, 255),    "metallic": 0.30, "roughness": 0.60},
}

# Materials from KiCad's MTL that imply a definite role.
MATERIAL_HINT_ROLE = {
    "Plastic_-_Matte_(Black)": "SCREW",   # used for screws + tiny black SMD covers
    "Plastic_-_Matte_(White)": "KEYCAP",  # used for the 4 keycaps
    "Opaque(80,124,105)":      "PCB_TOP", # green silkscreen
    "Opaque(87,173,113)":      "PCB_TOP",
    "Opaque(229,234,237)":     "PCB_BODY",
    "Opaque(228,227,207)":     "PCB_BODY",
    "Opaque(210,209,199)":     "PCB_BODY",
    "Opaque(149,149,149)":     "PCB_BODY",
    "Opaque(255,255,255)":     "PCB_BODY",
    "Opaque(245,245,246)":     "PCB_BODY",
}


# ──────────────────────────────────────────────────────────────────────────
# OBJ parser — per-body, keeps each `g BodyN` separate
# ──────────────────────────────────────────────────────────────────────────


def parse_obj_per_body(path: str) -> Tuple[np.ndarray, Dict[str, dict]]:
    """Return (all_vertices, {body_name: {faces, material_counts}}).

    Faces are 0-indexed into all_vertices.
    """
    verts: List[Tuple[float, float, float]] = []
    bodies: Dict[str, dict] = {}
    current_body: str | None = None
    current_material: str = ""

    face_token_re = re.compile(r"^(\d+)")

    with open(path, "r", buffering=1 << 20) as f:
        for line in f:
            if line.startswith("v "):
                p = line.split()
                verts.append((float(p[1]), float(p[2]), float(p[3])))
            elif line.startswith("g "):
                current_body = line[2:].strip()
                if current_body not in bodies:
                    bodies[current_body] = {"faces": [], "materials": Counter()}
            elif line.startswith("usemtl "):
                current_material = line[7:].strip()
            elif line.startswith("f "):
                if current_body is None:
                    continue
                idxs = []
                for tok in line.split()[1:]:
                    m = face_token_re.match(tok)
                    if m:
                        idxs.append(int(m.group(1)) - 1)  # OBJ is 1-based
                # Triangle-fan a polygon (KiCad exports tris but handle quads/ngons just in case)
                for i in range(1, len(idxs) - 1):
                    bodies[current_body]["faces"].append((idxs[0], idxs[i], idxs[i + 1]))
                    bodies[current_body]["materials"][current_material] += 1

    return np.array(verts, dtype=np.float64), bodies


# ──────────────────────────────────────────────────────────────────────────
# Per-body classification
# ──────────────────────────────────────────────────────────────────────────


def dominant_material(materials: Counter) -> str:
    if not materials:
        return ""
    return materials.most_common(1)[0][0]


def classify_bodies(
    verts: np.ndarray,
    bodies: Dict[str, dict],
) -> Dict[str, str]:
    """Return body_name → role tag (CASE/KEYCAP_n/SCREW_n/PCB_TOP/PCB_BODY/COMPONENT)."""
    # Per-body bbox + size + dominant material
    info: Dict[str, dict] = {}
    for name, data in bodies.items():
        faces = np.array(data["faces"], dtype=np.int64)
        if faces.size == 0:
            continue
        vidx = np.unique(faces.ravel())
        bv = verts[vidx]
        bb_min, bb_max = bv.min(0), bv.max(0)
        ext = bb_max - bb_min
        info[name] = {
            "faces": faces,
            "vidx": vidx,
            "bb_min": bb_min,
            "bb_max": bb_max,
            "center": (bb_min + bb_max) / 2,
            "ext": ext,
            "volume": float(ext[0] * ext[1] * ext[2]),
            "material": dominant_material(data["materials"]),
        }

    if not info:
        return {}

    # Figure out orientation: long axis = max overall extent, up axis = min
    overall_min = np.min([d["bb_min"] for d in info.values()], axis=0)
    overall_max = np.max([d["bb_max"] for d in info.values()], axis=0)
    overall_ext = overall_max - overall_min
    long_axis = int(np.argmax(overall_ext))
    up_axis = int(np.argmin(overall_ext))
    other_axis = [a for a in (0, 1, 2) if a not in (long_axis, up_axis)][0]

    # 1. CASE = largest body (or top N) using the dark grey (25,25,25) material
    #    OR simply the largest by volume regardless of material if that
    #    material isn't present. The case shell is unmistakably the biggest.
    by_volume = sorted(info.items(), key=lambda kv: -kv[1]["volume"])
    case_bodies: List[str] = []
    case_material_hint = "Opaque(25,25,25)"
    for name, d in by_volume:
        if d["material"] == case_material_hint and d["volume"] > 0.5 * by_volume[0][1]["volume"]:
            case_bodies.append(name)
    if not case_bodies:
        # Fallback: take the single largest body
        case_bodies = [by_volume[0][0]]

    # 2. KEYCAPS = pick the 4 bodies whose top surface is highest along the up
    #    axis and whose footprint matches a keycap roughly (~3 cm × 2 cm).
    #    We exclude bodies already labelled CASE.
    used = set(case_bodies)
    keycap_candidates = []
    for name, d in info.items():
        if name in used:
            continue
        e = d["ext"]
        long_e, other_e, up_e = e[long_axis], e[other_axis], e[up_axis]
        # Keycaps are roughly 2-4 cm in two dims and < 1 cm thick.
        if 1.0 <= long_e <= 4.0 and 1.0 <= other_e <= 4.0 and 0.2 <= up_e <= 1.5:
            keycap_candidates.append((d["bb_max"][up_axis], name, d))
    keycap_candidates.sort(key=lambda x: -x[0])  # highest top first
    # We want 4 distinct ones, ordered along the long axis for left→right naming.
    chosen_keycaps = keycap_candidates[:4]
    chosen_keycaps.sort(key=lambda x: x[2]["center"][long_axis])
    keycap_names = [c[1] for c in chosen_keycaps]
    used.update(keycap_names)

    # 3. SCREWS — the F3Z source confirms "M3 Cup Head Bolts M3X6" exist as a
    #    sub-component. In this OBJ export they show up as small (~0.5cm cubes)
    #    bodies in the gold/brass material Opaque(243,203,124). We pick all such
    #    bodies near a PCB corner — typically 3-4 of them.
    corners = [
        (overall_min[other_axis], overall_min[long_axis]),
        (overall_min[other_axis], overall_max[long_axis]),
        (overall_max[other_axis], overall_min[long_axis]),
        (overall_max[other_axis], overall_max[long_axis]),
    ]
    # Material can shift between exports. In the v1 export the screws were
    # gold (Opaque(243,203,124) = brass M3 heat-set look). After removing the
    # heat-set inserts the screws now show up as Opaque(229,234,237) (light
    # blue/silver = stainless steel). Accept both, plus a defensive set of
    # other metal-ish materials that could plausibly carry an M3 bolt.
    SCREW_MATERIALS = {
        "Opaque(243,203,124)",  # brass
        "Opaque(229,234,237)",  # stainless steel
        "Opaque(188,188,188)",  # light grey metal
        "Plastic_-_Matte_(Black)",  # black-oxide screws
    }
    screw_per_corner: Dict[int, Tuple[float, str]] = {}
    for name, d in info.items():
        if name in used:
            continue
        if d["material"] not in SCREW_MATERIALS:
            continue
        # M3 cup-head bolts: head ~5 mm diam, body ~9 mm tall. Allow a wider
        # range now that the export uses a different material.
        if max(d["ext"]) > 1.2 or min(d["ext"]) < 0.15:
            continue
        # Skip degenerate "pad" geometry (flat washers / soldermask rings):
        # require a real thickness in every axis.
        sorted_ext = sorted(d["ext"])
        if sorted_ext[0] < 0.2:
            continue
        c = d["center"]
        cx, cz = c[other_axis], c[long_axis]
        dists = [(cx - kx) ** 2 + (cz - kz) ** 2 for kx, kz in corners]
        i = int(np.argmin(dists))
        d_min = dists[i] ** 0.5
        if d_min < 1.5:
            if i not in screw_per_corner or d_min < screw_per_corner[i][0]:
                screw_per_corner[i] = (d_min, name)
    screw_names: List[str] = []
    for i in sorted(screw_per_corner.keys()):
        screw_names.append(screw_per_corner[i][1])
    used.update(screw_names)

    # 4. Assign roles by material hint for everything else
    rename: Dict[str, str] = {}
    for i, n in enumerate(case_bodies):
        rename[n] = f"CASE_{i}" if len(case_bodies) > 1 else "CASE"
    for i, n in enumerate(keycap_names):
        rename[n] = f"KEYCAP_{i}"
    for i, n in enumerate(screw_names):
        rename[n] = f"SCREW_{i}"
    pcb_top_idx = pcb_body_idx = component_idx = 0
    for name, d in info.items():
        if name in rename:
            continue
        hint = MATERIAL_HINT_ROLE.get(d["material"])
        if hint == "PCB_TOP":
            rename[name] = f"PCB_TOP_{pcb_top_idx}"
            pcb_top_idx += 1
        elif hint == "PCB_BODY":
            rename[name] = f"PCB_BODY_{pcb_body_idx}"
            pcb_body_idx += 1
        else:
            rename[name] = f"COMPONENT_{component_idx:04d}"
            component_idx += 1

    return rename


def role_of(node_name: str) -> str:
    for prefix in ("CASE", "KEYCAP", "SCREW", "PCB_TOP", "PCB_BODY", "COMPONENT"):
        if node_name.startswith(prefix):
            return prefix
    return "COMPONENT"


# ──────────────────────────────────────────────────────────────────────────
# Build the trimesh.Scene from the per-body parse
# ──────────────────────────────────────────────────────────────────────────


def build_scene(
    verts: np.ndarray,
    bodies: Dict[str, dict],
    rename: Dict[str, str],
) -> trimesh.Scene:
    scene = trimesh.Scene()
    for old_name, data in bodies.items():
        if old_name not in rename:
            continue
        faces = np.array(data["faces"], dtype=np.int64)
        if faces.size == 0:
            continue
        # Compact vertex list per body so the mesh is self-contained
        vidx_unique, inverse = np.unique(faces.ravel(), return_inverse=True)
        local_verts = verts[vidx_unique]
        local_faces = inverse.reshape(faces.shape)
        mesh = trimesh.Trimesh(vertices=local_verts, faces=local_faces, process=False)
        new_name = rename[old_name]
        scene.add_geometry(mesh, node_name=new_name, geom_name=new_name)
    return scene


def apply_pbr(scene: trimesh.Scene) -> None:
    for name, geom in scene.geometry.items():
        role = role_of(name)
        cfg = ROLE_DEFAULTS[role]
        rgba = tuple(c / 255.0 for c in cfg["color"])
        mat_name = name if role == "KEYCAP" else f"{role}_mat"
        try:
            geom.visual = TextureVisuals(
                material=PBRMaterial(
                    name=mat_name,
                    baseColorFactor=rgba,
                    metallicFactor=cfg["metallic"],
                    roughnessFactor=cfg["roughness"],
                )
            )
        except Exception as e:
            print(f"[warn] PBR failed on {name}: {e}")


def normalize_pose(scene: trimesh.Scene, target_longest_m: float = 0.18) -> float:
    """Return the scale factor applied so callers can transform offsets too."""
    b = scene.bounds
    centre = (b[0] + b[1]) / 2
    scene.apply_translation(-centre)
    longest = float(np.max(scene.extents))
    s = target_longest_m / longest if longest > 0 else 1.0
    scene.apply_scale(s)
    return s


# ──────────────────────────────────────────────────────────────────────────
# Explode animation baked into the GLB
# ──────────────────────────────────────────────────────────────────────────


def compute_explode_offsets(scene: trimesh.Scene) -> Dict[str, Tuple[float, float, float]]:
    """For each role, return the target translation that produces an exploded
    layout. Coordinates are in the SAME space as the exported GLB."""
    extents = scene.extents
    up_axis = int(np.argmin(extents))
    long_axis = int(np.argmax(extents))
    other_axis = [a for a in (0, 1, 2) if a not in (up_axis, long_axis)][0]
    thickness = float(extents[up_axis])

    offsets: Dict[str, Tuple[float, float, float]] = {}
    for name, geom in scene.geometry.items():
        role = role_of(name)
        t = [0.0, 0.0, 0.0]
        if role == "KEYCAP":
            t[up_axis] = thickness * 2.5
        elif role == "SCREW":
            c = (geom.bounds[0] + geom.bounds[1]) / 2
            sign_o = 1.0 if c[other_axis] >= 0 else -1.0
            sign_l = 1.0 if c[long_axis] >= 0 else -1.0
            t[other_axis] = sign_o * thickness * 1.4
            t[long_axis] = sign_l * thickness * 1.4
            t[up_axis] = thickness * 3.0
        elif role == "CASE":
            t[up_axis] = -thickness * 0.8
        elif role == "PCB_BODY":
            t[up_axis] = -thickness * 0.3
        elif role == "COMPONENT":
            t[up_axis] = -thickness * 1.8
        offsets[name] = tuple(t)
    return offsets


def _append_buffer(gltf: GLTF2, raw: bytes) -> int:
    """Append bytes to the GLB buffer 0 and return the byte offset of the
    appended chunk. Assumes single buffer with embedded bin (typical for .glb).
    """
    buffer = gltf.buffers[0]
    blob = gltf.binary_blob() or b""
    offset = len(blob)
    new_blob = blob + raw
    # pad to 4-byte alignment
    pad = (-len(new_blob)) % 4
    if pad:
        new_blob += b"\x00" * pad
    gltf.set_binary_blob(new_blob)
    buffer.byteLength = len(new_blob)
    return offset


def bake_explode_animation(
    glb_path: str,
    offsets: Dict[str, Tuple[float, float, float]],
    duration_s: float = 1.0,
) -> None:
    """Open the GLB, append translation keyframes for each named node, save."""
    gltf = GLTF2().load(glb_path)

    # Map node-name → node-index
    name_to_idx: Dict[str, int] = {}
    for i, node in enumerate(gltf.nodes):
        if node.name:
            name_to_idx[node.name] = i

    # Shared input sampler: [0.0, duration_s] (f32 little-endian)
    times = np.array([0.0, duration_s], dtype=np.float32).tobytes()
    times_offset = _append_buffer(gltf, times)
    times_bv = BufferView(buffer=0, byteOffset=times_offset, byteLength=len(times))
    gltf.bufferViews.append(times_bv)
    times_bv_idx = len(gltf.bufferViews) - 1
    times_acc = Accessor(
        bufferView=times_bv_idx,
        componentType=5126,  # GL_FLOAT
        count=2,
        type="SCALAR",
        min=[0.0],
        max=[float(duration_s)],
    )
    gltf.accessors.append(times_acc)
    times_acc_idx = len(gltf.accessors) - 1

    samplers: List[AnimationSampler] = []
    channels: List[AnimationChannel] = []

    for name, offset in offsets.items():
        if name not in name_to_idx:
            continue
        if all(v == 0.0 for v in offset):
            continue  # nothing to animate
        # Output: 2 VEC3 values (start at origin, end at offset)
        out = np.array([0.0, 0.0, 0.0, *offset], dtype=np.float32).tobytes()
        out_offset = _append_buffer(gltf, out)
        out_bv = BufferView(buffer=0, byteOffset=out_offset, byteLength=len(out))
        gltf.bufferViews.append(out_bv)
        out_bv_idx = len(gltf.bufferViews) - 1
        out_acc = Accessor(
            bufferView=out_bv_idx,
            componentType=5126,
            count=2,
            type="VEC3",
            min=[min(0.0, offset[0]), min(0.0, offset[1]), min(0.0, offset[2])],
            max=[max(0.0, offset[0]), max(0.0, offset[1]), max(0.0, offset[2])],
        )
        gltf.accessors.append(out_acc)
        out_acc_idx = len(gltf.accessors) - 1
        sampler = AnimationSampler(
            input=times_acc_idx,
            output=out_acc_idx,
            interpolation="LINEAR",
        )
        samplers.append(sampler)
        sampler_idx = len(samplers) - 1
        target = AnimationChannelTarget(node=name_to_idx[name], path="translation")
        channels.append(AnimationChannel(sampler=sampler_idx, target=target))

    if not channels:
        print("[anim] no nodes matched — skipping animation bake")
        return

    anim = Animation(name="explode", channels=channels, samplers=samplers)
    gltf.animations.append(anim)
    gltf.save(glb_path)
    print(f"[anim] baked 'explode' with {len(channels)} channels")


# ──────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────


def summarize(scene: trimesh.Scene) -> Dict[str, int]:
    out: Dict[str, int] = {}
    for n in scene.geometry.keys():
        r = role_of(n)
        out[r] = out.get(r, 0) + 1
    return out


def main():
    if len(sys.argv) < 3:
        print("usage: cad-to-glb.py INPUT.obj OUT_DIR")
        sys.exit(2)
    src, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    print("[parse] reading OBJ per body...")
    verts, bodies = parse_obj_per_body(src)
    print(f"[parse] {len(verts)} vertices, {len(bodies)} bodies")

    rename = classify_bodies(verts, bodies)
    scene = build_scene(verts, bodies, rename)
    print(f"[classify] role counts: {summarize(scene)}")

    apply_pbr(scene)
    normalize_pose(scene)
    print(f"[normalize] extents (m): {scene.extents.tolist()}")

    offsets = compute_explode_offsets(scene)
    out_path = os.path.join(out_dir, "sudo-macropad.glb")
    scene.export(out_path)
    size_before = os.path.getsize(out_path)
    print(f"[export] wrote {out_path} ({size_before} bytes)")

    bake_explode_animation(out_path, offsets, duration_s=1.0)
    size_after = os.path.getsize(out_path)
    print(f"[anim] file size after: {size_after} bytes")


if __name__ == "__main__":
    main()
