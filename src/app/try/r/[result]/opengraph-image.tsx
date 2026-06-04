import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { decodeResult, headline, formatDamage, TITLES } from "@/lib/gauntlet";

export const runtime = "nodejs";
export const alt = "the sudo carnage report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { result: string };
}

export default async function CarnageOgImage({ params }: Props) {
  const pixelFont = await fs.readFile(
    path.join(process.cwd(), "src/app/fonts/PixelatedEleganceRegular-ovawB.ttf"),
  );
  const r =
    decodeResult(params.result) ??
    { approved: 0, denied: 0, improved: 0, yolod: 0, damage: 0, title: 0 };
  const h = headline(r);
  const title = TITLES[r.title];

  const stat = (label: string, value: string | number, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 22, color: "#8a8a8a" }}>{label}</span>
      <span style={{ fontSize: 40, color, fontWeight: 800 }}>{value}</span>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "#f2f2f2",
          display: "flex",
          padding: 52,
          fontFamily: "pixel",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #222",
            borderRadius: 34,
            background: "#141414",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* terminal title bar */}
          <div
            style={{
              height: 56,
              borderBottom: "1px solid #222",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "0 24px",
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 999, background: "#A82D20" }} />
            <span style={{ width: 14, height: 14, borderRadius: 999, background: "#B58A17" }} />
            <span style={{ width: 14, height: 14, borderRadius: 999, background: "#2F7C53" }} />
            <span style={{ marginLeft: 12, color: "#8a8a8a", fontSize: 22 }}>
              ~/agent — the carnage report
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 44, gap: 18 }}>
            <div style={{ color: "#2ea468", fontSize: 40, display: "flex" }}>[sudo]</div>
            <div
              style={{
                fontSize: 56,
                lineHeight: 1.16,
                letterSpacing: "-0.02em",
                fontWeight: 800,
                display: "flex",
                maxWidth: 1000,
              }}
            >
              {h}
            </div>
            <div style={{ fontSize: 28, color: "#8a8a8a", display: "flex" }}>
              the agent is now {title}.
            </div>

            <div style={{ marginTop: "auto", display: "flex", gap: 56, alignItems: "flex-end" }}>
              {stat("damage", formatDamage(r.damage), "#E0604F")}
              {stat("approved", r.approved, "#3FA66F")}
              {stat("rejected", r.denied, "#E0604F")}
              {stat("yolo’d", r.yolod, "#f2f2f2")}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "pixel", data: pixelFont, weight: 400, style: "normal" }],
    },
  );
}
