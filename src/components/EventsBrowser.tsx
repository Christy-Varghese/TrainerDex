"use client";

import { useState } from "react";
import Link from "next/link";
import type { EventType, PogoEvent } from "@/lib/types";
import { typeMeta } from "@/lib/events";
import EventCard from "./EventCard";
import Icon, { type IconName } from "./Icon";

/** A labeled, time-proximity group of events (e.g. "Ends Today"). */
export interface EventGroup {
  label: string;
  events: PogoEvent[];
}

interface Props {
  /** "Happening Now" groups, ordered soonest-ending first. */
  happeningNow: EventGroup[];
  /** "Upcoming" groups, ordered soonest-starting first. */
  upcoming: EventGroup[];
  /** Completed events from the current month — kept, not dropped. */
  past?: EventGroup[];
  /** Event types present in the data — drives the filter pills. */
  types: EventType[];
}

// Section links below the hero. Only Events is live in Phase 1.
const QUICK_NAV = [
  { label: "Events", active: true, href: undefined as string | undefined },
  { label: "Pokémon", active: false, href: "/pokemon" },
  { label: "Raids", active: false, href: "/raids" as string | undefined },
  { label: "News", active: false, href: "/news" },
  { label: "Shiny", active: false, href: undefined },
  { label: "IV Tools", active: false, href: undefined },
  { label: "Promo Codes", active: false, href: undefined },
];

type Filter = EventType | "all";

export default function EventsBrowser({ happeningNow, upcoming, past = [], types }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const keep = (e: PogoEvent) => filter === "all" || e.eventType === filter;

  const filterGroups = (groups: EventGroup[]) =>
    groups
      .map((g) => ({ ...g, events: g.events.filter(keep) }))
      .filter((g) => g.events.length > 0);

  const now = filterGroups(happeningNow);
  const next = filterGroups(upcoming);
  const prev = filterGroups(past);

  return (
    <>
      {/* Quick-nav bar */}
      <nav className="mb-6 -mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          {QUICK_NAV.map((item) =>
            item.active ? (
              <span
                key={item.label}
                className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                title="Coming soon"
                className="flex cursor-not-allowed items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-400"
              >
                {item.label}
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Soon
                </span>
              </span>
            ),
          )}
        </div>
      </nav>

      {/* Filter bar — only types present in the data */}
      {types.length > 0 && (
        <div className="mb-8 -mx-4 overflow-x-auto px-4">
          <div className="flex w-max gap-2">
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterPill>
            {types.map((t) => {
              const meta = typeMeta(t);
              return (
                <FilterPill key={t} active={filter === t} onClick={() => setFilter(t)}>
                  <Icon name={meta.icon} /> {meta.label}
                </FilterPill>
              );
            })}
          </div>
        </div>
      )}

      {/* Happening Now */}
      <Section title="Happening Now" icon="flame" groups={now} featured>
        Nothing live right now. See what&apos;s coming up below.
      </Section>

      {/* Upcoming */}
      <Section title="Upcoming Events" icon="calendar" groups={next}>
        Nothing scheduled in this window. Check back soon.
      </Section>

      {/* Past events this month — kept for reference, visually dimmed. */}
      {prev.length > 0 && (
        <Section title="Past Events This Month" icon="hourglass" groups={prev} muted>
          No completed events yet this month.
        </Section>
      )}
    </>
  );
}

function Section({
  title,
  icon,
  groups,
  featured = false,
  muted = false,
  children,
}: {
  title: string;
  icon: IconName;
  groups: EventGroup[];
  featured?: boolean;
  /** Dim the section (used for completed/past events). */
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Icon name={icon} className={muted ? "text-slate-400" : "text-sky-500"} />
        {title}
      </h2>

      {groups.length > 0 ? (
        groups.map((g) => (
          <div key={g.label} className={`mb-6 last:mb-0 ${muted ? "opacity-70" : ""}`}>
            <PillDivider>{g.label}</PillDivider>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {g.events.map((e) => (
                <EventCard key={e.eventID} event={e} featured={featured} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center text-sm text-slate-400">
          {children}
        </div>
      )}
    </section>
  );
}

/** Centered pill label with a horizontal rule on each side. */
function PillDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
        {children}
      </span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
