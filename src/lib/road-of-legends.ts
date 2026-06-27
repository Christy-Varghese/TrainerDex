import { getArticle } from "./news";
import { findByName } from "./pokedex";
import { findSpecialForm } from "./special-forms";

// Parse the Road of Legends article into a day-by-day raid distribution. The
// official article lists, per day, the raid tiers (Five-Star / Mega / Primal)
// and the Pokémon appearing (a trailing "*" marks shiny-eligible). We turn that
// prose into structured days so the raids calendar can show the event by day
// rather than as one flat week.

const SLUG = "road-of-legends-2026";

export interface RoLBoss {
  name: string;
  shiny: boolean;
  dex?: number;
  /** Form-specific sprite (fused/special forms); falls back to base in the UI. */
  sprite?: string;
  /** Form-specific GO stats — set when a SpecialForm overrides the base Pokédex entry. */
  stats?: { atk: number; def: number; sta: number };
}
export interface RoLTier {
  tier: string; // "5★" | "Mega" | "Primal"
  bosses: RoLBoss[];
}
export interface RoLDay {
  label: string; // "Monday, July 6"
  date: string; // ISO yyyy-mm-dd
  tiers: RoLTier[];
}

const DAY_RE = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+([A-Za-z]+)\s+(\d{1,2})$/;
const MONTHS: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

function tierFromHeader(t: string): string | null {
  if (/five-star/i.test(t)) return "5★";
  if (/mega raids?/i.test(t)) return "Mega";
  if (/primal raids?/i.test(t)) return "Primal";
  return null;
}

let cache: RoLDay[] | null = null;

/** Structured day-by-day Road of Legends raid schedule (empty if unparseable). */
export function getRoadOfLegendsDays(): RoLDay[] {
  if (cache) return cache;
  const blocks = getArticle(SLUG);
  const days: RoLDay[] = [];
  if (!blocks) {
    cache = days;
    return days;
  }

  let curDay: RoLDay | null = null;
  let curTier: RoLTier | null = null;
  let started = false;

  for (const b of blocks) {
    const text = (b.type === "heading" || b.type === "p" ? b.text : undefined)?.trim();
    if (!text) {
      // A non-text block (list/heading) after the schedule ends the section.
      if (started && b.type === "heading") break;
      continue;
    }
    if (!started) {
      if (/following Pok.mon will appear in raids/i.test(text)) started = true;
      continue;
    }
    // Section ends at the next real heading.
    if (b.type === "heading") break;

    const dayMatch = text.match(DAY_RE);
    if (dayMatch) {
      const [, , monthName, dayNum] = dayMatch;
      const month = MONTHS[monthName] ?? 7;
      curDay = {
        label: text,
        date: `2026-${String(month).padStart(2, "0")}-${String(Number(dayNum)).padStart(2, "0")}`,
        tiers: [],
      };
      days.push(curDay);
      curTier = null;
      continue;
    }

    const tier = tierFromHeader(text);
    if (tier && curDay) {
      curTier = { tier, bosses: [] };
      curDay.tiers.push(curTier);
      continue;
    }

    // Otherwise a Pokémon line. Default tier = 5★ if none seen yet.
    if (curDay) {
      if (!curTier) {
        curTier = { tier: "5★", bosses: [] };
        curDay.tiers.push(curTier);
      }
      const shiny = text.endsWith("*");
      const raw = text.replace(/\*$/, "").trim();
      // Skip region annotations that aren't a Pokémon (e.g. plain "(Asia-Pacific)").
      const name = raw.replace(/\s*\([^)]*\)\s*$/, "").trim();
      if (!name) continue;
      const sf = findSpecialForm(name);
      const dex = sf?.baseDex ?? findByName(name)?.dex;
      // Skip lines that aren't a Pokémon — footnotes ("*If you're lucky…"),
      // "Note: …" and other prose can trail the last day before the next
      // heading and would otherwise render as empty placeholder boxes.
      if (dex === undefined) continue;
      const stats = sf ? { atk: sf.atk, def: sf.def, sta: sf.sta } : undefined;
      curTier.bosses.push({ name: raw, shiny, dex, sprite: sf?.sprite, stats });
    }
  }

  cache = days;
  return days;
}
