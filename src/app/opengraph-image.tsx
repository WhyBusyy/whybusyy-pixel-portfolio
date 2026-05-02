import { ImageResponse } from "next/og";

export const alt = "WhyBusyy · Pixel Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0e0e1a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(#1f1f33 1px, transparent 1px), linear-gradient(90deg, #1f1f33 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
        />

        {/* Top dots */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 32,
            zIndex: 1,
          }}
        >
          <div style={{ width: 16, height: 16, background: "#ff5566" }} />
          <div style={{ width: 16, height: 16, background: "#ffd06b" }} />
          <div style={{ width: 16, height: 16, background: "#88ddff" }} />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "white",
            letterSpacing: -2,
            zIndex: 1,
            marginBottom: 8,
          }}
        >
          WhyBusyy
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: "#88ddff",
            letterSpacing: 6,
            zIndex: 1,
            marginBottom: 48,
          }}
        >
          PIXEL PORTFOLIO
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#888899",
            zIndex: 1,
          }}
        >
          Fullstack Developer · Frontend 중심
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 60,
            display: "flex",
            gap: 12,
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              background: "#1f1f33",
              border: "1px solid #2a2a3e",
              color: "#88ddff",
              fontSize: 18,
            }}
          >
            Next.js
          </div>
          <div
            style={{
              padding: "8px 16px",
              background: "#1f1f33",
              border: "1px solid #2a2a3e",
              color: "#88ddff",
              fontSize: 18,
            }}
          >
            Phaser 4
          </div>
          <div
            style={{
              padding: "8px 16px",
              background: "#1f1f33",
              border: "1px solid #2a2a3e",
              color: "#88ddff",
              fontSize: 18,
            }}
          >
            TypeScript
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
