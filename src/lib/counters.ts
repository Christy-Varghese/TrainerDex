import { getPokedex, hundoCpAt, type Pokemon } from "./pokedex";
import { effectiveness } from "./type-chart";

const CPM40 = 0.7903;
const SHADOW_ATK_BONUS = 1.2;

const POKEMINERS =
  "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets";

export interface Counter {
  pokemon: Pokemon;
  /** The attacker's own type that hits the boss hardest. */
  bestType: string;
  /** Effectiveness multiplier of bestType vs the boss. */
  multiplier: number;
  /** Relative counter score (higher = better). Normalized to top = 100. */
  score: number;
  /** L40 hundo CP (using form-specific stats when applicable). */
  cp: number;
  /** Recommended fast move for this matchup. */
  fastMove?: string;
  /** Recommended charged move for this matchup. */
  chargedMove?: string;
  /** Display label override — e.g. "Mega Tyranitar", "Shadow Darkrai". */
  displayName?: string;
  /** Sprite URL override for mega / shadow / alternate forms. */
  sprite?: string;
}

// ---- Curated counters -------------------------------------------------------
// Ranked by Pokébattler DPS³×TDO simulation (the same methodology used by
// pokemongohub.net). Keyed by boss Pokédex number. Entries cover mega and
// shadow forms that the pure stat-based algorithm can't distinguish.

interface CuratedEntry {
  dex: number;
  displayName?: string;
  fastMove: string;
  chargedMove: string;
  bestType: string;
  /** Stat overrides for mega / primal forms. */
  atk?: number;
  def?: number;
  sta?: number;
  /** Apply 20 % shadow attack bonus. */
  shadow?: boolean;
  /** Sprite URL override (mega / shadow / origin formes). */
  sprite?: string;
}

const CURATED: Record<number, CuratedEntry[]> = {
  // ── Mewtwo / Mega Mewtwo Y ── pure Psychic ────────────────────────────────
  // Weaknesses: Dark ×1.6 · Ghost ×1.6 · Bug ×1.6
  150: [
    {
      dex: 248, displayName: "Mega Tyranitar",
      fastMove: "Bite", chargedMove: "Brutal Swing", bestType: "Dark",
      atk: 309, def: 222, sta: 225,
      sprite: `${POKEMINERS}/pm248.fMEGA.icon.png`,
    },
    {
      dex: 248, displayName: "Shadow Tyranitar",
      fastMove: "Bite", chargedMove: "Brutal Swing", bestType: "Dark",
      shadow: true, sprite: `${POKEMINERS}/pm248.fSHADOW.icon.png`,
    },
    {
      dex: 94, displayName: "Mega Gengar",
      fastMove: "Shadow Claw", chargedMove: "Shadow Ball", bestType: "Ghost",
      atk: 349, def: 199, sta: 155,
      sprite: `${POKEMINERS}/pm94.fMEGA.icon.png`,
    },
    {
      dex: 491, displayName: "Shadow Darkrai",
      fastMove: "Snarl", chargedMove: "Shadow Ball", bestType: "Dark",
      shadow: true, sprite: `${POKEMINERS}/pm491.fSHADOW.icon.png`,
    },
    {
      dex: 359, displayName: "Mega Absol",
      fastMove: "Snarl", chargedMove: "Dark Pulse", bestType: "Dark",
      atk: 314, def: 130, sta: 163,
      sprite: `${POKEMINERS}/pm359.fMEGA.icon.png`,
    },
    {
      dex: 491, displayName: "Darkrai",
      fastMove: "Snarl", chargedMove: "Shadow Ball", bestType: "Dark",
    },
    {
      dex: 229, displayName: "Mega Houndoom",
      fastMove: "Snarl", chargedMove: "Foul Play", bestType: "Dark",
      atk: 289, def: 194, sta: 181,
      sprite: `${POKEMINERS}/pm229.fMEGA.icon.png`,
    },
    {
      dex: 806, displayName: "Blacephalon",
      fastMove: "Hex", chargedMove: "Shadow Ball", bestType: "Ghost",
    },
    {
      dex: 487, displayName: "Giratina (Origin)",
      fastMove: "Shadow Claw", chargedMove: "Shadow Force", bestType: "Ghost",
      atk: 225, def: 187, sta: 284,
      sprite: `${POKEMINERS}/pm487.fORIGIN.icon.png`,
    },
    {
      dex: 635, displayName: "Hydreigon",
      fastMove: "Bite", chargedMove: "Brutal Swing", bestType: "Dark",
    },
    {
      dex: 717, displayName: "Yveltal",
      fastMove: "Snarl", chargedMove: "Dark Pulse", bestType: "Dark",
    },
    {
      dex: 354, displayName: "Mega Banette",
      fastMove: "Shadow Claw", chargedMove: "Shadow Ball", bestType: "Ghost",
      atk: 312, def: 160, sta: 162,
      sprite: `${POKEMINERS}/pm354.fMEGA.icon.png`,
    },
  ],
};

// ---- Curated counter builder ------------------------------------------------

function buildCurated(entries: CuratedEntry[], bossTypes: string[], limit: number): Counter[] {
  const byDex = new Map<number, Pokemon>(getPokedex().map((p) => [p.dex, p]));
  const out: Counter[] = [];

  for (const e of entries.slice(0, limit)) {
    const base = byDex.get(e.dex);
    if (!base) continue;

    const atk = e.atk ?? base.atk;
    const def = e.def ?? base.def;
    const sta = e.sta ?? base.sta;
    const effectiveAtk = e.shadow ? Math.round(atk * SHADOW_ATK_BONUS) : atk;

    const mult = effectiveness(e.bestType, bossTypes);
    const score = (effectiveAtk + 15) * CPM40 * mult;
    const fakeP = { ...base, atk, def, sta } as Pokemon;

    out.push({
      pokemon: base,
      bestType: e.bestType,
      multiplier: mult,
      score,
      cp: hundoCpAt(fakeP, 40),
      fastMove: e.fastMove,
      chargedMove: e.chargedMove,
      displayName: e.displayName,
      sprite: e.sprite,
    });
  }

  const max = out[0]?.score ?? 1;
  return out.map((c) => ({ ...c, score: Math.round((c.score / max) * 100) }));
}

// ---- Algorithmic fallback ---------------------------------------------------

function computeAlgo(bossTypes: string[], bossDex: number, limit: number): Counter[] {
  const scored: Counter[] = [];
  for (const p of getPokedex()) {
    if (p.inGo === false) continue;
    if (p.dex === bossDex) continue;
    if (!p.types?.length || !p.atk) continue;

    let bestType = p.types[0];
    let multiplier = 0;
    for (const t of p.types) {
      const m = effectiveness(t, bossTypes);
      if (m > multiplier) { multiplier = m; bestType = t; }
    }
    if (multiplier < 1) continue;

    const score = (p.atk + 15) * CPM40 * multiplier;
    scored.push({ pokemon: p, bestType, multiplier, score, cp: hundoCpAt(p, 40) });
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);
  const max = top[0]?.score ?? 1;
  return top.map((c) => ({ ...c, score: Math.round((c.score / max) * 100) }));
}

// ---- Public API ------------------------------------------------------------

/**
 * Best counters for a raid boss at level 40. Returns curated data (with
 * recommended moves, mega/shadow forms) when available; falls back to a
 * type-effectiveness × ATK stat proxy for all other Pokémon.
 */
export function bestCounters(bossTypes: string[], bossDex: number, limit = 12): Counter[] {
  const curated = CURATED[bossDex];
  if (curated) return buildCurated(curated, bossTypes, limit);
  return computeAlgo(bossTypes, bossDex, limit);
}
