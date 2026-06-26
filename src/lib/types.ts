// Event schema mirrors the public ScrapedDuck / Leek Duck `events.json` feed
// (https://github.com/bigfoott/ScrapedDuck). Keeping the same shape means
// swapping the seed data for the live feed later is a one-line change.

// String values mirror the real ScrapedDuck `eventType` field exactly (verified
// against the live feed). The `(string & {})` member keeps autocomplete for the
// known set while letting any future feed value flow through unbroken — unknown
// types render with a neutral fallback badge instead of crashing the filter bar.
export type EventType =
  | "community-day"
  | "pokemon-spotlight-hour"
  | "raid-hour"
  | "raid-battles"
  | "raid-day"
  | "max-mondays"
  | "choose-your-path"
  | "go-pass"
  | "pokemon-go-fest"
  | "research"
  | "research-breakthrough"
  | "go-battle-league"
  | "event"
  | "season"
  | "ticketed-event"
  | "live-event"
  | (string & {});

export interface SpotlightExtra {
  name: string;
  canBeShiny: boolean;
  image?: string;
  bonus: string;
  /** Some Spotlight Hours rotate several featured Pokémon. */
  list?: { name: string; canBeShiny: boolean; image?: string }[];
}

export interface RaidBoss {
  name: string;
  tier: string;
  canBeShiny: boolean;
  image?: string;
}

export interface EventExtraData {
  spotlight?: SpotlightExtra;
  raidbattles?: { bosses: RaidBoss[]; shinies?: string[] };
  communityday?: {
    spawns?: { name: string; image?: string }[];
    bonuses?: { text: string }[];
    featuredMove?: string;
  };
}

export interface PogoEvent {
  eventID: string;
  name: string;
  eventType: EventType;
  heading: string;
  link: string;
  image: string;
  /** Local-naive ISO string, e.g. "2026-06-25T18:00:00" — interpreted in the trainer's local time. */
  start: string;
  /** Local-naive ISO string. */
  end: string;
  extraData?: EventExtraData | null;
}
