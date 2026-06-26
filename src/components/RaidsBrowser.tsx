"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Raid } from "@/lib/raids";
import { tierMeta } from "@/lib/raids";
import type { RaidWeek, WeekBoss } from "./RaidCalendar";
import type { RoLDay } from "@/lib/road-of-legends";
import RaidCard from "./RaidCard";
import SpriteImage from "./SpriteImage";
import ShadowBadge from "./ShadowBadge";
import Icon from "./Icon";
import { spriteUrl, findByName, hundoCpAt } from "@/lib/pokedex";

const TIER_ORDER = ["Super Mega", "Mega", "5★", "3★", "1★", "Shadow"];
const MONTH_DAY: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, MONTH_DAY);
}

function shortLabel(label: string) {
  return label.replace("Week of ", "");
}

function weekPillLabel(w: RaidWeek): string {
  if (w.current) return "This week";
  if (w.eventName) {
    const n = w.eventName;
    if (n.includes("GO Fest")) return "GO Fest";
    if (n.length <= 18) return n;
    return n.slice(0, 17) + "…";
  }
  return shortLabel(w.label);
}

type Props = {
  raids: Raid[];
  weeks: RaidWeek[];
};

/** Unified raid boss view — week selector top-right, tier sections below. */
export default function RaidsBrowser({ raids, weeks }: Props) {
  const currentWeekId = weeks.find((w) => w.current)?.id ?? weeks[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(currentWeekId);

  const week = useMemo(
    () => weeks.find((w) => w.id === selectedId) ?? weeks[0],
    [weeks, selectedId],
  );
  const isCurrentWeek = week?.current ?? false;

  // Group live-rotation raids by tier; shadow bosses get their own "Shadow" section.
  const currentGroups = useMemo(() => {
    const sorted = [...raids].sort((a, b) => {
      const ak = a.name.startsWith("Shadow ") ? "Shadow" : tierMeta(a.tier).short;
      const bk = b.name.startsWith("Shadow ") ? "Shadow" : tierMeta(b.tier).short;
      const ai = TIER_ORDER.indexOf(ak);
      const bi = TIER_ORDER.indexOf(bk);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.name.localeCompare(b.name);
    });
    const map = new Map<string, Raid[]>();
    for (const r of sorted) {
      const key = r.name.startsWith("Shadow ") ? "Shadow" : tierMeta(r.tier).short;
      const arr = map.get(key) ?? [];
      arr.push(r);
      map.set(key, arr);
    }
    return map;
  }, [raids]);

  // Extra bosses in the current week's supplement (e.g. a Raid Day happening
  // this week like Skarmory Super Mega) that aren't in the live rotation.
  const extraCurrentGroups = useMemo(() => {
    const currentWeek = weeks.find((w) => w.current);
    const raidNames = new Set(raids.map((r) => r.name));
    const map = new Map<string, WeekBoss[]>();
    for (const b of currentWeek?.bosses ?? []) {
      if (raidNames.has(b.name)) continue;
      const key = b.tier ?? "Other";
      const arr = map.get(key) ?? [];
      arr.push(b);
      map.set(key, arr);
    }
    return map;
  }, [raids, weeks]);

  // All tier keys present in the current week across both groups.
  const currentTiers = useMemo(() => {
    const set = new Set([...currentGroups.keys(), ...extraCurrentGroups.keys()]);
    return TIER_ORDER.filter((t) => set.has(t));
  }, [currentGroups, extraCurrentGroups]);

  // Group upcoming-week bosses by tier.
  const futureGroups = useMemo(() => {
    const map = new Map<string, WeekBoss[]>();
    for (const b of week?.bosses ?? []) {
      const key = b.tier ?? "Other";
      const arr = map.get(key) ?? [];
      arr.push(b);
      map.set(key, arr);
    }
    return map;
  }, [week]);

  return (
    <section>
      {/* Header — title left, week pills RIGHT (the "red box" slot) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isCurrentWeek ? "Active Raid Bosses" : (week?.eventName ?? week?.label ?? "")}
        </h2>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2">
            {weeks.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedId(w.id)}
                className={[
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400",
                  w.id === selectedId
                    ? "bg-rose-500 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-rose-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
                ].join(" ")}
              >
                {weekPillLabel(w)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {week?.days?.length ? (
        /* Road of Legends day-by-day, with GO Fest bosses below when in the same week */
        <div>
          <DayDistribution eventName="Road of Legends" days={week.days} />
          {!isCurrentWeek && !!week.bosses.length && (
            <div className="mt-10 space-y-10 border-t border-slate-100 pt-10 dark:border-white/10">
              {week.eventName && (
                <p className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300">
                  {week.eventName} Raids
                </p>
              )}
              {TIER_ORDER.map((tier) => {
                const bosses = futureGroups.get(tier);
                if (!bosses?.length) return null;
                return (
                  <TierSection key={tier} tier={tier}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {bosses.map((b) => (
                        <WeekBossCard key={b.name} boss={b} />
                      ))}
                    </div>
                  </TierSection>
                );
              })}
            </div>
          )}
        </div>
      ) : isCurrentWeek ? (
        <div className="space-y-10">
          {currentTiers.map((tier) => {
            const richBosses = currentGroups.get(tier);
            const extraBosses = extraCurrentGroups.get(tier);
            if (!richBosses?.length && !extraBosses?.length) return null;
            return (
              <TierSection key={tier} tier={tier}>
                {/* Supplement-only bosses (e.g. Super Mega Raid Day this week) */}
                {extraBosses?.length ? (
                  <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3${richBosses?.length ? " mb-4" : ""}`}>
                    {extraBosses.map((b) => (
                      <WeekBossCard key={b.name} boss={b} />
                    ))}
                  </div>
                ) : null}
                {/* Live rotation bosses with full data */}
                {richBosses?.length ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {richBosses.map((r) => (
                      <RaidCard key={r.name} raid={r} />
                    ))}
                  </div>
                ) : null}
              </TierSection>
            );
          })}
        </div>
      ) : week?.bosses.length ? (
        <div className="space-y-10">
          {TIER_ORDER.map((tier) => {
            const bosses = futureGroups.get(tier);
            if (!bosses?.length) return null;
            return (
              <TierSection key={tier} tier={tier}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {bosses.map((b) => (
                    <WeekBossCard key={b.name} boss={b} />
                  ))}
                </div>
              </TierSection>
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-400 dark:border-white/15 dark:bg-white/5">
          No raid bosses announced for this week yet.
        </p>
      )}
    </section>
  );
}

// ─── Tier section header ──────────────────────────────────────────────────────

function TierSection({ tier, children }: { tier: string; children: React.ReactNode }) {
  const tm = tierMeta(tier);
  const isShadow = tier === "Shadow";
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${tm.badge}`}
        >
          {isShadow && <ShadowBadge size={4} />}
          {isShadow ? "Shadow Raids" : `${tm.short} Raids`}
        </span>
        <div className="h-px flex-1 bg-slate-100 dark:bg-white/10" />
      </div>
      {children}
    </div>
  );
}

// ─── Enriched boss card matching the RaidCard layout ─────────────────────────

function WeekBossCard({ boss }: { boss: WeekBoss }) {
  const { name, image, dex, canBeShiny, cp, boostedCp, types, weatherBoost, eventDate, eventTime, tier } = boss;
  const isShadow = name.startsWith("Shadow ");
  const isMega = !isShadow && name.startsWith("Mega ");
  const displayName = isShadow ? name.slice(7) : isMega ? name.slice(5) : name;
  const tm = tier ? tierMeta(tier) : null;

  const inner = (
    <div className="flex flex-col p-4">
      {/* Sprite row */}
      <div className="flex items-start gap-3">
        <div className={`relative grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-slate-100 ring-2 dark:bg-white/10 ${tm?.ring ?? "ring-slate-200"}`}>
          <SpriteImage src={image} alt={displayName} size={56} className="h-14 w-14 drop-shadow-sm" />
          {isShadow && (
            <span className="absolute -bottom-2 -right-2">
              <ShadowBadge size={4} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            {tm && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tm.badge}`}>
                {tm.short}
              </span>
            )}
            {canBeShiny && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                <Icon name="sparkles" /> Shiny
              </span>
            )}
          </div>
          <h3 className="truncate font-semibold text-slate-900 dark:text-white">{displayName}</h3>
          {types && types.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {types.map((t) => (
                <span key={t} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium capitalize text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event date badge for Raid Days / Raid Hours */}
      {eventDate && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            <Icon name="calendar" className="h-3 w-3" />
            {fmtDate(eventDate)}{eventTime ? ` · ${eventTime}` : ""}
          </span>
        </div>
      )}

      {/* Hundo CP + Boosted CP */}
      {(cp !== undefined || boostedCp !== undefined) && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 px-2 py-2 dark:bg-white/5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Hundo CP</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{cp?.toLocaleString() ?? "—"}</p>
          </div>
          <div className="rounded-xl bg-sky-50 px-2 py-2 dark:bg-sky-500/10">
            <p className="flex items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-sky-500">
              <Icon name="sun" /> Boosted
            </p>
            <p className="text-lg font-bold text-sky-700 dark:text-sky-300">{boostedCp?.toLocaleString() ?? "—"}</p>
          </div>
        </div>
      )}

      {/* Weather boost */}
      {weatherBoost && weatherBoost.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Weather boost:{" "}
          <span className="font-medium capitalize text-slate-700 dark:text-slate-300">
            {weatherBoost.join(", ")}
          </span>
        </p>
      )}

      {/* Best counters CTA */}
      {dex && (
        <span className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-rose-600">
          <Icon name="shield" /> Best counters
          <Icon name="arrowRight" className="transition group-hover:translate-x-0.5" />
        </span>
      )}
    </div>
  );

  const cls =
    "flex flex-col rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:border-white/10 dark:bg-white/5";

  return dex ? (
    <Link href={`/pokemon/${dex}#counters`} className={`group ${cls}`}>
      {inner}
    </Link>
  ) : (
    <article className={cls}>{inner}</article>
  );
}

// ─── Road of Legends day-by-day view ─────────────────────────────────────────

function DayDistribution({ eventName, days }: { eventName?: string; days: RoLDay[] }) {
  const [activeDay, setActiveDay] = useState(days[0]?.date ?? "");
  const day = days.find((d) => d.date === activeDay) ?? days[0];
  if (!day) return null;

  return (
    <div>
      {eventName && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
          <Icon name="star" /> {eventName} — day by day
        </p>
      )}

      <div className="-mx-4 mb-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          {days.map((d) => (
            <button
              key={d.date}
              type="button"
              onClick={() => setActiveDay(d.date)}
              className={[
                "whitespace-nowrap rounded-xl px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                d.date === activeDay
                  ? "bg-amber-500 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
              ].join(" ")}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {day.tiers.map((t) => (
          <TierSection key={t.tier} tier={t.tier}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {t.bosses.map((b) => {
                const pokemon = findByName(b.name);
                return (
                  <WeekBossCard
                    key={b.name}
                    boss={{
                      name: b.name,
                      image: b.sprite ?? (b.dex ? spriteUrl(b.dex) : ""),
                      dex: b.dex,
                      canBeShiny: b.shiny,
                      tier: t.tier,
                      cp: pokemon ? hundoCpAt(pokemon, 20) : undefined,
                      boostedCp: pokemon ? hundoCpAt(pokemon, 25) : undefined,
                      types: pokemon?.types ?? [],
                    }}
                  />
                );
              })}
            </div>
          </TierSection>
        ))}
      </div>
    </div>
  );
}
