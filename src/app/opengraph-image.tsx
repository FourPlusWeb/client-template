import { ImageResponse } from "next/og";
import { siteConfig } from "../../site.config";

export const alt = siteConfig.name;
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: siteConfig.colors.primary,
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 24,
            opacity: 0.85,
            maxWidth: 900,
            textAlign: "center",
            padding: "0 48px",
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
