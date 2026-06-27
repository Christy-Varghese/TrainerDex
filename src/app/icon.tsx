import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
        }}
      >
        <svg
          viewBox="0 0 512 512"
          width="22"
          height="22"
          style={{ display: "block" }}
        >
          <path
            d="M310 64 L148 276 L218 276 L180 448 L372 236 L286 236 Z"
            fill="white"
            fillRule="evenodd"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
