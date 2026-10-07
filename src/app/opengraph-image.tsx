import { ImageResponse } from "next/og";

export const alt = "NeuroMirror — Notice patterns in your writing. Reflect over time.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 82px",
          background: "linear-gradient(135deg, #f6f1e7 0%, #e9dfcf 100%)",
          color: "#2a2622",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 740 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, letterSpacing: 1 }}>
            <div style={{ width: 58, height: 58, borderRadius: 16, background: "#2a2622", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 11, height: 25, border: "2px solid #f6f1e7", borderRightWidth: 1, borderRadius: "12px 3px 3px 12px" }} />
                <div style={{ width: 2, height: 29, background: "#c9a26a", borderRadius: 3 }} />
                <div style={{ width: 11, height: 25, border: "2px solid #f6f1e7", borderLeftWidth: 1, borderRadius: "3px 12px 12px 3px" }} />
              </div>
            </div>
            <span>NEUROMIRROR</span>
          </div>
          <div style={{ marginTop: 68, fontSize: 62, fontWeight: 650, lineHeight: 1.06, letterSpacing: -2 }}>
            A private journal for cognitive health reflection.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.35, color: "#665d52" }}>
            Notice patterns in your writing. Reflect over time.
          </div>
        </div>
        <div style={{ width: 210, height: 210, borderRadius: 52, background: "#2a2622", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 96, border: "5px solid #f6f1e7", borderRightWidth: 2, borderRadius: "48px 12px 12px 48px" }} />
            <div style={{ width: 3, height: 112, background: "#c9a26a", borderRadius: 4 }} />
            <div style={{ width: 48, height: 96, border: "5px solid #f6f1e7", borderLeftWidth: 2, borderRadius: "12px 48px 48px 12px" }} />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

