import type { EventType } from "./types";

// Approximate shiny encounter rates by context. Niantic never publishes exact
// numbers; these are the community-datamined consensus rates (Silph Research /
// The Silph Road). Always shown as "approximate" so trainers know they're
// estimates, not official figures.
export interface ShinyOdds {
  ratio: string; // e.g. "1 in 25"
  label: string; // short context
  approx: true;
}

const ODDS = {
  communityDay: { ratio: "1 in 25", label: "Community Day boosted" },
  raidBoosted: { ratio: "1 in 64", label: "raid encounter" },
  legendaryRaid: { ratio: "1 in 20", label: "Legendary raid" },
  wildBoosted: { ratio: "1 in 64", label: "event-boosted wild" },
  wild: { ratio: "1 in 500", label: "standard wild" },
} as const;

/**
 * Best-guess shiny rate for a Pokémon encountered in a given event type.
 * Returns undefined when the Pokémon can't be shiny.
 */
export function shinyOddsFor(eventType: EventType, canBeShiny: boolean): ShinyOdds | undefined {
  if (!canBeShiny) return undefined;
  const t = eventType;
  let base: { ratio: string; label: string };
  if (t === "community-day") base = ODDS.communityDay;
  else if (t === "raid-day" || t === "raid-hour" || t === "raid-battles") base = ODDS.raidBoosted;
  else if (t === "pokemon-spotlight-hour") base = ODDS.wild; // spotlight doesn't boost shiny
  else if (t.includes("event") || t === "max-mondays" || t === "choose-your-path") base = ODDS.wildBoosted;
  else base = ODDS.wild;
  return { ...base, approx: true };
}
