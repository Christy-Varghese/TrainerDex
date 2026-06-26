// Pokémon GO type-effectiveness multipliers. GO uses 1.6× (super effective),
// 0.625× (not very effective) and 0.390625× (double resist) — not the main-series
// 2×/0.5×. Keys are lowercase attacking type → defending type → multiplier.

const SE = 1.6; // super effective
const NVE = 0.625; // not very effective
const IMM = 0.390625; // double resistance ("immunity" in GO is a strong resist)

type Chart = Record<string, Record<string, number>>;

// Only non-1.0 matchups are listed; lookups default to 1.0.
const RAW: Record<string, { se?: string[]; nve?: string[]; imm?: string[] }> = {
  Normal: { nve: ["Rock", "Steel"], imm: ["Ghost"] },
  Fire: { se: ["Grass", "Ice", "Bug", "Steel"], nve: ["Fire", "Water", "Rock", "Dragon"] },
  Water: { se: ["Fire", "Ground", "Rock"], nve: ["Water", "Grass", "Dragon"] },
  Electric: { se: ["Water", "Flying"], nve: ["Electric", "Grass", "Dragon"], imm: ["Ground"] },
  Grass: { se: ["Water", "Ground", "Rock"], nve: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"] },
  Ice: { se: ["Grass", "Ground", "Flying", "Dragon"], nve: ["Fire", "Water", "Ice", "Steel"] },
  Fighting: { se: ["Normal", "Ice", "Rock", "Dark", "Steel"], nve: ["Poison", "Flying", "Psychic", "Bug", "Fairy"], imm: ["Ghost"] },
  Poison: { se: ["Grass", "Fairy"], nve: ["Poison", "Ground", "Rock", "Ghost"], imm: ["Steel"] },
  Ground: { se: ["Fire", "Electric", "Poison", "Rock", "Steel"], nve: ["Grass", "Bug"], imm: ["Flying"] },
  Flying: { se: ["Grass", "Fighting", "Bug"], nve: ["Electric", "Rock", "Steel"] },
  Psychic: { se: ["Fighting", "Poison"], nve: ["Psychic", "Steel"], imm: ["Dark"] },
  Bug: { se: ["Grass", "Psychic", "Dark"], nve: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"] },
  Rock: { se: ["Fire", "Ice", "Flying", "Bug"], nve: ["Fighting", "Ground", "Steel"] },
  Ghost: { se: ["Psychic", "Ghost"], nve: ["Dark"], imm: ["Normal"] },
  Dragon: { se: ["Dragon"], nve: ["Steel"], imm: ["Fairy"] },
  Dark: { se: ["Psychic", "Ghost"], nve: ["Fighting", "Dark", "Fairy"] },
  Steel: { se: ["Ice", "Rock", "Fairy"], nve: ["Fire", "Water", "Electric", "Steel"] },
  Fairy: { se: ["Fighting", "Dragon", "Dark"], nve: ["Fire", "Poison", "Steel"] },
};

const CHART: Chart = {};
for (const [atk, m] of Object.entries(RAW)) {
  CHART[atk] = {};
  for (const d of m.se ?? []) CHART[atk][d] = SE;
  for (const d of m.nve ?? []) CHART[atk][d] = NVE;
  for (const d of m.imm ?? []) CHART[atk][d] = IMM;
}

/** Multiplier for one attacking type against a defender's (1-2) types. */
export function effectiveness(attackType: string, defenderTypes: string[]): number {
  return defenderTypes.reduce((mult, d) => mult * (CHART[attackType]?.[d] ?? 1), 1);
}

const ALL = Object.keys(RAW);

export interface DefenseProfile {
  /** Types that deal extra damage (multiplier > 1), strongest first. */
  weaknesses: { type: string; mult: number }[];
  /** Types the Pokémon resists (multiplier < 1), strongest resist first. */
  resistances: { type: string; mult: number }[];
}

/** Defensive type profile — what a Pokémon with `defenderTypes` is weak/resistant to. */
export function defenseProfile(defenderTypes: string[]): DefenseProfile {
  const weaknesses: { type: string; mult: number }[] = [];
  const resistances: { type: string; mult: number }[] = [];
  for (const atk of ALL) {
    const m = effectiveness(atk, defenderTypes);
    if (m > 1.01) weaknesses.push({ type: atk, mult: m });
    else if (m < 0.99) resistances.push({ type: atk, mult: m });
  }
  weaknesses.sort((a, b) => b.mult - a.mult);
  resistances.sort((a, b) => a.mult - b.mult);
  return { weaknesses, resistances };
}

/** The single best (highest-multiplier) attacking type against a defender. */
export function bestAttackTypeAgainst(defenderTypes: string[], candidateTypes: string[]): { type: string; mult: number } {
  let best = { type: candidateTypes[0] ?? "Normal", mult: 0 };
  for (const t of candidateTypes) {
    const mult = effectiveness(t, defenderTypes);
    if (mult > best.mult) best = { type: t, mult };
  }
  return best;
}
