import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrainerDex — Pokémon GO Trainer Hub",
    short_name: "TrainerDex",
    description:
      "All your Pokémon GO info in one place: live events, raid guides, IV references, community days, and more.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0f172a",
    theme_color: "#0ea5e9",
    categories: ["games", "sports"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Live Events",
        short_name: "Events",
        description: "See what's live in Pokémon GO right now",
        url: "/events",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Raid Bosses",
        short_name: "Raids",
        description: "Current raid boss lineup with counters",
        url: "/raids",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Pokédex",
        short_name: "Pokédex",
        description: "Full GO Pokédex with stats, shinies, and PvP ranks",
        url: "/pokemon",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
