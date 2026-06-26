import { getPokedex, hundoCpAt, type Pokemon } from "./pokedex";
import { effectiveness } from "./type-chart";

// Level-40 Combat Power Multiplier — counters are rated at L40 (no XL Candy), the
// common "maxed attacker" benchmark trainers compare against.
const CPM40 = 0.7903;

export interface Counter {
  pokemon: Pokemon;
  /** The attacker's own type that hits the boss hardest (STAB proxy). */
  bestType: string;
  /** Effectiveness multiplier of bestType vs the boss. */
  multiplier: number;
  /** Relative counter score (higher = better). Normalized to the top = 100. */
  score: number;
  /** L40 hundo CP of the counter. */
  cp: number;
}

/**
 * Best counters for a raid boss, rated at level 40. This is a pragmatic DPS
 * proxy — effective attack (`atk × CPM40`) weighted by how super-effective the
 * attacker's strongest STAB type is against the boss. It won't perfectly match
 * a full DPS³×TDO simulation, but it surfaces the right top attackers without a
 * move-by-move sim. Excludes the boss itself and non-GO Pokémon; forms dedupe by
 * dex.
 */
export function bestCounters(bossTypes: string[], bossDex: number, limit = 12): Counter[] {
  const scored: Counter[] = [];
  for (const p of getPokedex()) {
    if (p.inGo === false) continue;
    if (p.dex === bossDex) continue;
    if (!p.types?.length || !p.atk) continue;

    // Attacker's best STAB type vs this boss.
    let bestType = p.types[0];
    let multiplier = 0;
    for (const t of p.types) {
      const m = effectiveness(t, bossTypes);
      if (m > multiplier) {
        multiplier = m;
        bestType = t;
      }
    }
    // Only count attackers that are at least neutral; we want pressure, so favor
    // super-effective. Skip attackers that are resisted (mult < 1) entirely.
    if (multiplier < 1) continue;

    const effAtk = (p.atk + 15) * CPM40;
    const score = effAtk * multiplier;
    scored.push({ pokemon: p, bestType, multiplier, score, cp: hundoCpAt(p, 40), });
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);
  const max = top[0]?.score ?? 1;
  return top.map((c) => ({ ...c, score: Math.round((c.score / max) * 100) }));
}
