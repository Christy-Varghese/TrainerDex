// Raid bosses + their 100% IV ("hundo") CP, from the public ScrapedDuck / Leek
// Duck `raids.json` feed. The feed already does the hundo math for us:
//   combatPower.normal.max  = CP of a 15/15/15 catch at level 20 (raid/quest)
//   combatPower.boosted.max = CP of a 15/15/15 catch at level 25 (weather boosted)
// So a hundo hunter can memorize the magic CP and know instantly on the catch
// screen whether the encounter is perfect — no third-party IV app needed.

const FEED_URL = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/raids.json";

export interface NamedIcon {
  name: string;
  image?: string;
}

export interface Raid {
  name: string;
  tier: string;
  canBeShiny: boolean;
  types: NamedIcon[];
  combatPower: {
    normal: { min: number; max: number };
    boosted: { min: number; max: number };
  };
  boostedWeather: NamedIcon[];
  image: string;
}

const PM = "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets";

const SEED_RAIDS: Raid[] = [
  // ── 1-Star ──────────────────────────────────────────────────────────────────
  { name: "Swablu", tier: "1-Star Raids", canBeShiny: true, types: [{ name: "Normal" }, { name: "Flying" }], combatPower: { normal: { min: 429, max: 470 }, boosted: { min: 537, max: 588 } }, boostedWeather: [{ name: "Partly Cloudy" }, { name: "Windy" }], image: `${PM}/pm333.icon.png` },
  { name: "Starly", tier: "1-Star Raids", canBeShiny: true, types: [{ name: "Normal" }, { name: "Flying" }], combatPower: { normal: { min: 372, max: 410 }, boosted: { min: 465, max: 513 } }, boostedWeather: [{ name: "Partly Cloudy" }, { name: "Windy" }], image: `${PM}/pm396.icon.png` },
  { name: "Vullaby", tier: "1-Star Raids", canBeShiny: true, types: [{ name: "Dark" }, { name: "Flying" }], combatPower: { normal: { min: 675, max: 726 }, boosted: { min: 844, max: 908 } }, boostedWeather: [{ name: "Fog" }, { name: "Windy" }], image: `${PM}/pm629.icon.png` },
  { name: "Shadow Horsea", tier: "1-Star Raids", canBeShiny: true, types: [{ name: "Water" }], combatPower: { normal: { min: 522, max: 603 }, boosted: { min: 653, max: 754 } }, boostedWeather: [{ name: "Rain" }], image: `${PM}/pm116.fSHADOW.icon.png` },
  { name: "Shadow Porygon", tier: "1-Star Raids", canBeShiny: true, types: [{ name: "Normal" }], combatPower: { normal: { min: 879, max: 982 }, boosted: { min: 1098, max: 1228 } }, boostedWeather: [{ name: "Partly Cloudy" }], image: `${PM}/pm137.fSHADOW.icon.png` },
  { name: "Shadow Beldum", tier: "1-Star Raids", canBeShiny: true, types: [{ name: "Steel" }, { name: "Psychic" }], combatPower: { normal: { min: 480, max: 558 }, boosted: { min: 600, max: 697 } }, boostedWeather: [{ name: "Snow" }, { name: "Windy" }], image: `${PM}/pm374.fSHADOW.icon.png` },
  { name: "Shadow Golett", tier: "1-Star Raids", canBeShiny: true, types: [{ name: "Ground" }, { name: "Ghost" }], combatPower: { normal: { min: 592, max: 679 }, boosted: { min: 740, max: 849 } }, boostedWeather: [{ name: "Sunny" }, { name: "Fog" }], image: `${PM}/pm622.fSHADOW.icon.png` },
  // ── 3-Star ──────────────────────────────────────────────────────────────────
  { name: "Hisuian Braviary", tier: "3-Star Raids", canBeShiny: true, types: [{ name: "Psychic" }, { name: "Flying" }], combatPower: { normal: { min: 1531, max: 1608 }, boosted: { min: 1914, max: 2010 } }, boostedWeather: [{ name: "Windy" }], image: `${PM}/pm628.fHISUIAN.icon.png` },
  { name: "Corvisquire", tier: "3-Star Raids", canBeShiny: true, types: [{ name: "Flying" }], combatPower: { normal: { min: 727, max: 779 }, boosted: { min: 908, max: 974 } }, boostedWeather: [{ name: "Windy" }], image: `${PM}/pm822.icon.png` },
  { name: "Bombirdier", tier: "3-Star Raids", canBeShiny: true, types: [{ name: "Flying" }, { name: "Dark" }], combatPower: { normal: { min: 1351, max: 1421 }, boosted: { min: 1688, max: 1777 } }, boostedWeather: [{ name: "Windy" }, { name: "Fog" }], image: `${PM}/pm962.icon.png` },
  { name: "Shadow Alolan Marowak", tier: "3-Star Raids", canBeShiny: true, types: [{ name: "Fire" }, { name: "Ghost" }], combatPower: { normal: { min: 941, max: 1048 }, boosted: { min: 1176, max: 1311 } }, boostedWeather: [{ name: "Sunny" }, { name: "Fog" }], image: `${PM}/pm105.fALOLA.icon.png` },
  { name: "Shadow Hitmonlee", tier: "3-Star Raids", canBeShiny: true, types: [{ name: "Fighting" }], combatPower: { normal: { min: 1342, max: 1472 }, boosted: { min: 1677, max: 1840 } }, boostedWeather: [{ name: "Cloudy" }], image: `${PM}/pm106.fSHADOW.icon.png` },
  { name: "Shadow Gligar", tier: "3-Star Raids", canBeShiny: true, types: [{ name: "Ground" }, { name: "Flying" }], combatPower: { normal: { min: 952, max: 1061 }, boosted: { min: 1191, max: 1326 } }, boostedWeather: [{ name: "Sunny" }, { name: "Windy" }], image: `${PM}/pm207.fSHADOW.icon.png` },
  // ── 5-Star ──────────────────────────────────────────────────────────────────
  { name: "Celesteela", tier: "5-Star Raids", canBeShiny: true, types: [{ name: "Steel" }, { name: "Flying" }], combatPower: { normal: { min: 1694, max: 1772 }, boosted: { min: 2117, max: 2216 } }, boostedWeather: [{ name: "Snow" }, { name: "Windy" }], image: `${PM}/pm797.icon.png` },
  { name: "Kartana", tier: "5-Star Raids", canBeShiny: true, types: [{ name: "Grass" }, { name: "Steel" }], combatPower: { normal: { min: 2010, max: 2101 }, boosted: { min: 2512, max: 2626 } }, boostedWeather: [{ name: "Sunny" }, { name: "Snow" }], image: `${PM}/pm798.icon.png` },
  { name: "Shadow Dialga", tier: "5-Star Raids", canBeShiny: true, types: [{ name: "Steel" }, { name: "Dragon" }], combatPower: { normal: { min: 2145, max: 2307 }, boosted: { min: 2682, max: 2884 } }, boostedWeather: [{ name: "Snow" }, { name: "Windy" }], image: `${PM}/pm483.fSHADOW.icon.png` },
  // ── Mega ────────────────────────────────────────────────────────────────────
  { name: "Mega Pidgeot", tier: "Mega Raids", canBeShiny: true, types: [{ name: "Normal" }, { name: "Flying" }], combatPower: { normal: { min: 1151, max: 1216 }, boosted: { min: 1439, max: 1521 } }, boostedWeather: [{ name: "Partly Cloudy" }, { name: "Windy" }], image: `${PM}/pm18.fMEGA.icon.png` },
];

export async function getRaids(): Promise<Raid[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const data = (await res.json()) as Raid[];
    if (!Array.isArray(data) || data.length === 0) throw new Error("empty feed");
    return data;
  } catch {
    return SEED_RAIDS;
  }
}

/** Boss entry used in the calendar supplement below. */
export interface SupplementBoss {
  name: string;
  tier: string;
  canBeShiny: boolean;
  /** PokeMiners sprite filename (relative to the addressable-assets base URL). */
  asset: string;
  /** Local public path override — takes priority over the PokeMiners URL when set. */
  image?: string;
}

/**
 * Boss lists for events the ScrapedDuck feed doesn't populate with raidbattles
 * data. Keyed by the feed's `eventID`. The raids page merges these in when the
 * live feed has no bosses for a matching event.
 *
 * Covers: raid-day / raid-hour events (feed never lists bosses), GO Fest Global
 * (pokemon-go-fest type — filtered out before supplement check), and Ozone Ascent
 * (research event with a featured Rayquaza encounter).
 */
export const RAID_BOSS_SUPPLEMENT: Record<string, SupplementBoss[]> = {
  // ── Skarmory Super Mega Raid Day — June 27, 2026 ─────────────────────────
  "skarmory-super-mega-raid-day-2026": [
    { name: "Skarmory", tier: "Super Mega", canBeShiny: true, asset: "pm227.icon.png" },
  ],
  // ── Articuno / Zapdos / Moltres Raid Hour — July 1, 2026 ─────────────────
  "raidhour20260701": [
    { name: "Articuno", tier: "5★", canBeShiny: true, asset: "pm144.icon.png" },
    { name: "Zapdos",   tier: "5★", canBeShiny: true, asset: "pm145.icon.png" },
    { name: "Moltres",  tier: "5★", canBeShiny: true, asset: "pm146.icon.png" },
  ],
  // ── GO Fest 2026: Global — July 11–12, 2026 ───────────────────────────────
  // Saturday: Mega Mewtwo X (Super Mega) + 9 Mega + 25 5★
  // Sunday:   Mega Mewtwo Y (Super Mega) + 9 Mega + 38 5★ (incl. Tapus, Enamorus)
  "pokemon-go-fest-2026-global": [
    // ── Super Mega ───────────────────────────────────────────────────────────
    { name: "Mega Mewtwo X",  tier: "Super Mega", canBeShiny: false, asset: "pm150.fMEGA_X.icon.png", image: "/sprites/mega-mewtwo-x.png" },
    { name: "Mega Mewtwo Y",  tier: "Super Mega", canBeShiny: false, asset: "pm150.fMEGA_Y.icon.png", image: "/sprites/mega-mewtwo-y.png" },
    // ── Mega ────────────────────────────────────────────────────────────────
    { name: "Mega Ampharos",  tier: "Mega", canBeShiny: true,  asset: "pm181.fMEGA.icon.png" },
    { name: "Mega Gengar",    tier: "Mega", canBeShiny: true,  asset: "pm94.fMEGA.icon.png" },
    { name: "Mega Aerodactyl",tier: "Mega", canBeShiny: true,  asset: "pm142.fMEGA.icon.png" },
    { name: "Mega Tyranitar", tier: "Mega", canBeShiny: true,  asset: "pm248.fMEGA.icon.png" },
    { name: "Mega Blaziken",  tier: "Mega", canBeShiny: true,  asset: "pm257.fMEGA.icon.png" },
    { name: "Mega Swampert",  tier: "Mega", canBeShiny: true,  asset: "pm260.fMEGA.icon.png" },
    { name: "Mega Sceptile",  tier: "Mega", canBeShiny: true,  asset: "pm254.fMEGA.icon.png" },
    { name: "Mega Abomasnow", tier: "Mega", canBeShiny: true,  asset: "pm460.fMEGA.icon.png" },
    { name: "Mega Salamence", tier: "Mega", canBeShiny: true,  asset: "pm373.fMEGA.icon.png" },
    { name: "Mega Alakazam",  tier: "Mega", canBeShiny: true,  asset: "pm65.fMEGA.icon.png" },
    { name: "Mega Pidgeot",   tier: "Mega", canBeShiny: true,  asset: "pm18.fMEGA.icon.png" },
    { name: "Mega Metagross", tier: "Mega", canBeShiny: true,  asset: "pm376.fMEGA.icon.png" },
    { name: "Mega Garchomp",  tier: "Mega", canBeShiny: true,  asset: "pm445.fMEGA.icon.png" },
    { name: "Mega Beedrill",  tier: "Mega", canBeShiny: true,  asset: "pm15.fMEGA.icon.png" },
    { name: "Mega Pinsir",    tier: "Mega", canBeShiny: true,  asset: "pm127.fMEGA.icon.png" },
    { name: "Mega Gardevoir", tier: "Mega", canBeShiny: true,  asset: "pm282.fMEGA.icon.png" },
    { name: "Mega Audino",    tier: "Mega", canBeShiny: true,  asset: "pm531.fMEGA.icon.png" },
    { name: "Mega Lucario",   tier: "Mega", canBeShiny: true,  asset: "pm448.fMEGA.icon.png" },
    // ── 5-Star ──────────────────────────────────────────────────────────────
    { name: "Articuno",       tier: "5★", canBeShiny: true,  asset: "pm144.icon.png" },
    { name: "Zapdos",         tier: "5★", canBeShiny: true,  asset: "pm145.icon.png" },
    { name: "Moltres",        tier: "5★", canBeShiny: true,  asset: "pm146.icon.png" },
    { name: "Lugia",          tier: "5★", canBeShiny: true,  asset: "pm249.icon.png" },
    { name: "Ho-Oh",          tier: "5★", canBeShiny: true,  asset: "pm250.icon.png" },
    { name: "Raikou",         tier: "5★", canBeShiny: true,  asset: "pm243.icon.png" },
    { name: "Entei",          tier: "5★", canBeShiny: true,  asset: "pm244.icon.png" },
    { name: "Suicune",        tier: "5★", canBeShiny: true,  asset: "pm245.icon.png" },
    { name: "Kyogre",         tier: "5★", canBeShiny: true,  asset: "pm382.icon.png" },
    { name: "Groudon",        tier: "5★", canBeShiny: true,  asset: "pm383.icon.png" },
    { name: "Rayquaza",       tier: "5★", canBeShiny: true,  asset: "pm384.icon.png" },
    { name: "Uxie",           tier: "5★", canBeShiny: true,  asset: "pm480.icon.png" },
    { name: "Mesprit",        tier: "5★", canBeShiny: true,  asset: "pm481.icon.png" },
    { name: "Azelf",          tier: "5★", canBeShiny: true,  asset: "pm482.icon.png" },
    { name: "Dialga",         tier: "5★", canBeShiny: true,  asset: "pm483.icon.png" },
    { name: "Palkia",         tier: "5★", canBeShiny: true,  asset: "pm484.icon.png" },
    { name: "Darkrai",        tier: "5★", canBeShiny: true,  asset: "pm491.icon.png" },
    { name: "Reshiram",       tier: "5★", canBeShiny: true,  asset: "pm643.icon.png" },
    { name: "Zekrom",         tier: "5★", canBeShiny: true,  asset: "pm644.icon.png" },
    { name: "Kyurem",         tier: "5★", canBeShiny: true,  asset: "pm646.icon.png", image: "/kyurem_sprite.png" },
    { name: "Xerneas",        tier: "5★", canBeShiny: true,  asset: "pm716.icon.png" },
    { name: "Yveltal",        tier: "5★", canBeShiny: true,  asset: "pm717.icon.png" },
    { name: "Solgaleo",       tier: "5★", canBeShiny: true,  asset: "pm791.icon.png" },
    { name: "Lunala",         tier: "5★", canBeShiny: true,  asset: "pm792.icon.png" },
    { name: "Regirock",       tier: "5★", canBeShiny: true,  asset: "pm377.icon.png" },
    { name: "Regice",         tier: "5★", canBeShiny: true,  asset: "pm378.icon.png" },
    { name: "Registeel",      tier: "5★", canBeShiny: true,  asset: "pm379.icon.png" },
    { name: "Latias",         tier: "5★", canBeShiny: true,  asset: "pm380.icon.png" },
    { name: "Latios",         tier: "5★", canBeShiny: true,  asset: "pm381.icon.png" },
    { name: "Heatran",        tier: "5★", canBeShiny: true,  asset: "pm485.icon.png" },
    { name: "Regigigas",      tier: "5★", canBeShiny: true,  asset: "pm486.icon.png" },
    { name: "Cresselia",      tier: "5★", canBeShiny: true,  asset: "pm488.icon.png" },
    { name: "Cobalion",       tier: "5★", canBeShiny: true,  asset: "pm638.icon.png" },
    { name: "Terrakion",      tier: "5★", canBeShiny: true,  asset: "pm639.icon.png" },
    { name: "Virizion",       tier: "5★", canBeShiny: true,  asset: "pm640.icon.png" },
    { name: "Nihilego",       tier: "5★", canBeShiny: true,  asset: "pm793.icon.png" },
    { name: "Xurkitree",      tier: "5★", canBeShiny: true,  asset: "pm796.icon.png" },
    { name: "Celesteela",     tier: "5★", canBeShiny: true,  asset: "pm797.icon.png" },
    { name: "Kartana",        tier: "5★", canBeShiny: true,  asset: "pm798.icon.png" },
    { name: "Guzzlord",       tier: "5★", canBeShiny: true,  asset: "pm799.icon.png" },
    { name: "Necrozma",       tier: "5★", canBeShiny: true,  asset: "pm800.icon.png" },
    { name: "Regieleki",      tier: "5★", canBeShiny: true,  asset: "pm894.icon.png" },
    { name: "Regidrago",      tier: "5★", canBeShiny: true,  asset: "pm895.icon.png" },
    { name: "Giratina",       tier: "5★", canBeShiny: true,  asset: "pm487.icon.png" },
    { name: "Zacian",         tier: "5★", canBeShiny: true,  asset: "pm888.icon.png" },
    { name: "Zamazenta",      tier: "5★", canBeShiny: true,  asset: "pm889.icon.png" },
    { name: "Tapu Koko",      tier: "5★", canBeShiny: true,  asset: "pm785.icon.png" },
    { name: "Tapu Lele",      tier: "5★", canBeShiny: true,  asset: "pm786.icon.png" },
    { name: "Tapu Bulu",      tier: "5★", canBeShiny: true,  asset: "pm787.icon.png" },
    { name: "Tapu Fini",      tier: "5★", canBeShiny: true,  asset: "pm788.icon.png" },
    { name: "Enamorus Incarnate", tier: "5★", canBeShiny: true, asset: "pm905.icon.png" },
  ],
  // ── Kyogre Raid Hour — July 15, 2026 ─────────────────────────────────────
  "raidhour20260715": [
    { name: "Kyogre", tier: "5★", canBeShiny: true, asset: "pm382.icon.png" },
  ],
  // ── Raichu Super Mega Raid Day — July 18, 2026 ───────────────────────────
  "raichu-super-mega-raid-day-2026": [
    { name: "Raichu", tier: "Super Mega", canBeShiny: true, asset: "pm26.icon.png" },
  ],
  // ── Solgaleo Raid Hour — July 22, 2026 ───────────────────────────────────
  "raidhour20260722": [
    { name: "Solgaleo", tier: "5★", canBeShiny: true, asset: "pm791.icon.png" },
  ],
  // ── Ozone Ascent — July 25–26, 2026 ──────────────────────────────────────
  // Rayquaza is the featured research encounter; also appears as a raid boss.
  "ozone-ascent-2026": [
    { name: "Rayquaza",      tier: "5★",   canBeShiny: true, asset: "pm384.icon.png" },
    { name: "Mega Rayquaza", tier: "Mega",  canBeShiny: true, asset: "pm384.fMEGA.icon.png" },
  ],
  // ── Kyurem Raid Hour — July 29, 2026 ─────────────────────────────────────
  "raidhour20260729": [
    { name: "Kyurem", tier: "5★", canBeShiny: true, asset: "pm646.icon.png", image: "/kyurem_sprite.png" },
  ],
};

/** Sort tiers in a sensible battle order: Mega → 5 → 3 → 1, others last. */
export function tierRank(tier: string): number {
  const t = tier.toLowerCase();
  if (t.includes("mega")) return 0;
  const m = t.match(/(\d+)/);
  if (m) return 100 - Number(m[1]); // 5★ before 1★
  return 999;
}

/** Accent classes + a short pill label for a raid tier. */
export function tierMeta(tier: string): { short: string; badge: string; ring: string } {
  const t = tier.toLowerCase();
  // "Super Mega" must be checked before the generic "mega" match.
  if (t.includes("super mega")) return { short: "Super Mega", badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", ring: "ring-violet-200" };
  if (t.includes("mega"))       return { short: "Mega",       badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300", ring: "ring-fuchsia-200" };
  if (t.includes("5"))          return { short: "5★",         badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",         ring: "ring-rose-200" };
  if (t.includes("3"))          return { short: "3★",         badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",       ring: "ring-amber-200" };
  if (t.includes("1"))          return { short: "1★",         badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",             ring: "ring-sky-200" };
  return { short: tier, badge: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400", ring: "ring-slate-200" };
}
