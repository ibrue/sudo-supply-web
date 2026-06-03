import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { decodeResult, HEADLINES } from "@/lib/gauntlet";

export const runtime = "nodejs";
export const alt = "[sudo] permission gauntlet result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { result: string };
}

export default async function GauntletOgImage({ params }: Props) {
  const pixelFont = await fs.readFile(
    path.join(process.cwd(), "src/app/fonts/PixelatedEleganceRegular-ovawB.ttf"),
  );
  const result = decodeResult(params.result) ?? {
    score: 0,
    approve: 0,
    reject: 0,
    better: 0,
    yolo: 0,
    headline: 1,
  };
  const headline = HEADLINES[result.headline];

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
          padding: 56,
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
              permission-gauntlet/results
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", padding: 42, gap: 44, alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#2ea468", fontSize: 54, display: "flex" }}>[sudo]</div>
              <div
                style={{
                  marginTop: 28,
                  fontSize: 58,
                  lineHeight: 1.18,
                  letterSpacing: "-0.02em",
                  fontWeight: 800,
                  display: "flex",
                }}
              >
                {headline}
              </div>
              <div style={{ marginTop: 28, color: "#8a8a8a", fontSize: 26, display: "flex" }}>
                approve / reject / make it better / yolo
              </div>
            </div>
            <div
              style={{
                width: 270,
                height: 270,
                borderRadius: 32,
                border: "1px solid #222",
                background: "#0a0a0a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 116, lineHeight: 1, fontWeight: 900, color: "#2ea468", display: "flex" }}>
                {result.score}
              </div>
              <div style={{ fontSize: 28, color: "#8a8a8a", display: "flex" }}>/100</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "pixel", data: pixelFont, weight: 400, style: "normal" },
      ],
    },
  );
}
