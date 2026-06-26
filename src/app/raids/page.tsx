import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RaidsBrowser from "@/components/RaidsBrowser";
import RaidCalendar, { type RaidWeek, type WeekBoss } from "@/components/RaidCalendar";
import Icon from "@/components/Icon";
import { getRaids, tierMeta } from "@/lib/raids";
import { getEvents } from "@/lib/events";
import { findByName, spriteUrl } from "@/lib/pokedex";
import { getRoadOfLegendsDays } from "@/lib/road-of-legends";
import { hasEnded, parseLocal } from "@/lib/time";

/** Monday 00:00 of the week containing `d`. */
function weekStart(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const dow = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - dow);
  return x;
}

function weekLabel(start: Date): string {
  return `Week of ${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export const revalidate = 3600; // refresh the raid rotation hourly

export const metadata: Metadata = {
  title: "Raid Bosses & Hundo CP — TrainerDex",
  description:
    "Current Pokémon GO raid bosses with 100% IV (hundo) CP references and weather-boosted ranges. Know on the catch screen if it's perfect.",
};

export default async function RaidsPage() {
  const [raids, events] = await Promise.all([getRaids(), getEvents()]);
  const shiny = raids.filter((r) => r.canBeShiny).length;
  const now = new Date();

  // ---- Build the week calendar -------------------------------------------
  // "This week" = the live rotation. Future weeks come from dated raid events
  // (Raid Day / Raid Hour / raid battles) that carry boss lists.
  const thisWeekStart = weekStart(now);
  const weekMap = new Map<string, RaidWeek>();

  const currentBosses: WeekBoss[] = raids.map((r) => ({
    name: r.name,
    image: r.image,
    dex: findByName(r.name)?.dex,
    tier: tierMeta(r.tier).short,
    canBeShiny: r.canBeShiny,
  }));
  weekMap.set(thisWeekStart.toISOString(), {
    id: thisWeekStart.toISOString(),
    label: weekLabel(thisWeekStart),
    current: true,
    bosses: currentBosses,
  });

  for (const e of events) {
    if (!e.eventType.includes("raid")) continue;
    if (hasEnded(e.end, now)) continue;
    const bosses = e.extraData?.raidbattles?.bosses;
    if (!bosses?.length) continue;
    const ws = weekStart(parseLocal(e.start));
    if (ws.getTime() < thisWeekStart.getTime()) continue;
    const key = ws.toISOString();
    const wk =
      weekMap.get(key) ??
      weekMap.set(key, { id: key, label: weekLabel(ws), current: key === thisWeekStart.toISOString(), bosses: [] }).get(key)!;
    for (const b of bosses) {
      if (wk.bosses.some((x) => x.name === b.name)) continue;
      const dex = findByName(b.name)?.dex;
      wk.bosses.push({
        name: b.name,
        image: b.image || (dex ? spriteUrl(dex) : ""),
        dex,
        tier: b.tier,
        canBeShiny: b.canBeShiny,
      });
    }
  }

  // Road of Legends — a dedicated week shown day-by-day (parsed from the article).
  const rolDays = getRoadOfLegendsDays();
  if (rolDays.length > 0) {
    const ws = weekStart(parseLocal(`${rolDays[0].date}T00:00:00`));
    if (ws.getTime() >= thisWeekStart.getTime()) {
      const key = ws.toISOString();
      weekMap.set(key, {
        id: key,
        label: weekLabel(ws),
        current: key === thisWeekStart.toISOString(),
        bosses: [],
        days: rolDays,
        eventName: "Road of Legends",
      });
    }
  }

  const weeks = [...weekMap.values()].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 6);

  return (
    <>
      <Header active="raids" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <section className="mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-rose-500 to-red-600 p-6 sm:p-8 shadow-lg shadow-rose-200">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-rose-100">Raid Battle Guide</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Current Raid Bosses</h1>
          <p className="mt-2 max-w-2xl text-rose-100">
            Every active boss with its <strong className="text-white">hundo CP</strong> — the exact CP a 100% IV
            catch shows. Memorize it and you&apos;ll know a perfect catch the moment the encounter loads. The
            boosted value is the weather-boosted hundo.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="shield" /> {raids.length} bosses
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="sparkles" /> {shiny} can be shiny
            </span>
          </div>
        </section>

        <RaidCalendar weeks={weeks} />

        <RaidsBrowser raids={raids} />
      </main>

      <Footer />
    </>
  );
}
