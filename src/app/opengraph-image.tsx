import { ImageResponse } from "next/og";

import { site } from "@/lib/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#ff7700",
            }}
          />
          <span style={{ fontSize: 32, color: "#ffffff", fontWeight: 600 }}>
            {site.name}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 64,
              color: "#ffffff",
              fontWeight: 600,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            {site.tagline}
          </span>
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.65)", maxWidth: 900 }}>
            {site.description}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
