import type { Pokemon } from "./pokedex";
import { specialFormMaxCp, specialFormsFor } from "./special-forms";

// Variant forms (shiny / mega / gigantamax / dynamax) for the Pokédex detail
// page. Sprites come from the PokeMiners addressable-asset mirror; mega stats
// come from pogoapi. Each variant carries its own sprite and (for megas) its own
// stats + max CP.

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets";

const CPM40 = 0.7903;

function hundoCp(atk: number, def: number, sta: number): number {
  return Math.floor(((atk + 15) * Math.sqrt(def + 15) * Math.sqrt(sta + 15) * CPM40 * CPM40) / 10);
}

export const shinySprite = (dex: number) => `${SPRITE_BASE}/pm${dex}.s.icon.png`;
const megaSprite = (dex: number, form: string) =>
  `${SPRITE_BASE}/pm${dex}.fMEGA${form === "X" ? "_X" : form === "Y" ? "_Y" : ""}.icon.png`;
const gmaxSprite = (dex: number) => `${SPRITE_BASE}/pm${dex}.fGIGANTAMAX.icon.png`;

// Canonical Gigantamax species with confirmed PokeMiners GO sprites (verified).
// These are also the showcase Dynamax (Max Battle) species.
const GMAX_SET = new Set([3, 6, 9, 12, 68, 94, 99, 131, 143, 812, 815, 818, 849]);

// ---- Mega roster (pogoapi, fetched + cached once) ------------------------

const MEGA_URL = "https://pogoapi.net/api/v1/mega_pokemon.json";

interface RawMega {
  pokemon_id: number;
  pokemon_name: string;
  mega_name: string;
  form: string; // "Normal" | "X" | "Y"
  stats: { base_attack: number; base_defense: number; base_stamina: number };
  type: string[];
}

export interface MegaInfo {
  form: string; // "", "X", "Y"
  name: string;
  atk: number;
  def: number;
  sta: number;
  cp: number;
  types: string[];
  /** Announced/datamined — not yet in the live mega feed. */
  datamined?: boolean;
  /** Explicit sprite override (e.g. local art for megas with no GO asset). */
  sprite?: string;
}

// Megas announced but not yet in the pogoapi feed. Stats are datamined; sprites
// 404 on PokeMiners until release and fall back to the placeholder. Merged in
// only when the live feed doesn't already carry that form.
const MEGA_SUPPLEMENT: Record<number, Omit<MegaInfo, "cp">[]> = {
  150: [
    { form: "X", name: "Mega Mewtwo X", atk: 399, def: 215, sta: 228, types: ["Psychic", "Fighting"], sprite: "/sprites/mega-mewtwo-x.png" },
    { form: "Y", name: "Mega Mewtwo Y", atk: 413, def: 223, sta: 228, types: ["Psychic"], sprite: "/sprites/mega-mewtwo-y.png" },
  ],
};

let megaCache: Map<number, MegaInfo[]> | null = null;

async function loadMegas(): Promise<Map<number, MegaInfo[]>> {
  if (megaCache) return megaCache;
  const map = new Map<number, MegaInfo[]>();
  try {
    const res = await fetch(MEGA_URL, {
      headers: { "User-Agent": "Mozilla/5.0 TrainerDex" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`mega feed ${res.status}`);
    const data = (await res.json()) as RawMega[];
    for (const m of data) {
      const form = m.form === "X" ? "X" : m.form === "Y" ? "Y" : "";
      const info: MegaInfo = {
        form,
        name: m.mega_name,
        atk: m.stats.base_attack,
        def: m.stats.base_defense,
        sta: m.stats.base_stamina,
        cp: hundoCp(m.stats.base_attack, m.stats.base_defense, m.stats.base_stamina),
        types: m.type.map((t) => t.replace(/^POKEMON_TYPE_/, "").replace(/^\w/, (c) => c.toUpperCase()).replace(/(\w)(\w*)/, (_, a, b) => a + b.toLowerCase())),
      };
      const arr = map.get(m.pokemon_id) ?? [];
      arr.push(info);
      map.set(m.pokemon_id, arr);
    }
  } catch {
    // leave empty on failure
  }

  // Merge in announced/datamined megas the feed doesn't carry yet.
  for (const [id, forms] of Object.entries(MEGA_SUPPLEMENT)) {
    const dex = Number(id);
    const arr = map.get(dex) ?? [];
    for (const f of forms) {
      if (arr.some((m) => m.form === f.form)) continue;
      arr.push({ ...f, cp: hundoCp(f.atk, f.def, f.sta) });
    }
    map.set(dex, arr);
  }

  megaCache = map;
  return map;
}

export interface Variant {
  key: string;
  label: string;
  sprite: string;
  badge: string; // tailwind chip classes
  /** Shiny shares base stats; megas carry their own. */
  sameAsBase?: boolean;
  /** Render a red Max-energy aura (Dynamax). */
  maxAura?: boolean;
  note?: string;
  atk?: number;
  def?: number;
  sta?: number;
  cp?: number;
  types?: string[];
}

/** All available variants for a Pokémon (excludes the default form). */
export async function getVariants(p: Pokemon): Promise<Variant[]> {
  const out: Variant[] = [];

  if (p.shiny) {
    out.push({
      key: "shiny",
      label: "Shiny",
      sprite: shinySprite(p.dex),
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      sameAsBase: true,
      note: "Shiny coloration — same stats, moves and CP as the standard form.",
    });
  }

  const megas = await loadMegas();
  for (const m of megas.get(p.dex) ?? []) {
    out.push({
      key: m.form ? `mega-${m.form.toLowerCase()}` : "mega",
      label: m.name,
      sprite: m.sprite ?? megaSprite(p.dex, m.form),
      badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
      note: m.datamined
        ? "Mega Evolution — announced, not yet in Pokémon GO. Stats are datamined."
        : "Mega Evolution — temporary, with boosted stats. Best used as a raid attacker.",
      atk: m.atk,
      def: m.def,
      sta: m.sta,
      cp: m.cp,
      types: m.types,
    });
  }

  // Fused / special Legendary forms (Necrozma fusions, Zacian/Zamazenta Crowned).
  for (const sf of specialFormsFor(p.dex)) {
    out.push({
      key: `form-${sf.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      label: sf.name,
      sprite: sf.sprite,
      badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
      note: [
        sf.note,
        sf.adventureEffect ? `Adventure Effect: ${sf.adventureEffect.move}.` : null,
        sf.datamined ? "Datamined — not yet in Pokémon GO." : null,
      ]
        .filter(Boolean)
        .join(" "),
      atk: sf.atk,
      def: sf.def,
      sta: sf.sta,
      cp: specialFormMaxCp(sf),
      types: sf.types,
    });
  }

  if (GMAX_SET.has(p.dex)) {
    out.push({
      key: "gmax",
      label: "Gigantamax",
      sprite: gmaxSprite(p.dex),
      badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
      note: "Gigantamax form — appears in Max Battles with a unique appearance and a G-Max move.",
    });
    out.push({
      key: "dmax",
      label: "Dynamax",
      sprite: `${SPRITE_BASE}/pm${p.dex}.icon.png`,
      badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
      maxAura: true,
      note: "Dynamax form — supersized for Max Battles, using powerful Max Moves.",
    });
  }

  return out;
}
