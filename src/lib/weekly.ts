// Weekly graphic data. Buckets upcoming events into Monday–Sunday weeks and,
// for each week, collects every featured Pokémon split into sections by where
// you catch it — Raids, Research, and Wild encounters — each with its
// context-correct hundo (100% IV) CP. Egg hatches are added per-week from the
// current egg pool by the poster itself.

import { getEvents, typeMeta } from "./events";
import { contextHundo, findByName, hundoCpAt, isMegaName, isShadowName, megaSpriteUrl, spriteUrl } from "./pokedex";
import { hasEnded, parseLocal } from "./time";
import type { PogoEvent } from "./types";

export type WeekSource = "raid" | "research" | "wild";

export interface WeekMon {
  name: string;
  dex?: number;
  sprite?: string;
  /** Primary catch CP (white) — L20 raid, L15 research, L30 wild, L8 shadow. */
  primaryCp: number;
  /** Secondary CP (gold) — L25 boosted, L35 boosted, or Giovanni L13 for shadow. */
  secondaryCp: number;
  secondaryLabel: string;
  shiny: boolean;
  shadow: boolean;
}

export interface WeekSection {
  key: WeekSource;
  label: string;
  emoji: string;
  mons: WeekMon[];
}

export interface WeekData {
  id: string;
  label: string;
  events: { name: string; eventType: string; emoji: string }[];
  sections: WeekSection[];
  monCount: number;
}

function mondayOf(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - dow);
  return x;
}
function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const FMT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

function sourceOf(eventType: string): WeekSource {
  if (eventType.includes("raid")) return "raid";
  if (eventType.includes("research") || eventType === "choose-your-path") return "research";
  return "wild";
}

const SECTION_META: Record<WeekSource, { label: string; emoji: string; order: number }> = {
  raid: { label: "Raid Pokémon to Catch", emoji: "🛡️", order: 0 },
  wild: { label: "Wild & Spotlight", emoji: "🔦", order: 1 },
  research: { label: "Research Encounters", emoji: "🔬", order: 2 },
};

interface RawMon {
  name: string;
  image?: string;
  shiny: boolean;
}
function eventMons(e: PogoEvent): RawMon[] {
  const out: RawMon[] = [];
  const sp = e.extraData?.spotlight;
  if (sp) {
    const list = sp.list?.length ? sp.list : [{ name: sp.name, image: sp.image, canBeShiny: sp.canBeShiny }];
    for (const m of list) out.push({ name: m.name, image: m.image, shiny: m.canBeShiny });
  }
  for (const b of e.extraData?.raidbattles?.bosses ?? []) out.push({ name: b.name, image: b.image, shiny: b.canBeShiny });
  for (const s of e.extraData?.communityday?.spawns ?? []) out.push({ name: s.name, image: s.image, shiny: true });
  return out;
}

export async function getWeeks(maxWeeks = 6): Promise<WeekData[]> {
  const events = await getEvents();
  const now = new Date();
  const live = events.filter((e) => !hasEnded(e.end, now) && eventMons(e).length > 0);

  const thisMonday = mondayOf(now);
  const byWeek = new Map<string, PogoEvent[]>();
  for (const e of live) {
    const start = parseLocal(e.start);
    const bucket = start < thisMonday ? thisMonday : mondayOf(start);
    const id = isoDate(bucket);
    (byWeek.get(id) ?? byWeek.set(id, []).get(id)!).push(e);
  }

  const weeks: WeekData[] = [];
  for (const [id, evs] of [...byWeek.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const mon = parseLocal(id);
    const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);

    const bySource = new Map<WeekSource, WeekMon[]>();
    const seen = new Set<string>();
    const eventList: WeekData["events"] = [];

    for (const e of evs) {
      eventList.push({ name: e.name, eventType: e.eventType, emoji: typeMeta(e.eventType).emoji });
      const src = sourceOf(e.eventType);
      for (const raw of eventMons(e)) {
        const dex = findByName(raw.name);
        if (!dex) continue;
        const dedupe = `${dex.dex}-${src}`;
        if (seen.has(dedupe)) continue;
        seen.add(dedupe);
        const shadow = isShadowName(raw.name);
        const mega = isMegaName(raw.name);
        const h = contextHundo(dex, e.eventType, shadow);
        bySource.set(src, [
          ...(bySource.get(src) ?? []),
          {
            name: raw.name.replace(/^shadow\s+/i, ""),
            dex: dex.dex,
            sprite: mega ? megaSpriteUrl(raw.name, dex.dex) : spriteUrl(dex.dex),
            primaryCp: h.cp,
            secondaryCp: shadow ? hundoCpAt(dex, 13) : h.boostedCp,
            secondaryLabel: shadow ? "Giovanni" : "☀️",
            shiny: raw.shiny,
            shadow,
          },
        ]);
      }
    }

    const sections: WeekSection[] = [...bySource.entries()]
      .map(([key, mons]) => ({
        key,
        label: SECTION_META[key].label,
        emoji: SECTION_META[key].emoji,
        mons: mons.sort((a, b) => b.primaryCp - a.primaryCp),
      }))
      .sort((a, b) => SECTION_META[a.key].order - SECTION_META[b.key].order);

    if (sections.length === 0) continue;

    weeks.push({
      id,
      label: `${mon.toLocaleDateString("en-US", FMT)} – ${sun.toLocaleDateString("en-US", FMT)}`,
      events: eventList,
      sections,
      monCount: sections.reduce((n, s) => n + s.mons.length, 0),
    });
  }

  return weeks.slice(0, maxWeeks);
}

export async function getWeek(id: string): Promise<WeekData | undefined> {
  const weeks = await getWeeks(52);
  return weeks.find((w) => w.id === id);
}
