import type { EventType, PogoEvent } from "./types";
import type { IconName } from "@/components/Icon";
import { SEED_EVENTS } from "./seed-events";

// Public community feed (Leek Duck data, scraped + normalized). Facts only —
// we render them in our own UI. Attribute the source in the footer.
const FEED_URL = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.json";

/**
 * Fetch the live events feed, revalidated hourly by Next's data cache. Falls
 * back to the bundled seed dataset if the network is unavailable or the feed
 * shape is unexpected, so the site always renders something useful.
 */
export async function getEvents(): Promise<PogoEvent[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const data = (await res.json()) as PogoEvent[];
    if (!Array.isArray(data) || data.length === 0) throw new Error("empty feed");
    return data;
  } catch {
    return SEED_EVENTS;
  }
}

/** Single event by ID for the `/events/[id]` detail page. */
export async function getEvent(id: string): Promise<PogoEvent | undefined> {
  const events = await getEvents();
  return events.find((e) => e.eventID === id);
}

// ---- Display metadata per event type: color + emoji for fast visual scanning.

interface TypeMeta {
  label: string;
  emoji: string;
  /** SVG icon name for app-UI chrome (emoji kept for PNG poster pages). */
  icon: IconName;
  /** Tailwind classes for the accent (border/badge). */
  accent: string;
  badge: string;
}

// Keys match the real ScrapedDuck `eventType` strings (verified against the live
// feed). Unknown/future types fall through to FALLBACK_META.
const TYPE_META: Record<string, TypeMeta> = {
  "community-day": { label: "Community Day", emoji: "🌟", icon: "star", accent: "border-amber-400", badge: "bg-amber-100 text-amber-700" },
  "pokemon-spotlight-hour": { label: "Spotlight Hour", emoji: "🔦", icon: "spotlight", accent: "border-yellow-400", badge: "bg-yellow-100 text-yellow-700" },
  "raid-hour": { label: "Raid Hour", emoji: "⚔️", icon: "shield", accent: "border-rose-400", badge: "bg-rose-100 text-rose-700" },
  "raid-battles": { label: "Raids", emoji: "🛡️", icon: "shield", accent: "border-rose-400", badge: "bg-rose-100 text-rose-700" },
  "raid-day": { label: "Raid Day", emoji: "🐉", icon: "shield", accent: "border-rose-500", badge: "bg-rose-100 text-rose-700" },
  "max-mondays": { label: "Max Monday", emoji: "🍄", icon: "flame", accent: "border-red-400", badge: "bg-red-100 text-red-700" },
  "choose-your-path": { label: "Choose Your Path", emoji: "🧭", icon: "globe", accent: "border-indigo-400", badge: "bg-indigo-100 text-indigo-700" },
  "go-pass": { label: "GO Pass", emoji: "🎟️", icon: "star", accent: "border-lime-400", badge: "bg-lime-100 text-lime-700" },
  "pokemon-go-fest": { label: "GO Fest", emoji: "🎆", icon: "sparkles", accent: "border-fuchsia-400", badge: "bg-fuchsia-100 text-fuchsia-700" },
  research: { label: "Research", emoji: "🔬", icon: "lightbulb", accent: "border-sky-400", badge: "bg-sky-100 text-sky-700" },
  "research-breakthrough": { label: "Breakthrough", emoji: "📅", icon: "calendar", accent: "border-sky-400", badge: "bg-sky-100 text-sky-700" },
  "go-battle-league": { label: "GO Battle League", emoji: "🥊", icon: "shield", accent: "border-violet-400", badge: "bg-violet-100 text-violet-700" },
  event: { label: "Event", emoji: "🎉", icon: "calendar", accent: "border-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
  season: { label: "Season", emoji: "☀️", icon: "sun", accent: "border-teal-400", badge: "bg-teal-100 text-teal-700" },
  "ticketed-event": { label: "Ticketed", emoji: "🎫", icon: "star", accent: "border-fuchsia-400", badge: "bg-fuchsia-100 text-fuchsia-700" },
  "live-event": { label: "Live Event", emoji: "🎆", icon: "sparkles", accent: "border-fuchsia-400", badge: "bg-fuchsia-100 text-fuchsia-700" },
};

const FALLBACK_META: TypeMeta = {
  label: "Event",
  emoji: "🎉",
  icon: "calendar",
  accent: "border-slate-400",
  badge: "bg-slate-100 text-slate-700",
};

export function typeMeta(t: EventType): TypeMeta {
  return TYPE_META[t] ?? FALLBACK_META;
}
