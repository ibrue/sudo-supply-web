"""
STEP → GLB converter for sudo.supply.

Approach:
  - Use OpenCascade's plain `STEPControl_Reader` (the XCAF reader crashes on
    this build of pythonocc-core 7.9 with Standard_NullObject when
    instantiating TDocStd_Document — known compatibility issue).
  - Tessellate every solid produced by the import.
  - Classify each solid by geometry (size, position, dominant axis) into:
        CASE / KEYCAP_n / SCREW_n / PCB_TOP / PCB_BODY / COMPONENT
  - Bake PBR materials + an "explode" animation track.

Plain-reader output is much cleaner than the OBJ pipeline (388 topological
solids vs. 740 fragmented shells), so the heuristics land more reliably and
the file size shrinks.

Usage:
  /opt/homebrew/Caskroom/miniforge/base/envs/sudo-cad/bin/python \\
      scripts/step-to-glb.py INPUT.step OUT_DIR
"""

from __future__ import annotations

import os
import sys
from typing import Dict, List, Tuple

import numpy as np
import trimesh
from trimesh.visual import TextureVisuals
from trimesh.visual.material import PBRMaterial

from OCC.Core.STEPControl import STEPControl_Reader
from OCC.Core.IFSelect import IFSelect_RetDone
from OCC.Core.TopExp import TopExp_Explorer
from OCC.Core.TopAbs import TopAbs_SOLID, TopAbs_FACE, TopAbs_Orientation
from OCC.Core.TopoDS import topods
from OCC.Core.BRep import BRep_Tool
from OCC.Core.BRepMesh import BRepMesh_IncrementalMesh
from OCC.Core.TopLoc import TopLoc_Location

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
# Role configuration
# ──────────────────────────────────────────────────────────────────────────


ROLE_DEFAULTS = {
    # 3D-printed PLA case shells. PLA has a faint semi-matte sheen (slightly
    # glossier than ABS), so roughness sits a notch below "fully matte" — the
    # surface still picks up subtle highlights the way an FDM-printed PLA
    # part does in person.
    "CASE":      {"color": (26, 26, 26, 255),    "metallic": 0.0,  "roughness": 0.72},
    # PBT dye-sub keycaps — still plastic but slightly smoother than the
    # printed case.
    "KEYCAP":    {"color": (242, 240, 235, 255), "metallic": 0.0,  "roughness": 0.65},
    # Black-oxide / blackened-steel M3 cup-head bolts. Very low base colour
    # with the metallic factor doing the lifting so highlights still pick up
    # the room.
    "SCREW":     {"color": (16, 16, 18, 255),    "metallic": 0.85, "roughness": 0.40},
    # USB-C shell stays bright stainless steel.
    "METAL":     {"color": (188, 192, 196, 255), "metallic": 0.92, "roughness": 0.30},
    # PCB substrate — modern matte-black soldermask look (with the slight
    # metallic factor faking the copper-trace sheen visible through the mask).
    "SUBSTRATE": {"color": (12, 12, 14, 255),    "metallic": 0.15, "roughness": 0.50},
    # White silkscreen text/markings layer (only used if the STEP has
    # separate thin silkscreen bodies — most exports bake it onto the
    # substrate surface as no separate solid). Pure white so it reads
    # crisply against the dark soldermask under PBR lighting.
    "SILKSCREEN":{"color": (255, 255, 255, 255), "metallic": 0.0,  "roughness": 0.45},
    # Legacy aliases — kept so any old GLB references still find a colour.
    "PCB":       {"color": (12, 12, 14, 255),    "metallic": 0.15, "roughness": 0.50},
    "PCB_TOP":   {"color": (12, 12, 14, 255),    "metallic": 0.15, "roughness": 0.50},
    "PCB_BODY":  {"color": (12, 12, 14, 255),    "metallic": 0.15, "roughness": 0.50},
    "COMPONENT": {"color": (38, 38, 40, 255),    "metallic": 0.30, "roughness": 0.60},
}


def role_of_node(name: str) -> str:
    if name.startswith("SUBSTRATE"):
        return "SUBSTRATE"
    if name.startswith("SILKSCREEN"):
        return "SILKSCREEN"
    if name.startswith("METAL"):
        return "METAL"
    if name == "PCB" or name.startswith("PCB_PART"):
        return "PCB"
    if name.startswith("CASE_INTERIOR") or name.startswith("CASE"):
        return "CASE"
    for prefix in ("KEYCAP", "SCREW", "PCB_TOP", "PCB_BODY", "COMPONENT"):
        if name.startswith(prefix):
            return prefix
    return "COMPONENT"


# ──────────────────────────────────────────────────────────────────────────
# Tessellation
# ──────────────────────────────────────────────────────────────────────────


def tessellate_solid(shape, linear_deflection: float = 0.15) -> trimesh.Trimesh | None:
    BRepMesh_IncrementalMesh(shape, linear_deflection, False, 0.5, True)

    all_verts: List[Tuple[float, float, float]] = []
    all_faces: List[Tuple[int, int, int]] = []

    exp = TopExp_Explorer(shape, TopAbs_FACE)
    while exp.More():
        face = topods.Face(exp.Current())
        loc = TopLoc_Location()
        tri = BRep_Tool.Triangulation(face, loc)
        if tri is not None:
            trsf = loc.Transformation()
            offset = len(all_verts)
            for i in range(1, tri.NbNodes() + 1):
                pnt = tri.Node(i).Transformed(trsf)
                all_verts.append((pnt.X(), pnt.Y(), pnt.Z()))
            reverse = face.Orientation() == TopAbs_Orientation.TopAbs_REVERSED
            for i in range(1, tri.NbTriangles() + 1):
                a, b, c = tri.Triangle(i).Get()
                a -= 1; b -= 1; c -= 1
                if reverse:
                    a, c = c, a
                all_faces.append((offset + a, offset + b, offset + c))
        exp.Next()

    if not all_verts or not all_faces:
        return None
    return trimesh.Trimesh(
        vertices=np.array(all_verts, dtype=np.float64),
        faces=np.array(all_faces, dtype=np.int64),
        process=False,
    )


# ──────────────────────────────────────────────────────────────────────────
# Classification — by geometry on clean OCC solids
# ──────────────────────────────────────────────────────────────────────────


def classify(meshes: List[Tuple[str, trimesh.Trimesh]]) -> Tuple[Dict[str, str], int]:
    """Return (original_name → role-tagged name, up_axis_index).

    Inputs are clean topological solids — much cleaner than OBJ fragments —
    so size and position heuristics land reliably. up_axis is returned so
    callers can apply tiny axial offsets (e.g. lift silkscreen above the
    substrate to defeat z-fighting) before scene assembly.
    """
    # Bounds per mesh
    info: Dict[str, dict] = {}
    for name, m in meshes:
        bb_min, bb_max = m.bounds[0], m.bounds[1]
        c = (bb_min + bb_max) / 2
        ext = bb_max - bb_min
        info[name] = {
            "bb_min": bb_min, "bb_max": bb_max,
            "center": c, "ext": ext,
            "volume": float(ext[0] * ext[1] * ext[2]),
        }

    overall_min = np.min([d["bb_min"] for d in info.values()], axis=0)
    overall_max = np.max([d["bb_max"] for d in info.values()], axis=0)
    overall_ext = overall_max - overall_min
    long_axis = int(np.argmax(overall_ext))
    up_axis = int(np.argmin(overall_ext))
    other_axis = [a for a in (0, 1, 2) if a not in (long_axis, up_axis)][0]

    # STEP units are millimetres. The printed case is two halves (~38 × 9 × 95
    # and 38 × 7 × 95 mm). The four keycaps are ~32 × 5 × 18 mm. M3 cup-head
    # bolts are ~5 × 9 × 5 mm. PCB layers are thin sheets ~34 × 1.5 × 91 mm.

    # 1. CASE — the two largest meshes, both spanning ~most of the board.
    by_vol = sorted(info.items(), key=lambda kv: -kv[1]["volume"])
    case_names: List[str] = []
    top_vol = by_vol[0][1]["volume"]
    for name, d in by_vol[:3]:
        # within 80% of the biggest piece AND covers most of long axis
        if (
            d["volume"] > 0.5 * top_vol
            and d["ext"][long_axis] > 0.85 * overall_ext[long_axis]
            and d["ext"][up_axis] > 4.0  # thicker than a PCB layer
        ):
            case_names.append(name)
    if not case_names:
        case_names = [by_vol[0][0]]

    # 2. KEYCAPS — ~32 × 18 × 5 mm (DSA 1.75u keycaps). Test on the SORTED
    #    extents so axis orientation doesn't matter:
    #       thinnest  ≈ 5  mm   (cap thickness)
    #       middle    ≈ 18 mm   (along the board's long axis)
    #       longest   ≈ 32 mm   (across the board's width)
    keycap_candidates: List[Tuple[float, str, dict]] = []
    for name, d in info.items():
        if name in case_names:
            continue
        e = sorted(d["ext"])
        if 2.0 <= e[0] <= 8.0 and 12.0 <= e[1] <= 22.0 and 25.0 <= e[2] <= 40.0:
            keycap_candidates.append((d["bb_max"][up_axis], name, d))
    keycap_candidates.sort(reverse=True)
    chosen_keycaps = keycap_candidates[:4]
    chosen_keycaps.sort(key=lambda x: x[2]["center"][long_axis])
    keycap_names = [c[1] for c in chosen_keycaps]
    used = set(case_names) | set(keycap_names)

    # 3. SCREWS — M3 cup-head bolts ~5 × 9 × 5 mm at the four PCB corners.
    corners = [
        (overall_min[other_axis], overall_min[long_axis]),
        (overall_min[other_axis], overall_max[long_axis]),
        (overall_max[other_axis], overall_min[long_axis]),
        (overall_max[other_axis], overall_max[long_axis]),
    ]
    screw_per_corner: Dict[int, Tuple[float, str]] = {}
    for name, d in info.items():
        if name in used:
            continue
        e = sorted(d["ext"])
        # M3 bolt: head ~5 mm wide, body ~9 mm long; allow some slop
        if not (3.0 <= e[0] <= 7.0 and 3.0 <= e[1] <= 7.0 and 6.0 <= e[2] <= 12.0):
            continue
        c = d["center"]
        cx, cz = c[other_axis], c[long_axis]
        dists = [(cx - kx) ** 2 + (cz - kz) ** 2 for kx, kz in corners]
        i = int(np.argmin(dists))
        d_min = dists[i] ** 0.5
        if d_min < 15.0:
            if i not in screw_per_corner or d_min < screw_per_corner[i][0]:
                screw_per_corner[i] = (d_min, name)
    screw_names = [screw_per_corner[i][1] for i in sorted(screw_per_corner.keys())]
    used.update(screw_names)

    # 4. PCB SUBSTRATE — the chunky flat board (1–2 mm thick, spans most of
    #    the long axis). Coloured matte black like a modern PCB soldermask.
    substrate_names: List[str] = []
    for name, d in info.items():
        if name in used:
            continue
        e = d["ext"]
        if e[long_axis] > 0.7 * overall_ext[long_axis] and 0.8 <= e[up_axis] <= 2.5:
            substrate_names.append(name)
            used.add(name)

    # 5. SILKSCREEN — bodies less than 0.1 mm thick whose bottom face sits at
    #    (or just above) the substrate top, and whose XZ centre falls inside
    #    the substrate footprint. Real silkscreen ink films are ~0.025 mm so
    #    the thickness window is the most discriminating cue — anything thicker
    #    is either a chip body, switch, or capacitor and belongs in COMPONENT.
    #
    #    Earlier versions of this rule required the body to span >50% of the
    #    board long axis, which only caught full-width stripes and missed every
    #    small element (wordmark, key labels, ref-des text) — those ended up
    #    in COMPONENT and rendered nearly-black against the soldermask.
    substrate_top_y = None
    sub_x_min = sub_x_max = sub_z_min = sub_z_max = None
    if substrate_names:
        substrate_top_y = max(info[n]["bb_max"][up_axis] for n in substrate_names)
        sub_x_min = min(info[n]["bb_min"][other_axis] for n in substrate_names)
        sub_x_max = max(info[n]["bb_max"][other_axis] for n in substrate_names)
        sub_z_min = min(info[n]["bb_min"][long_axis] for n in substrate_names)
        sub_z_max = max(info[n]["bb_max"][long_axis] for n in substrate_names)
    silkscreen_names: List[str] = []
    if substrate_top_y is not None:
        for name, d in info.items():
            if name in used:
                continue
            e = d["ext"]
            c = d["center"]
            bottom_y = d["bb_min"][up_axis]
            # Thin film, bottom touching substrate top, centre on the board.
            if (
                e[up_axis] < 0.1
                and abs(bottom_y - substrate_top_y) < 0.05
                and sub_x_min <= c[other_axis] <= sub_x_max
                and sub_z_min <= c[long_axis] <= sub_z_max
            ):
                silkscreen_names.append(name)
                used.add(name)

    # 6. USB-C CONNECTOR — body at one Z edge with ~8–12 mm × 3 mm × 7 mm
    #    extents. Coloured stainless steel silver.
    metal_names: List[str] = []
    z_extremes = (overall_min[long_axis], overall_max[long_axis])
    for name, d in info.items():
        if name in used:
            continue
        e = d["ext"]
        c = d["center"]
        near_edge = min(abs(c[long_axis] - z_extremes[0]), abs(c[long_axis] - z_extremes[1])) < 8.0
        if not near_edge:
            continue
        if 6.0 <= e[other_axis] <= 14.0 and 1.5 <= e[up_axis] <= 5.0 and 5.0 <= e[long_axis] <= 10.0:
            metal_names.append(name)
            used.add(name)

    # 5. Everything else → COMPONENT
    rename: Dict[str, str] = {}
    for i, n in enumerate(case_names):
        rename[n] = f"CASE_{i}" if len(case_names) > 1 else "CASE"
    for i, n in enumerate(keycap_names):
        rename[n] = f"KEYCAP_{i}"
    for i, n in enumerate(screw_names):
        rename[n] = f"SCREW_{i}"
    for i, n in enumerate(substrate_names):
        rename[n] = f"SUBSTRATE_{i}"
    for i, n in enumerate(silkscreen_names):
        rename[n] = f"SILKSCREEN_{i}"
    for i, n in enumerate(metal_names):
        rename[n] = f"METAL_{i}"
    component_idx = 0
    for name, _ in meshes:
        if name not in rename:
            rename[name] = f"COMPONENT_{component_idx:04d}"
            component_idx += 1
    return rename, up_axis


# ──────────────────────────────────────────────────────────────────────────
# PBR + pose + animation (same shape as cad-to-glb.py)
# ──────────────────────────────────────────────────────────────────────────


def apply_pbr(scene: trimesh.Scene) -> None:
    for name, geom in scene.geometry.items():
        role = role_of_node(name)
        cfg = ROLE_DEFAULTS[role]
        rgba = tuple(c / 255.0 for c in cfg["color"])
        try:
            geom.visual = TextureVisuals(
                material=PBRMaterial(
                    name=name,  # per-mesh material so each keycap can recolour
                    baseColorFactor=rgba,
                    metallicFactor=cfg["metallic"],
                    roughnessFactor=cfg["roughness"],
                )
            )
        except Exception as e:
            print(f"[warn] PBR failed on {name}: {e}")


def normalize_pose(scene: trimesh.Scene, target_longest_m: float = 0.18) -> None:
    b = scene.bounds
    centre = (b[0] + b[1]) / 2
    scene.apply_translation(-centre)
    longest = float(np.max(scene.extents))
    if longest > 0:
        scene.apply_scale(target_longest_m / longest)


def compute_explode_offsets(scene: trimesh.Scene) -> Dict[str, Tuple[float, float, float]]:
    """Symmetric explode so the assembly visibly *opens around the PCB*:

      keycaps     ── float well above the case top
      case top    ── lift up (away from PCB)
      PCB         ── hold near the centre
      case bottom ── drop down (away from PCB, mirror of top)
      components  ── drop further so the internals are visible
    """
    extents = scene.extents
    up_axis = int(np.argmin(extents))
    long_axis = int(np.argmax(extents))
    other_axis = [a for a in (0, 1, 2) if a not in (up_axis, long_axis)][0]
    thickness = float(extents[up_axis])

    # The PCB up-axis centre is our reference plane. Anything ABOVE it goes
    # up; anything BELOW it goes down. This keeps the explode symmetric and
    # avoids the bug where both case halves drifted up while the PCB stayed
    # put — making them look offset in perspective.
    # PCB pivot = average up-axis centre of all PCB_PART_* nodes.
    # Everything above the pivot floats up, below drops down.
    pcb_centers = [
        (g.bounds[0][up_axis] + g.bounds[1][up_axis]) / 2
        for n, g in scene.geometry.items()
        if n.startswith("PCB_PART") or n.startswith("PCB_TOP") or n.startswith("PCB_BODY") or n == "PCB"
    ]
    pivot = float(np.mean(pcb_centers)) if pcb_centers else 0.0

    # Symmetric explode: top case lifts, bottom case drops, keycaps fly up,
    # screws move outward + up. Substrate / silkscreen / metal / components
    # stay put so the explode reads as a clamshell opening around the board.
    substrate_y_values = [
        (g.bounds[0][up_axis] + g.bounds[1][up_axis]) / 2
        for n, g in scene.geometry.items()
        if n.startswith("SUBSTRATE")
    ]
    pivot = float(np.mean(substrate_y_values)) if substrate_y_values else 0.0

    offsets: Dict[str, Tuple[float, float, float]] = {}
    for name, geom in scene.geometry.items():
        role = role_of_node(name)
        c = (geom.bounds[0] + geom.bounds[1]) / 2
        side = 1.0 if c[up_axis] >= pivot else -1.0
        t = [0.0, 0.0, 0.0]
        if role == "KEYCAP":
            t[up_axis] = thickness * 1.6
        elif role == "SCREW":
            sign_o = 1.0 if c[other_axis] >= 0 else -1.0
            sign_l = 1.0 if c[long_axis] >= 0 else -1.0
            t[other_axis] = sign_o * thickness * 0.6
            t[long_axis] = sign_l * thickness * 0.6
            t[up_axis] = thickness * 2.0
        elif role == "CASE":
            t[up_axis] = side * thickness * 0.9
        offsets[name] = tuple(t)
    return offsets


def _append_buffer(gltf: GLTF2, raw: bytes) -> int:
    buffer = gltf.buffers[0]
    blob = gltf.binary_blob() or b""
    offset = len(blob)
    new_blob = blob + raw
    pad = (-len(new_blob)) % 4
    if pad:
        new_blob += b"\x00" * pad
    gltf.set_binary_blob(new_blob)
    buffer.byteLength = len(new_blob)
    return offset


def bake_explode(glb_path: str, offsets: Dict[str, Tuple[float, float, float]], duration_s: float = 1.0) -> None:
    gltf = GLTF2().load(glb_path)
    name_to_idx: Dict[str, int] = {}
    for i, node in enumerate(gltf.nodes):
        if node.name:
            name_to_idx[node.name] = i

    times = np.array([0.0, duration_s], dtype=np.float32).tobytes()
    times_offset = _append_buffer(gltf, times)
    times_bv = BufferView(buffer=0, byteOffset=times_offset, byteLength=len(times))
    gltf.bufferViews.append(times_bv)
    times_bv_idx = len(gltf.bufferViews) - 1
    times_acc = Accessor(
        bufferView=times_bv_idx, componentType=5126, count=2,
        type="SCALAR", min=[0.0], max=[float(duration_s)],
    )
    gltf.accessors.append(times_acc)
    times_acc_idx = len(gltf.accessors) - 1

    samplers: List[AnimationSampler] = []
    channels: List[AnimationChannel] = []
    for name, offset in offsets.items():
        if name not in name_to_idx:
            continue
        if all(v == 0.0 for v in offset):
            continue
        out = np.array([0.0, 0.0, 0.0, *offset], dtype=np.float32).tobytes()
        out_offset = _append_buffer(gltf, out)
        out_bv = BufferView(buffer=0, byteOffset=out_offset, byteLength=len(out))
        gltf.bufferViews.append(out_bv)
        out_bv_idx = len(gltf.bufferViews) - 1
        out_acc = Accessor(
            bufferView=out_bv_idx, componentType=5126, count=2,
            type="VEC3",
            min=[min(0.0, offset[0]), min(0.0, offset[1]), min(0.0, offset[2])],
            max=[max(0.0, offset[0]), max(0.0, offset[1]), max(0.0, offset[2])],
        )
        gltf.accessors.append(out_acc)
        out_acc_idx = len(gltf.accessors) - 1
        samplers.append(AnimationSampler(input=times_acc_idx, output=out_acc_idx, interpolation="LINEAR"))
        sampler_idx = len(samplers) - 1
        target = AnimationChannelTarget(node=name_to_idx[name], path="translation")
        channels.append(AnimationChannel(sampler=sampler_idx, target=target))

    if channels:
        gltf.animations.append(Animation(name="explode", channels=channels, samplers=samplers))
        gltf.save(glb_path)
        print(f"[anim] baked 'explode' with {len(channels)} channels")


# ──────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────


def main():
    if len(sys.argv) < 3:
        print("usage: step-to-glb.py INPUT.step OUT_DIR")
        sys.exit(2)
    src, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    print("[step] reading...")
    reader = STEPControl_Reader()
    status = reader.ReadFile(src)
    if status != IFSelect_RetDone:
        raise IOError(f"ReadFile failed: {status}")
    reader.TransferRoots()
    top = reader.OneShape()
    print("[step] transferred")

    solid_meshes: List[Tuple[str, trimesh.Trimesh]] = []
    exp = TopExp_Explorer(top, TopAbs_SOLID)
    idx = 0
    while exp.More():
        idx += 1
        solid = exp.Current()
        m = tessellate_solid(solid, linear_deflection=0.15)
        if m is not None and len(m.faces) > 0:
            solid_meshes.append((f"solid_{idx:04d}", m))
        exp.Next()
    print(f"[tess] tessellated {len(solid_meshes)} solids")

    rename, up_axis = classify(solid_meshes)
    counts: Dict[str, int] = {}
    for n in rename.values():
        r = role_of_node(n)
        counts[r] = counts.get(r, 0) + 1
    print(f"[classify] role counts: {counts} (up_axis={up_axis})")

    # Build the scene with role-tagged node names. Each mesh keeps its
    # original CAD position; the role prefix drives both the runtime
    # configurator colour-swap and the baked explode animation.
    #
    # Silkscreen meshes sit *exactly* on the substrate top in the source
    # STEP, which causes the renderer to z-fight them out of visibility.
    # We nudge them up by 0.1 mm along the up axis (units are still mm
    # before normalize_pose) so they render cleanly above the soldermask
    # without being visibly raised.
    silkscreen_lift_mm = 0.1
    scene = trimesh.Scene()
    for old, mesh in solid_meshes:
        node = rename[old]
        if role_of_node(node) == "SILKSCREEN":
            offset = [0.0, 0.0, 0.0]
            offset[up_axis] = silkscreen_lift_mm
            mesh.apply_translation(offset)
        scene.add_geometry(mesh, node_name=node, geom_name=node)

    apply_pbr(scene)
    normalize_pose(scene)
    print(f"[normalize] extents (m): {scene.extents.tolist()}")

    offsets = compute_explode_offsets(scene)
    out_path = os.path.join(out_dir, "sudo-macropad.glb")
    scene.export(out_path)
    print(f"[export] wrote {out_path} ({os.path.getsize(out_path)} bytes)")
    bake_explode(out_path, offsets)
    print(f"[done] final size: {os.path.getsize(out_path)} bytes")


if __name__ == "__main__":
    main()
