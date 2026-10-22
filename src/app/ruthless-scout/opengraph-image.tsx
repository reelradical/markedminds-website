import { ImageResponse } from "next/og";

export const alt = "Ruthless Scout by Marked Minds — Your next move should fit your life.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#171717", color: "#F5F0E8", padding: "64px 72px", fontFamily: "sans-serif", borderTop: "12px solid #FF7700" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22, letterSpacing: 4 }}>
        <span>MARKED MINDS</span>
        <span style={{ color: "#FF7700", fontSize: 18 }}>CAREER INTELLIGENCE</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>Ruthless Scout</div>
        <div style={{ display: "flex", width: 100, height: 8, background: "#FF7700", marginTop: 30, marginBottom: 30 }} />
        <div style={{ display: "flex", fontSize: 42, lineHeight: 1.2 }}>Your next move should fit your life.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #44403C", paddingTop: 24, fontSize: 22, color: "#C6C0B8" }}>
        <span>Fit. Evidence. Opportunity.</span>
        <span>markedminds.com/ruthless-scout</span>
      </div>
    </div>,
    size,
  );
}
