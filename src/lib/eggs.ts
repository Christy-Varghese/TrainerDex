// Egg hatch pool from the public ScrapedDuck / Leek Duck `eggs.json` feed.
// Eggs always hatch at Level 20, so combatPower.max is the 100% IV (hundo) CP —
// the number to look for the moment an egg cracks open.

const FEED_URL = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/eggs.json";

export interface Egg {
  name: string;
  eggType: string; // "1 km", "2 km", "5 km", "7 km", "10 km", "12 km"
  image: string;
  canBeShiny: boolean;
  isAdventureSync: boolean;
  isRegional: boolean;
  combatPower: { min: number; max: number };
}

const SEED_EGGS: Egg[] = [];

export async function getEggs(): Promise<Egg[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const data = (await res.json()) as Egg[];
    if (!Array.isArray(data) || data.length === 0) throw new Error("empty feed");
    return data;
  } catch {
    return SEED_EGGS;
  }
}

const DIST_ORDER = ["1 km", "2 km", "5 km", "7 km", "10 km", "12 km"];

export function eggDistanceRank(eggType: string): number {
  const i = DIST_ORDER.indexOf(eggType);
  return i === -1 ? 99 : i;
}

/** Group eggs by hatch distance, in ascending order. */
export function eggsByDistance(eggs: Egg[]): { distance: string; eggs: Egg[] }[] {
  const map = new Map<string, Egg[]>();
  for (const e of eggs) (map.get(e.eggType) ?? map.set(e.eggType, []).get(e.eggType)!).push(e);
  return [...map.entries()]
    .sort((a, b) => eggDistanceRank(a[0]) - eggDistanceRank(b[0]))
    .map(([distance, list]) => ({
      distance,
      eggs: list.sort((a, b) => b.combatPower.max - a.combatPower.max),
    }));
}

/** Accent per egg distance for the graphic. */
export function eggDistanceColor(eggType: string): string {
  switch (eggType) {
    case "1 km":
      return "bg-pink-200 text-pink-800";
    case "2 km":
      return "bg-green-200 text-green-800";
    case "5 km":
      return "bg-amber-200 text-amber-800";
    case "7 km":
      return "bg-rose-200 text-rose-800";
    case "10 km":
      return "bg-indigo-200 text-indigo-800";
    case "12 km":
      return "bg-red-300 text-red-900";
    default:
      return "bg-slate-200 text-slate-700";
  }
}
