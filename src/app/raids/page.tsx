import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RaidsBrowser from "@/components/RaidsBrowser";
import { type RaidWeek, type WeekBoss } from "@/components/RaidCalendar";
import Icon from "@/components/Icon";
import { getRaids, tierMeta, RAID_BOSS_SUPPLEMENT } from "@/lib/raids";
import { getEvents } from "@/lib/events";
import type { Pokemon } from "@/lib/pokedex";
import { findByName, hundoCpAt, spriteUrl } from "@/lib/pokedex";
import { getRoadOfLegendsDays, type RoLDay, type RoLTier } from "@/lib/road-of-legends";
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

/**
 * Like findByName but also handles trailing variant letters such as
 * "Mega Mewtwo X" / "Mega Mewtwo Y" where normalizeName leaves "Mewtwo X"
 * (not in the dex). Strips the trailing letter and retries.
 */
function resolveForCp(name: string): Pokemon | undefined {
  const direct = findByName(name);
  if (direct) return direct;
  const stripped = name.replace(/\s+[A-Z]$/, "").trim();
  if (stripped !== name) return findByName(stripped);
  return undefined;
}

const TYPE_WEATHER: Record<string, string> = {
  Normal: "Partly Cloudy", Rock: "Partly Cloudy",
  Fighting: "Cloudy",  Poison: "Cloudy",  Fairy: "Cloudy",
  Flying: "Windy",     Psychic: "Windy",  Dragon: "Windy",
  Bug: "Rainy",        Water: "Rainy",    Electric: "Rainy",
  Fire: "Sunny",       Grass: "Sunny",    Ground: "Sunny",
  Ice: "Snow",         Steel: "Snow",
  Ghost: "Fog",        Dark: "Fog",
};

function weatherFromTypes(types: string[]): string[] {
  return [...new Set(types.map((t) => TYPE_WEATHER[t]).filter(Boolean))];
}

export const revalidate = 3600;

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
  const thisWeekStart = weekStart(now);
  const weekMap = new Map<string, RaidWeek>();

  // Current week: shadow bosses get tier "Shadow" so they render in their own section.
  const currentBosses: WeekBoss[] = raids.map((r) => {
    const pokemon = resolveForCp(r.name);
    const isShadow = r.name.startsWith("Shadow ");
    const types = pokemon?.types ?? r.types.map((t) => t.name);
    return {
      name: r.name,
      image: r.image,
      dex: pokemon?.dex,
      tier: isShadow ? "Shadow" : tierMeta(r.tier).short,
      canBeShiny: r.canBeShiny,
      cp: pokemon ? hundoCpAt(pokemon, 20) : undefined,
      boostedCp: pokemon ? hundoCpAt(pokemon, 25) : undefined,
      types,
      weatherBoost: weatherFromTypes(types),
    };
  });
  weekMap.set(thisWeekStart.toISOString(), {
    id: thisWeekStart.toISOString(),
    label: weekLabel(thisWeekStart),
    current: true,
    bosses: currentBosses,
  });

  const PM_BASE =
    "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets";

  // ScrapedDuck's raidbattles.bosses entries always ship with tier: null.
  // Derive the correct tier from the boss name first, then from the event ID/type.
  function inferTier(bossName: string, bTier: string | null | undefined, eventId: string, eventType: string): string {
    if (bTier) return bTier;
    const n = bossName.toLowerCase();
    if (n.startsWith("mega ")) return "Mega";
    if (n.startsWith("shadow ")) return "Shadow";
    const id = eventId.toLowerCase();
    if (id.includes("shadow")) return "Shadow";
    if (id.includes("mega")) return "Mega";
    if (id.includes("5-star") || id.includes("five-star")) return "5★";
    if (id.includes("3-star") || id.includes("three-star")) return "3★";
    if (id.includes("1-star") || id.includes("one-star")) return "1★";
    if (eventType === "raid-hour") return "5★";
    return "5★"; // safe default
  }

  // ScrapedDuck names shadow raid bosses without the "Shadow " prefix
  // (e.g. "shadow-palkia-in-shadow-raids-july-2026" sends name "Palkia").
  // Restore the prefix so the UI shows the shadow badge correctly.
  function normalizeRaidBossName(bossName: string, eventId: string): string {
    const id = eventId.toLowerCase();
    if (id.includes("shadow") && !bossName.toLowerCase().startsWith("shadow ")) {
      return `Shadow ${bossName}`;
    }
    return bossName;
  }

  for (const e of events) {
    if (hasEnded(e.end, now)) continue;

    const isRaidType = e.eventType.includes("raid") || e.eventType === "pokemon-go-fest";
    const supp = RAID_BOSS_SUPPLEMENT[e.eventID];
    if (!isRaidType && !supp) continue;

    const feedBosses = e.extraData?.raidbattles?.bosses ?? [];
    const activeBosses = feedBosses.length ? feedBosses : (supp ?? []);
    if (!activeBosses.length) continue;

    const ws = weekStart(parseLocal(e.start));
    if (ws.getTime() < thisWeekStart.getTime()) continue;
    const key = ws.toISOString();
    const wk =
      weekMap.get(key) ??
      weekMap
        .set(key, {
          id: key,
          label: weekLabel(ws),
          current: key === thisWeekStart.toISOString(),
          bosses: [],
          eventName: e.eventType === "pokemon-go-fest" ? e.name : undefined,
        })
        .get(key)!;

    const eventDate = e.start.substring(0, 10);
    const eventTime =
      e.eventType === "raid-day"
        ? "2:00 – 5:00 PM"
        : e.eventType === "raid-hour"
          ? "6:00 – 7:00 PM"
          : undefined;
    const isSpecialDay = e.eventType === "raid-day" || e.eventType === "raid-hour";

    for (const b of activeBosses) {
      const rawName = "asset" in b ? b.name : normalizeRaidBossName(b.name, e.eventID);
      if (wk.bosses.some((x) => x.name === rawName)) continue;
      const tier = "asset" in b ? b.tier : inferTier(rawName, b.tier as string | null | undefined, e.eventID, e.eventType);
      const pokemon = resolveForCp(rawName);
      const dex = pokemon?.dex;
      const image =
        "asset" in b
          ? `${PM_BASE}/${b.asset}`
          : (b as { image?: string }).image || (dex ? spriteUrl(dex) : "");
      const cp = pokemon ? hundoCpAt(pokemon, 20) : undefined;
      const boostedCp = pokemon ? hundoCpAt(pokemon, 25) : undefined;
      const types = pokemon?.types ?? [];
      wk.bosses.push({
        name: rawName,
        image,
        dex,
        tier,
        canBeShiny: b.canBeShiny,
        cp,
        boostedCp,
        types,
        weatherBoost: weatherFromTypes(types),
        eventDate: isSpecialDay ? eventDate : undefined,
        eventTime: isSpecialDay ? eventTime : undefined,
      });
    }
  }

  // ── Skarmory Super Mega Raid Day fallback (Jun 27, current week) ─────────
  if (!hasEnded("2026-06-27T17:00:00", now)) {
    const currentWk = weekMap.get(thisWeekStart.toISOString());
    if (currentWk && !currentWk.bosses.some((b) => b.name === "Skarmory")) {
      const supp = RAID_BOSS_SUPPLEMENT["skarmory-super-mega-raid-day-2026"];
      if (supp) {
        for (const b of supp) {
          const pokemon = resolveForCp(b.name);
          const dex = pokemon?.dex;
          currentWk.bosses.push({
            name: b.name,
            image: `${PM_BASE}/${b.asset}`,
            dex,
            tier: b.tier,
            canBeShiny: b.canBeShiny,
            cp: pokemon ? hundoCpAt(pokemon, 20) : undefined,
            boostedCp: pokemon ? hundoCpAt(pokemon, 25) : undefined,
            types: pokemon?.types ?? [],
            weatherBoost: weatherFromTypes(pokemon?.types ?? []),
            eventDate: "2026-06-27",
            eventTime: "2:00 – 5:00 PM",
          });
        }
      }
    }
  }

  // ── GO Fest Global guaranteed fallback ────────────────────────────────────
  // The live ScrapedDuck feed may ship a slightly different event ID or an
  // empty boss list. Inject from supplement if the week slot is still empty.
  if (!hasEnded("2026-07-12T19:00:00", now)) {
    const gofestWs = weekStart(new Date(2026, 6, 11)); // Jul 11 → week of Jul 7
    const gofestKey = gofestWs.toISOString();
    const existing = weekMap.get(gofestKey);
    if (!existing?.bosses.length) {
      const supp = RAID_BOSS_SUPPLEMENT["pokemon-go-fest-2026-global"];
      if (supp) {
        const wk: RaidWeek = existing ?? {
          id: gofestKey,
          label: weekLabel(gofestWs),
          current: gofestKey === thisWeekStart.toISOString(),
          bosses: [],
          eventName: "GO Fest 2026: Global",
        };
        if (!existing) weekMap.set(gofestKey, wk);
        for (const b of supp) {
          const pokemon = resolveForCp(b.name);
          const dex = pokemon?.dex;
          const image = `${PM_BASE}/${b.asset}`;
          const cp = pokemon ? hundoCpAt(pokemon, 20) : undefined;
          const boostedCp = pokemon ? hundoCpAt(pokemon, 25) : undefined;
          const types = pokemon?.types ?? [];
          wk.bosses.push({
            name: b.name,
            image,
            dex,
            tier: b.tier,
            canBeShiny: b.canBeShiny,
            cp,
            boostedCp,
            types,
            weatherBoost: weatherFromTypes(types),
          });
        }
      }
    }
  }

  // Road of Legends — shown day-by-day alongside any bosses already in that week.
  const rolDays = getRoadOfLegendsDays();
  if (rolDays.length > 0) {
    const ws = weekStart(parseLocal(`${rolDays[0].date}T00:00:00`));
    if (ws.getTime() >= thisWeekStart.getTime()) {
      const key = ws.toISOString();
      const existing = weekMap.get(key);
      if (existing) {
        // Merge days into the existing week (e.g. GO Fest week) without overwriting bosses.
        existing.days = rolDays;
        if (!existing.eventName) existing.eventName = "Road of Legends";
      } else {
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
  }

  // ── GO Fest day view — split bosses into Saturday (Jul 11) and Sunday (Jul 12) ──
  // Names that appear on Saturday; everything else is Sunday.
  const GOFEST_SAT = new Set([
    "Mega Mewtwo X",
    "Mega Ampharos", "Mega Gengar", "Mega Aerodactyl", "Mega Blaziken",
    "Mega Swampert", "Mega Abomasnow", "Mega Alakazam", "Mega Pidgeot", "Mega Salamence",
    "Articuno", "Zapdos", "Moltres", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh",
    "Kyogre", "Groudon", "Rayquaza", "Uxie", "Mesprit", "Azelf",
    "Dialga", "Palkia", "Reshiram", "Zekrom", "Kyurem", "Xerneas", "Yveltal",
    "Solgaleo", "Lunala", "Giratina",
  ]);
  function bossesToRolTiers(bosses: WeekBoss[]): RoLTier[] {
    const TIER_SLOTS = ["Super Mega", "Mega", "5★"] as const;
    const byTier = new Map<string, WeekBoss[]>();
    for (const b of bosses) {
      const t = b.tier ?? "5★";
      byTier.set(t, [...(byTier.get(t) ?? []), b]);
    }
    return TIER_SLOTS.filter((t) => byTier.has(t)).map((t) => ({
      tier: t,
      bosses: byTier.get(t)!.map((b) => ({
        name: b.name,
        shiny: b.canBeShiny,
        dex: b.dex,
        sprite: b.image,
      })),
    }));
  }
  const gofestWk = weekMap.get(weekStart(new Date(2026, 6, 11)).toISOString());
  if (gofestWk && gofestWk.bosses.length > 0) {
    const satBosses = gofestWk.bosses.filter((b) => GOFEST_SAT.has(b.name));
    const sunBosses = gofestWk.bosses.filter((b) => !GOFEST_SAT.has(b.name));
    const gofestDays: RoLDay[] = [
      { label: "Saturday, July 11", date: "2026-07-11", tiers: bossesToRolTiers(satBosses) },
      { label: "Sunday, July 12",   date: "2026-07-12", tiers: bossesToRolTiers(sunBosses) },
    ];
    gofestWk.days = [...(gofestWk.days ?? []), ...gofestDays];
    gofestWk.bosses = [];
  }

  const weeks = [...weekMap.values()].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 8);

  return (
    <>
      <Header active="raids" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <section className="mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-rose-500 to-red-600 p-6 shadow-lg shadow-rose-200 sm:p-8">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-rose-100">
            Raid Battle Guide
          </p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Current Raid Bosses</h1>
          <p className="mt-2 max-w-2xl text-rose-100">
            Every active boss with its <strong className="text-white">hundo CP</strong> — the exact
            CP a 100% IV catch shows. Memorize it and you&apos;ll know a perfect catch the moment
            the encounter loads. The boosted value is the weather-boosted hundo.
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

        {/* Unified raid view — week selector top-right, tier sections, no separate calendar */}
        <RaidsBrowser raids={raids} weeks={weeks} />
      </main>

      <Footer />
    </>
  );
}
