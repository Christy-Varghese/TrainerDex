import type { PogoEvent } from "./types";

// Seed/fallback dataset. Used when the live feed is unreachable (and during
// local dev so the site renders without network). Dates are local-naive ISO
// strings — they render in the trainer's own timezone, matching how Pokémon GO
// schedules Spotlight Hours, Raid Hours, etc. at 6pm *local* time.
//
// Replace with the live ScrapedDuck feed in lib/events.ts when ready.
export const SEED_EVENTS: PogoEvent[] = [
  {
    eventID: "spotlight-2026-06-25",
    name: "Magikarp Spotlight Hour",
    eventType: "spotlight-hour",
    heading: "Spotlight Hour",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm129.icon.png",
    start: "2026-06-25T18:00:00",
    end: "2026-06-25T19:00:00",
    extraData: {
      spotlight: {
        name: "Magikarp",
        canBeShiny: true,
        bonus: "2× Catch Candy",
      },
    },
  },
  {
    eventID: "raid-hour-2026-06-25",
    name: "Mega Rayquaza Raid Hour",
    eventType: "raid-hour",
    heading: "Raid Hour",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm384.icon.png",
    start: "2026-06-25T18:00:00",
    end: "2026-06-25T19:00:00",
    extraData: {
      raidbattles: {
        bosses: [{ name: "Mega Rayquaza", tier: "Mega", canBeShiny: true }],
      },
    },
  },
  {
    eventID: "research-breakthrough-2026-06",
    name: "Research Breakthrough: Galarian Articuno",
    eventType: "research-breakthrough",
    heading: "Research Breakthrough",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm144.fGALARIAN.icon.png",
    start: "2026-06-01T00:00:00",
    end: "2026-06-30T23:59:59",
    extraData: null,
  },
  {
    eventID: "raid-battles-2026-06-22",
    name: "Five-Star Raids: Zacian",
    eventType: "raid-battles",
    heading: "5★ Raids",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm888.icon.png",
    start: "2026-06-22T10:00:00",
    end: "2026-06-29T10:00:00",
    extraData: {
      raidbattles: {
        bosses: [{ name: "Zacian (Hero of Many Battles)", tier: "5★", canBeShiny: true }],
      },
    },
  },
  {
    eventID: "event-2026-06-solstice",
    name: "Solstice Horizons",
    eventType: "event",
    heading: "Seasonal Event",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm250.icon.png",
    start: "2026-06-21T10:00:00",
    end: "2026-06-27T20:00:00",
    extraData: null,
  },
  {
    eventID: "community-day-2026-07-04",
    name: "Community Day: Dratini",
    eventType: "community-day",
    heading: "Community Day",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm147.icon.png",
    start: "2026-07-04T14:00:00",
    end: "2026-07-04T17:00:00",
    extraData: {
      communityday: {
        spawns: [{ name: "Dratini" }],
        featuredMove: "Draco Meteor (Dragonite)",
        bonuses: [{ text: "3× Catch XP" }, { text: "2-hour Lure & Incense" }],
      },
    },
  },
  {
    eventID: "anniversary-2026-07-06",
    name: "Pokémon GO 10th Anniversary Party",
    eventType: "live-event",
    heading: "10th Anniversary",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm25.fPARTY.icon.png",
    start: "2026-07-06T10:00:00",
    end: "2026-07-12T20:00:00",
    extraData: null,
  },
  {
    eventID: "season-2026-summer",
    name: "Season: Might & Mastery",
    eventType: "season",
    heading: "Current Season",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm383.icon.png",
    start: "2026-06-03T10:00:00",
    end: "2026-09-02T10:00:00",
    extraData: null,
  },
];
