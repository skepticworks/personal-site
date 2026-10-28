import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const dynamic = "force-static";
export const alt = `${siteConfig.name} — ${siteConfig.jobTitle}`;
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
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(155deg, #0b1a24 0%, #143044 48%, #1d4654 100%)",
          color: "#f3f6f8",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 920,
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(243,246,248,0.72)",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Personal workspace
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: "rgba(236,242,247,0.86)",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              maxWidth: 880,
            }}
          >
            {siteConfig.description}
          </div>
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(232,194,122,0.95)",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          tylermatthews.dev
        </div>
      </div>
    ),
    size,
  );
}
