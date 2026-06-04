import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { decodeRoll, INCIDENTS, formatDamage } from "@/lib/incidents";

export const runtime = "nodejs";
export const alt = "a leaked AI agent incident report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { id: string };
}

const SEV_COLOR: Record<number, string> = { 1: "#E0604F", 2: "#E3C04A", 3: "#2ea468" };

export default async function IncidentOgImage({ params }: Props) {
  const pixelFont = await fs.readFile(
    path.join(process.cwd(), "src/app/fonts/PixelatedEleganceRegular-ovawB.ttf"),
  );
  const r = decodeRoll(params.id) ?? { incident: 0, inc: 1234, damage: 480000, factor: 0 };
  const i = INCIDENTS[r.incident];
  const sevColor = SEV_COLOR[i.sev];

  const field = (label: string, body: React.ReactNode, color = "#cfcfcf") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ color: "#2ea468", fontSize: 20, letterSpacing: 2 }}>{label}</span>
      <span style={{ color, fontSize: 27, lineHeight: 1.32 }}>{body}</span>
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
          padding: 48,
          fontFamily: "pixel",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #222",
            borderRadius: 30,
            background: "#141414",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* title bar */}
          <div
            style={{
              height: 54,
              borderBottom: "1px solid #222",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "0 22px",
            }}
          >
            <span style={{ width: 13, height: 13, borderRadius: 999, background: "#A82D20" }} />
            <span style={{ width: 13, height: 13, borderRadius: 999, background: "#B58A17" }} />
            <span style={{ width: 13, height: 13, borderRadius: 999, background: "#2F7C53" }} />
            <span style={{ marginLeft: 12, color: "#8a8a8a", fontSize: 20 }}>
              ~/incidents/INC-{r.inc}
            </span>
            <span style={{ marginLeft: "auto", color: "#2ea468", fontSize: 22 }}>[sudo]</span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 40, gap: 22 }}>
            {/* header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 800 }}>INCIDENT POSTMORTEM</span>
              <span
                style={{
                  fontSize: 22,
                  color: sevColor,
                  border: `1px solid ${sevColor}`,
                  borderRadius: 8,
                  padding: "2px 12px",
                }}
              >
                SEV-{i.sev}
              </span>
            </div>

            {field("root cause", i.rootCause, "#f2f2f2")}

            <div style={{ display: "flex", gap: 48, marginTop: "auto", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ color: "#2ea468", fontSize: 20, letterSpacing: 2 }}>total damage</span>
                <span style={{ color: "#E0604F", fontSize: 52, fontWeight: 900 }}>
                  {formatDamage(r.damage)}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <span style={{ color: "#2ea468", fontSize: 20, letterSpacing: 2 }}>
                  the agent is now
                </span>
                <span style={{ color: "#f2f2f2", fontSize: 30 }}>{i.agentBecame}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "pixel", data: pixelFont, weight: 400, style: "normal" }] },
  );
}
