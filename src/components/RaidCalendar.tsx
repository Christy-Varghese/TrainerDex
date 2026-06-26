"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import SpriteImage from "./SpriteImage";
import { spriteUrl } from "@/lib/pokedex";
import type { RoLDay } from "@/lib/road-of-legends";

export interface WeekBoss {
  name: string;
  image: string;
  dex?: number;
  tier?: string;
  canBeShiny: boolean;
}

export interface RaidWeek {
  id: string;
  label: string;
  /** True for the week containing today. */
  current?: boolean;
  bosses: WeekBoss[];
  /** When set, render a day-by-day distribution (e.g. Road of Legends). */
  days?: RoLDay[];
  /** Optional event name shown above a day-by-day week. */
  eventName?: string;
}

/**
 * Week calendar for raid bosses. Tabs across upcoming weeks; the selected week
 * shows its bosses. Each boss links to its Pokédex page, where the moveset and
 * best L40 counters live. "This week" is the live rotation; future weeks come
 * from dated raid events (Raid Day / Raid Hour / raid battles).
 */
export default function RaidCalendar({ weeks }: { weeks: RaidWeek[] }) {
  const [active, setActive] = useState(weeks[0]?.id ?? "");
  const week = weeks.find((w) => w.id === active) ?? weeks[0];
  if (!week) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Icon name="calendar" className="text-rose-500" /> Raid Schedule
      </h2>

      {/* Week selector */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          {weeks.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActive(w.id)}
              aria-pressed={w.id === active}
              className={[
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400",
                w.id === active
                  ? "bg-rose-500 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-rose-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
              ].join(" ")}
            >
              {w.current ? "This Week" : w.label}
            </button>
          ))}
        </div>
      </div>

      {week.days && week.days.length > 0 ? (
        <DayDistribution eventName={week.eventName} days={week.days} />
      ) : week.bosses.length > 0 ? (
        <BossGrid bosses={week.bosses} />
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-400 dark:border-white/15 dark:bg-white/5">
          No raid bosses announced for this week yet.
        </p>
      )}
    </section>
  );
}

function BossCard({ name, image, dex, tier, shiny }: { name: string; image: string; dex?: number; tier?: string; shiny: boolean }) {
  const inner = (
    <>
      {tier && (
        <span className="mb-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
          {tier}
        </span>
      )}
      <SpriteImage src={image} alt={name} size={64} className="h-16 w-16" />
      <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
      {shiny && (
        <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-500">
          <Icon name="sparkles" /> shiny
        </span>
      )}
    </>
  );
  const cls =
    "group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:border-white/10 dark:bg-white/5";
  return dex ? (
    <Link href={`/pokemon/${dex}#counters`} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls.replace("group ", "")}>{inner}</div>
  );
}

function BossGrid({ bosses }: { bosses: WeekBoss[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {bosses.map((b) => (
        <BossCard key={b.name} name={b.name} image={b.image} dex={b.dex} tier={b.tier} shiny={b.canBeShiny} />
      ))}
    </div>
  );
}

function DayDistribution({ eventName, days }: { eventName?: string; days: RoLDay[] }) {
  const [activeDay, setActiveDay] = useState(days[0]?.date ?? "");
  const day = days.find((d) => d.date === activeDay) ?? days[0];
  if (!day) return null;
  return (
    <div>
      {eventName && (
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
          <Icon name="star" /> {eventName} — day by day
        </p>
      )}
      {/* Day selector */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          {days.map((d) => (
            <button
              key={d.date}
              type="button"
              onClick={() => setActiveDay(d.date)}
              aria-pressed={d.date === activeDay}
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

      {/* Per-tier bosses for the selected day */}
      <div className="space-y-5">
        {day.tiers.map((t) => (
          <div key={t.tier}>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              <Icon name="shield" className="text-rose-500" /> {t.tier} Raids
              <span className="text-xs font-normal text-slate-400">({t.bosses.length})</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {t.bosses.map((b) => (
                <BossCard
                  key={b.name}
                  name={b.name}
                  image={b.dex ? spriteUrl(b.dex) : ""}
                  dex={b.dex}
                  shiny={b.shiny}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
