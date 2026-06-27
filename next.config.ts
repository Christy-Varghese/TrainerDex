import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Service worker and manifest must never be served stale — browsers cache SW
  // files aggressively, so we force no-cache so updates land immediately.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type",  value: "application/javascript; charset=utf-8" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Content-Type",  value: "application/manifest+json" },
        ],
      },
    ];
  },
  images: {
    // Remote sprite / event-art hosts. Sprites are tiny pixel-art icons served
    // straight from these mirrors, so we skip the optimizer (`unoptimized` is
    // set per-<Image> via SpriteImage) and just allow-list the origins.
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "pokemongolive.com" },
      { protocol: "https", hostname: "www.pokemongolive.com" },
      { protocol: "https", hostname: "assets.pokemon.com" },
      { protocol: "https", hostname: "raw.pokecoders.com" },
      { protocol: "https", hostname: "img.pokemondb.net" },
      { protocol: "https", hostname: "images.weserv.nl" },
      { protocol: "https", hostname: "leekduck.com" },
      { protocol: "https", hostname: "www.leekduck.com" },
      { protocol: "https", hostname: "cdn.leekduck.com" },
    ],
  },
};

export default nextConfig;
