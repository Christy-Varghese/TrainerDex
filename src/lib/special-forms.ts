// Fused / special Legendary forms that share a Pokédex number with their base
// but have their own typing, stats, sprite and (sometimes) an Adventure Effect.
// Data verified against pogoapi (stats/types) + PokeMiners (sprites). These show
// on the base Pokémon's detail page and resolve in raid lineups (Road of Legends).

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets";

const CPM40 = 0.7903;
function hundo(atk: number, def: number, sta: number): number {
  return Math.floor(((atk + 15) * Math.sqrt(def + 15) * Math.sqrt(sta + 15) * CPM40 * CPM40) / 10);
}

export interface SpecialForm {
  baseDex: number;
  /** Display name, e.g. "White Kyurem". */
  name: string;
  /** Lowercase lookup keys (the way the name appears in feeds/articles). */
  aliases: string[];
  types: string[];
  atk: number;
  def: number;
  sta: number;
  sprite: string;
  /** GO Adventure Effect this form can use, if any. */
  adventureEffect?: { move: string; text: string };
  /** Short blurb shown on the variant card. */
  note?: string;
  /** Stats are datamined (form/Pokémon not yet live in GO). */
  datamined?: boolean;
}

const FORMS: SpecialForm[] = [
  {
    baseDex: 646,
    name: "White Kyurem",
    aliases: ["white kyurem"],
    types: ["Dragon", "Ice"],
    atk: 310,
    def: 183,
    sta: 245,
    sprite: `${SPRITE_BASE}/pm646.fWHITE.icon.png`,
    adventureEffect: { move: "Ice Burn", text: "Fusion of Kyurem and Reshiram; a premier Dragon/Ice attacker." },
  },
  {
    baseDex: 646,
    name: "Black Kyurem",
    aliases: ["black kyurem"],
    types: ["Dragon", "Ice"],
    atk: 310,
    def: 183,
    sta: 245,
    sprite: `${SPRITE_BASE}/pm646.fBLACK.icon.png`,
    adventureEffect: { move: "Freeze Shock", text: "Fusion of Kyurem and Zekrom; a premier Dragon/Ice attacker." },
  },
  {
    baseDex: 800,
    name: "Dusk Mane Necrozma",
    aliases: ["dusk mane necrozma"],
    types: ["Psychic", "Steel"],
    atk: 277,
    def: 220,
    sta: 200,
    sprite: `${SPRITE_BASE}/pm800.fDUSK_MANE.icon.png`,
    adventureEffect: { move: "Sunsteel Strike", text: "Necrozma fused with Solgaleo — bulky Psychic/Steel." },
  },
  {
    baseDex: 800,
    name: "Dawn Wings Necrozma",
    aliases: ["dawn wings necrozma"],
    types: ["Psychic", "Ghost"],
    atk: 277,
    def: 220,
    sta: 200,
    sprite: `${SPRITE_BASE}/pm800.fDAWN_WINGS.icon.png`,
    adventureEffect: { move: "Moongeist Beam", text: "Necrozma fused with Lunala — bulky Psychic/Ghost." },
  },
  {
    baseDex: 888,
    name: "Crowned Sword Zacian",
    aliases: ["crowned sword zacian", "zacian crowned sword", "zacian crowned"],
    types: ["Fairy", "Steel"],
    atk: 332,
    def: 240,
    sta: 192,
    sprite: `${SPRITE_BASE}/pm888.fCROWNED_SWORD.icon.png`,
    note: "Zacian wielding the Rusted Sword — a premier Fairy attacker with huge Attack.",
  },
  {
    baseDex: 889,
    name: "Crowned Shield Zamazenta",
    aliases: ["crowned shield zamazenta", "zamazenta crowned shield", "zamazenta crowned"],
    types: ["Fighting", "Steel"],
    atk: 250,
    def: 292,
    sta: 192,
    sprite: `${SPRITE_BASE}/pm889.fCROWNED_SHIELD.icon.png`,
    note: "Zamazenta bearing the Rusted Shield — an extremely bulky Fighting/Steel wall.",
  },
];

export const SPECIAL_FORMS = FORMS;

const BY_ALIAS = new Map<string, SpecialForm>();
for (const f of FORMS) for (const a of f.aliases) BY_ALIAS.set(a, f);

/** Resolve a feed/article name (e.g. "White Kyurem") to its special form. */
export function findSpecialForm(name: string): SpecialForm | undefined {
  return BY_ALIAS.get(name.trim().toLowerCase());
}

/** Special forms attached to a base Pokédex number (for the detail page). */
export function specialFormsFor(dex: number): SpecialForm[] {
  return FORMS.filter((f) => f.baseDex === dex);
}

export function specialFormMaxCp(f: SpecialForm): number {
  return hundo(f.atk, f.def, f.sta);
}

// ---- Adventure Effects (GO) — special charged moves on certain Legendaries ---
export interface AdventureEffect {
  move: string;
  text: string;
}

// Keyed by base Pokédex number. Verified GO Adventure Effects.
const ADVENTURE_EFFECTS: Record<number, AdventureEffect> = {
  483: { move: "Roar of Time", text: "Origin Forme Dialga's Adventure Effect — a devastating Dragon charged move." },
  484: { move: "Spacial Rend", text: "Origin Forme Palkia's Adventure Effect — a powerful Dragon charged move." },
  487: { move: "Shadow Force", text: "Origin Forme Giratina's Adventure Effect — a hard-hitting Ghost charged move." },
  646: { move: "Glaciate", text: "Kyurem's Adventure Effect — a wide-area Ice charged move." },
};

export function adventureEffectFor(dex: number): AdventureEffect | undefined {
  return ADVENTURE_EFFECTS[dex];
}
