import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

// Conventional Next 14 route. The framework serves this rendered JPEG at
// `/opengraph-image` and emits the matching <meta property="og:image">
// tags automatically, so social scrapers (Slack, iMessage, Twitter, etc.)
// pick it up without any explicit URL wiring.

export const runtime = "nodejs";
export const alt = "sudo.supply — open-source macro pads for AI agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  // Re-use the same pixel font the site uses for the [sudo] mark so the
  // preview reads as the brand, not generic Helvetica.
  const pixelFont = await fs.readFile(
    path.join(process.cwd(), "src/app/fonts/PixelatedEleganceRegular-ovawB.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          // Subtle dotted-grid to match the site's surface texture.
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "pixel",
          color: "#f2f2f2",
        }}
      >
        <div
          style={{
            fontSize: 260,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          [sudo]
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 36,
            color: "#2ea468",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          sudo.supply
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#8a8a8a",
            display: "flex",
          }}
        >
          open hardware. open source. open API.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "pixel",
          data: pixelFont,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
