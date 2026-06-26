// Movesets from pogoapi. We fetch the full "current Pokémon moves" table once
// (Next dedupes + caches the request) and index it by Pokédex number, preferring
// the Normal form. Used on the Pokémon detail page to show a raid boss's (or any
// Pokémon's) fast + charged move pool.

const MOVES_URL = "https://pogoapi.net/api/v1/current_pokemon_moves.json";

interface RawMoveEntry {
  pokemon_id: number;
  pokemon_name: string;
  form: string;
  fast_moves: string[];
  charged_moves: string[];
  elite_fast_moves?: string[];
  elite_charged_moves?: string[];
}

export interface Moveset {
  fast: string[];
  charged: string[];
  eliteFast: string[];
  eliteCharged: string[];
}

/** Pretty-print a pogoapi move id, e.g. "POWER_WHIP_FAST" → "Power Whip". */
function prettyMove(name: string): string {
  return name
    .replace(/_FAST$/i, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

let cache: Map<number, Moveset> | null = null;

async function load(): Promise<Map<number, Moveset>> {
  if (cache) return cache;
  const map = new Map<number, Moveset>();
  try {
    const res = await fetch(MOVES_URL, {
      headers: { "User-Agent": "Mozilla/5.0 TrainerDex" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`moves feed ${res.status}`);
    const data = (await res.json()) as RawMoveEntry[];
    for (const e of data) {
      // Prefer the Normal form; don't overwrite it with an alt form.
      const existing = map.get(e.pokemon_id);
      const isNormal = !e.form || /normal/i.test(e.form);
      if (existing && !isNormal) continue;
      map.set(e.pokemon_id, {
        fast: (e.fast_moves ?? []).map(prettyMove),
        charged: (e.charged_moves ?? []).map(prettyMove),
        eliteFast: (e.elite_fast_moves ?? []).map(prettyMove),
        eliteCharged: (e.elite_charged_moves ?? []).map(prettyMove),
      });
    }
  } catch {
    // Network/feed failure → empty map; callers render "moveset unavailable".
  }
  cache = map;
  return map;
}

export async function getMoveset(dex: number): Promise<Moveset | undefined> {
  const map = await load();
  return map.get(dex);
}
