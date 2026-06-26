// Special Background eligibility. Since January 2026, the featured Pokémon of a
// Community Day can have a yearly Special Background (per the official articles).
// We derive the eligible set from the Community Day news we've collected — the
// featured Pokémon named in each Community Day headline.

import { NEWS } from "./news";
import { extractPokemon } from "./pokedex";

const SET = new Set<number>();
for (const n of NEWS) {
  if (n.category !== "community-day") continue;
  const featured = extractPokemon([n.title], 1); // first mon named in the title
  for (const m of featured) SET.add(m.pokemon.dex);
}

/** True if a Pokémon is eligible for an event Special Background. */
export function isSpecialBackground(dex: number): boolean {
  return SET.has(dex);
}

export const SPECIAL_BG_DEX = [...SET];
