// Pokémon GO Pokédex data. The dataset is a build-time snapshot merged from the
// public pogoapi.net feeds (released-in-GO list, base stats, types, shiny
// availability) — see scripts that regenerate `pokedex-data.json`. Only
// Pokémon actually released in Pokémon GO are included, with GO base stats
// (Attack/Defense/Stamina), derived region, max hundo CP, and shiny status.

import RAW from "./pokedex-data.json";

export interface PokemonForm {
  form: string; // "Galarian", "Alola", "Hisuian", "Paldea"
  types: string[];
  atk: number;
  def: number;
  sta: number;
  maxCp: number;
  sprite: string;
}

export interface Pokemon {
  dex: number;
  name: string;
  types: string[];
  atk: number;
  def: number;
  sta: number;
  /** Level 40, 15/15/15 CP — the strongest a hundo reaches without XL Candy. */
  maxCp: number;
  region: string;
  shiny: boolean;
  /** Where the shiny can currently be obtained, if any. */
  shinyMethods: string[];
  /** Alternate regional forms (if any) — shown on the detail page. */
  forms?: PokemonForm[];
  /** Direct sprite URL for Pokémon without a PokeMiners GO asset (not yet in GO). */
  sprite?: string;
  /** False for National-Dex Pokémon not yet released in Pokémon GO. Absent = in GO. */
  inGo?: boolean;
}

const POKEDEX = RAW as Pokemon[];

export function getPokedex(): Pokemon[] {
  return POKEDEX;
}

export function getPokemon(dex: number): Pokemon | undefined {
  return POKEDEX.find((p) => p.dex === dex);
}

// Form/state prefixes that don't change which Pokédex entry we link to.
const FORM_PREFIX =
  /^(shadow|mega|primal|dynamax|gigantamax|gmax|apex|galarian|alolan|hisuian|paldean|origin|altered|therian|incarnate)\s+/i;

/** Normalize a display name (raid boss, spotlight mon, spawn) for lookup. */
function normalizeName(name: string): string {
  let n = name.replace(/\([^)]*\)/g, ""); // drop "(Hero of Many Battles)"
  n = n.replace(/\bforme?\b/gi, "");
  let prev;
  do {
    prev = n;
    n = n.replace(FORM_PREFIX, "");
  } while (n !== prev);
  return n.trim().toLowerCase();
}

const BY_NAME = new Map<string, Pokemon>();
for (const p of POKEDEX) BY_NAME.set(p.name.toLowerCase(), p);

// Some entries carry a form word in the stored name ("Giratina Altered",
// "Tornadus Incarnate"). Register the bare species name too so a mention like
// "Altered Forme Giratina" or "Therian Forme Tornadus" resolves to the entry.
const FORM_WORDS = new Set(["altered", "origin", "incarnate", "therian", "forme", "forms"]);
for (const p of POKEDEX) {
  const base = p.name
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => !FORM_WORDS.has(w))
    .join(" ");
  if (base && !BY_NAME.has(base)) BY_NAME.set(base, p);
}

/** Resolve a featured-Pokémon name to its Pokédex entry (forms map to base). */
export function findByName(name: string): Pokemon | undefined {
  if (!name) return undefined;
  const direct = BY_NAME.get(name.trim().toLowerCase());
  if (direct) return direct;
  return BY_NAME.get(normalizeName(name));
}

// Multi-word Pokémon names (e.g. "Mr. Mime") need bigram matching.
const MAX_NAME_WORDS = Math.max(...[...BY_NAME.keys()].map((n) => n.split(" ").length));

export interface MentionedPokemon {
  pokemon: Pokemon;
  /** True when the name appeared as a Shadow Pokémon ("Shadow Reshiram"). */
  shadow: boolean;
}

/**
 * Scan free text (news article blocks) for Pokémon names and return the unique
 * entries mentioned, in order of first appearance. Tracks whether the mention
 * was a Shadow Pokémon so the UI can flag it with a shadow icon. Used to show
 * sprites + shiny/shadow icons alongside news content.
 */
export function extractPokemon(texts: string[], cap = 16): MentionedPokemon[] {
  const found = new Map<number, MentionedPokemon>();
  for (const text of texts) {
    const words = text.split(/[^A-Za-zÀ-ÿ.\-]+/).filter(Boolean);
    for (let i = 0; i < words.length; i++) {
      // Try longest n-gram first so "Mr. Mime" beats a stray "Mime".
      for (let n = Math.min(MAX_NAME_WORDS, words.length - i); n >= 1; n--) {
        const key = words.slice(i, i + n).join(" ").toLowerCase();
        const hit = BY_NAME.get(key);
        if (hit) {
          const shadow = i > 0 && words[i - 1].toLowerCase() === "shadow";
          const existing = found.get(hit.dex);
          if (!existing) found.set(hit.dex, { pokemon: hit, shadow });
          else if (shadow) existing.shadow = true; // promote if any mention is Shadow
          break;
        }
      }
      if (found.size >= cap) return [...found.values()];
    }
  }
  return [...found.values()];
}

/** True if a display name denotes a Shadow Pokémon. */
export function isShadowName(name: string): boolean {
  return /\bshadow\b/i.test(name);
}

// ---- Hundo (100% IV) CP by catch scenario --------------------------------
// A Pokémon's CP depends on the level it's caught at, which is fixed per source
// (raid = L20, weather-boosted raid = L25, research = L15, etc.). The same
// 15/15/15 Pokémon therefore shows a different CP depending on where you got
// it. CPM (Combat Power Multiplier) values are the official per-level constants.

const CPM: Record<number, number> = {
  8: 0.37523559, // Shadow — Team GO Rocket Grunt / Leader
  13: 0.4785844, // Shadow — Giovanni
  15: 0.51739395,
  20: 0.5974,
  25: 0.667934,
  30: 0.7317,
  35: 0.76156384,
  40: 0.7903,
};

/** 15/15/15 CP for a Pokémon at a given level. */
export function hundoCpAt(p: Pokemon, level: number): number {
  const cpm = CPM[level];
  if (!cpm) return 0;
  const A = p.atk + 15;
  const D = p.def + 15;
  const S = p.sta + 15;
  return Math.floor((A * Math.sqrt(D) * Math.sqrt(S) * cpm * cpm) / 10);
}

export interface HundoScenario {
  label: string;
  level: number;
  cp: number;
  note?: string;
}

/** Every catch scenario's hundo CP — wild, research, raid, weather-boosted. */
export function hundoScenarios(p: Pokemon): HundoScenario[] {
  return [
    { label: "Field Research / Breakthrough", level: 15, cp: hundoCpAt(p, 15) },
    { label: "Raid / Egg", level: 20, cp: hundoCpAt(p, 20) },
    { label: "Raid / Egg — weather boosted", level: 25, cp: hundoCpAt(p, 25), note: "☀️" },
    { label: "Wild (max)", level: 30, cp: hundoCpAt(p, 30) },
    { label: "Wild — weather boosted", level: 35, cp: hundoCpAt(p, 35), note: "☀️" },
  ];
}

/** Shadow catch hundo CPs (Team GO Rocket). Shadow Pokémon are caught at fixed
 *  levels: Grunts/Leaders at L8, Giovanni at L13. */
export function shadowScenarios(p: Pokemon): HundoScenario[] {
  return [
    { label: "Rocket Grunt / Leader", level: 8, cp: hundoCpAt(p, 8) },
    { label: "Giovanni", level: 13, cp: hundoCpAt(p, 13) },
  ];
}

/** The hundo CP a trainer should expect for a given event type's catch source. */
export function contextHundo(
  p: Pokemon,
  eventType: string,
  shadow = false,
): { label: string; cp: number; boostedCp: number } {
  if (shadow) {
    // Shadow Pokémon are rescued from Team GO Rocket at fixed levels.
    return { label: "Shadow catch (L8)", cp: hundoCpAt(p, 8), boostedCp: hundoCpAt(p, 8) };
  }
  if (eventType.includes("raid")) {
    return { label: "Raid catch (L20)", cp: hundoCpAt(p, 20), boostedCp: hundoCpAt(p, 25) };
  }
  if (eventType.includes("research") || eventType === "choose-your-path") {
    return { label: "Research catch (L15)", cp: hundoCpAt(p, 15), boostedCp: hundoCpAt(p, 15) };
  }
  // Spotlight Hour and most events = wild encounters.
  return { label: "Wild catch (L30)", cp: hundoCpAt(p, 30), boostedCp: hundoCpAt(p, 35) };
}

// Local fallbacks for Pokémon whose PokeMiners addressable sprite 404s. Files
// live in /public (Kyurem) and /public/sprites (downloaded from PokémonDB).
const SPRITE_OVERRIDE: Record<number, string> = {
  646: "/kyurem_sprite.png", // Kyurem
  807: "/sprites/zeraora.png", // Zeraora — no PokeMiners GO asset (locally provided)
  // PokeMiners has no pm<dex>.icon.png for these — PokémonDB HOME sprites.
  649: "/sprites/pm649.png", // Genesect
  837: "/sprites/pm837.png", // Rolycoly
  838: "/sprites/pm838.png", // Carkol
  839: "/sprites/pm839.png", // Coalossal
  845: "/sprites/pm845.png", // Cramorant
  852: "/sprites/pm852.png", // Clobbopus
  853: "/sprites/pm853.png", // Grapploct
  917: "/sprites/pm917.png", // Tarountula
  918: "/sprites/pm918.png", // Spidops
  932: "/sprites/pm932.png", // Nacli
  933: "/sprites/pm933.png", // Naclstack
  934: "/sprites/pm934.png", // Garganacl
  940: "/sprites/pm940.png", // Wattrel
  941: "/sprites/pm941.png", // Kilowattrel
  950: "/sprites/pm950.png", // Klawf
  969: "/sprites/pm969.png", // Glimmet
  970: "/sprites/pm970.png", // Glimmora
};

// Sprites carried directly on data entries (Pokémon not in GO → no PokeMiners asset).
const DATA_SPRITE = new Map<number, string>();
for (const p of POKEDEX) if (p.sprite) DATA_SPRITE.set(p.dex, p.sprite);

/** GO sprite from the PokeMiners asset mirror (local override / data sprite if missing). */
export function spriteUrl(dex: number): string {
  return (
    SPRITE_OVERRIDE[dex] ??
    DATA_SPRITE.get(dex) ??
    `https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets/pm${dex}.icon.png`
  );
}

/** Regions in National Dex order. */
export const REGIONS = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Paldea",
] as const;

// 18 Pokémon types → accent classes (background + text) for badges and chips.
const TYPE_COLOR: Record<string, string> = {
  Normal: "bg-stone-200 text-stone-700",
  Fire: "bg-orange-200 text-orange-800",
  Water: "bg-sky-200 text-sky-800",
  Electric: "bg-yellow-200 text-yellow-800",
  Grass: "bg-green-200 text-green-800",
  Ice: "bg-cyan-200 text-cyan-800",
  Fighting: "bg-red-200 text-red-800",
  Poison: "bg-purple-200 text-purple-800",
  Ground: "bg-amber-200 text-amber-800",
  Flying: "bg-indigo-200 text-indigo-800",
  Psychic: "bg-pink-200 text-pink-800",
  Bug: "bg-lime-200 text-lime-800",
  Rock: "bg-stone-300 text-stone-800",
  Ghost: "bg-violet-200 text-violet-800",
  Dragon: "bg-indigo-300 text-indigo-900",
  Dark: "bg-neutral-300 text-neutral-800",
  Steel: "bg-slate-200 text-slate-700",
  Fairy: "bg-rose-200 text-rose-800",
};

export function typeColor(type: string): string {
  return TYPE_COLOR[type] ?? "bg-slate-200 text-slate-700";
}

/** All types present in the dataset, in canonical order. */
export const ALL_TYPES = Object.keys(TYPE_COLOR);
