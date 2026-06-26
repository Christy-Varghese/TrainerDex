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
    eventID: "skarmory-super-mega-raid-day-2026",
    name: "Skarmory Super Mega Raid Day",
    eventType: "raid-day",
    heading: "Super Mega Raid Day",
    link: "https://pokemongolive.com/",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm227.icon.png",
    start: "2026-06-27T14:00:00",
    end: "2026-06-27T17:00:00",
    extraData: {
      raidbattles: {
        bosses: [],
      },
    },
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
    eventID: "pokemon-go-fest-2026-global",
    name: "Pokémon GO Fest 2026: Global",
    eventType: "pokemon-go-fest",
    heading: "GO Fest 2026",
    link: "https://pokemongo.com/gofest/global",
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm150.fMEGA_X.icon.png",
    start: "2026-07-11T10:00:00",
    end: "2026-07-12T19:00:00",
    extraData: {
      raidbattles: {
        bosses: [
          { name: "Mega Mewtwo X", tier: "Super Mega", canBeShiny: false },
          { name: "Mega Mewtwo Y", tier: "Super Mega", canBeShiny: false },
          { name: "Articuno", tier: "5★", canBeShiny: true },
          { name: "Zapdos", tier: "5★", canBeShiny: true },
          { name: "Moltres", tier: "5★", canBeShiny: true },
          { name: "Raikou", tier: "5★", canBeShiny: true },
          { name: "Entei", tier: "5★", canBeShiny: true },
          { name: "Suicune", tier: "5★", canBeShiny: true },
          { name: "Lugia", tier: "5★", canBeShiny: true },
          { name: "Ho-Oh", tier: "5★", canBeShiny: true },
          { name: "Kyogre", tier: "5★", canBeShiny: true },
          { name: "Groudon", tier: "5★", canBeShiny: true },
          { name: "Rayquaza", tier: "5★", canBeShiny: true },
          { name: "Dialga", tier: "5★", canBeShiny: true },
          { name: "Palkia", tier: "5★", canBeShiny: true },
          { name: "Reshiram", tier: "5★", canBeShiny: true },
          { name: "Zekrom", tier: "5★", canBeShiny: true },
          { name: "Kyurem", tier: "5★", canBeShiny: true },
          { name: "Xerneas", tier: "5★", canBeShiny: true },
          { name: "Yveltal", tier: "5★", canBeShiny: true },
          { name: "Solgaleo", tier: "5★", canBeShiny: true },
          { name: "Lunala", tier: "5★", canBeShiny: true },
          { name: "Giratina (Altered)", tier: "5★", canBeShiny: true },
          { name: "Giratina (Origin)", tier: "5★", canBeShiny: true },
          { name: "Regirock", tier: "5★", canBeShiny: true },
          { name: "Regice", tier: "5★", canBeShiny: true },
          { name: "Registeel", tier: "5★", canBeShiny: true },
          { name: "Latias", tier: "5★", canBeShiny: true },
          { name: "Latios", tier: "5★", canBeShiny: true },
          { name: "Heatran", tier: "5★", canBeShiny: true },
          { name: "Cresselia", tier: "5★", canBeShiny: true },
          { name: "Darkrai", tier: "5★", canBeShiny: true },
          { name: "Cobalion", tier: "5★", canBeShiny: true },
          { name: "Terrakion", tier: "5★", canBeShiny: true },
          { name: "Virizion", tier: "5★", canBeShiny: true },
          { name: "Regieleki", tier: "5★", canBeShiny: true },
          { name: "Regidrago", tier: "5★", canBeShiny: true },
          { name: "Zacian", tier: "5★", canBeShiny: true },
          { name: "Zamazenta", tier: "5★", canBeShiny: true },
          { name: "Mega Ampharos", tier: "Mega", canBeShiny: true },
          { name: "Mega Blaziken", tier: "Mega", canBeShiny: true },
          { name: "Mega Gengar", tier: "Mega", canBeShiny: true },
          { name: "Mega Salamence", tier: "Mega", canBeShiny: true },
          { name: "Mega Metagross", tier: "Mega", canBeShiny: true },
          { name: "Mega Garchomp", tier: "Mega", canBeShiny: true },
          { name: "Mega Tyranitar", tier: "Mega", canBeShiny: true },
          { name: "Mega Gardevoir", tier: "Mega", canBeShiny: true },
          { name: "Mega Lucario", tier: "Mega", canBeShiny: true },
        ],
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
