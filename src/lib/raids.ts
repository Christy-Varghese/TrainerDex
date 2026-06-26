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

const SEED_RAIDS: Raid[] = [
  {
    name: "Zacian (Hero of Many Battles)",
    tier: "Tier 5",
    canBeShiny: true,
    types: [{ name: "Fairy" }],
    combatPower: { normal: { min: 1742, max: 1830 }, boosted: { min: 2178, max: 2287 } },
    boostedWeather: [{ name: "Cloudy" }],
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm888.icon.png",
  },
  {
    name: "Mega Rayquaza",
    tier: "Mega",
    canBeShiny: true,
    types: [{ name: "Dragon" }, { name: "Flying" }],
    combatPower: { normal: { min: 2255, max: 2350 }, boosted: { min: 2819, max: 2937 } },
    boostedWeather: [{ name: "Windy" }],
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm384.icon.png",
  },
  {
    name: "Dratini",
    tier: "Tier 1",
    canBeShiny: true,
    types: [{ name: "Dragon" }],
    combatPower: { normal: { min: 426, max: 470 }, boosted: { min: 533, max: 588 } },
    boostedWeather: [{ name: "Windy" }],
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm147.icon.png",
  },
  {
    name: "Galarian Articuno",
    tier: "Tier 5",
    canBeShiny: true,
    types: [{ name: "Psychic" }, { name: "Flying" }],
    combatPower: { normal: { min: 1512, max: 1593 }, boosted: { min: 1890, max: 1991 } },
    boostedWeather: [{ name: "Windy" }],
    image:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm144.fGALARIAN.icon.png",
  },
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
  if (t.includes("mega")) return { short: "Mega", badge: "bg-fuchsia-100 text-fuchsia-700", ring: "ring-fuchsia-200" };
  if (t.includes("5")) return { short: "5★", badge: "bg-rose-100 text-rose-700", ring: "ring-rose-200" };
  if (t.includes("3")) return { short: "3★", badge: "bg-amber-100 text-amber-700", ring: "ring-amber-200" };
  if (t.includes("1")) return { short: "1★", badge: "bg-sky-100 text-sky-700", ring: "ring-sky-200" };
  return { short: tier, badge: "bg-slate-100 text-slate-600", ring: "ring-slate-200" };
}
