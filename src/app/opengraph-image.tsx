import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = `${site.name} - ${site.role}`;

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px",
        background: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 25% 20%, rgba(99,102,241,0.22), transparent 50%)",
        color: "#fafafa",
      }}>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#a1a1aa",
          marginBottom: 24,
        }}>
        {site.role}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          maxWidth: 900,
        }}>
        {site.name}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 40,
          fontSize: 26,
          color: "#a1a1aa",
        }}>
        Building fast, accessible web products end to end.
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          display: "flex",
          fontSize: 22,
          color: "#71717a",
        }}>
        {site.url.replace("https://", "")}
      </div>
    </div>,
    { ...size },
  );
}
