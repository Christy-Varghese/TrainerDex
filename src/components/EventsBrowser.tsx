"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { EventType, PogoEvent } from "@/lib/types";
import { typeMeta } from "@/lib/events";
import EventCard from "./EventCard";
import EventDexPanel from "./EventDexPanel";
import EmptyState from "./EmptyState";
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
  const [dexEvent, setDexEvent] = useState<PogoEvent | null>(null);
  const openDex = useCallback((event: PogoEvent) => setDexEvent(event), []);
  const closeDex = useCallback(() => setDexEvent(null), []);

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
      <EventDexPanel event={dexEvent} onClose={closeDex} />

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
      <Section
        title="Happening Now"
        icon="flame"
        groups={now}
        featured
        onDexClick={openDex}
        emptyTitle="Nothing live right now"
        emptyHint="Events will appear here as they go live. Check what's coming up below."
      />

      {/* Upcoming */}
      <Section
        title="Upcoming Events"
        icon="calendar"
        groups={next}
        onDexClick={openDex}
        emptyTitle="Nothing scheduled yet"
        emptyHint="Check back soon — upcoming events will appear here when announced."
      />

      {/* Past events this month — kept for reference, visually dimmed. */}
      {prev.length > 0 && (
        <Section
          title="Past Events This Month"
          icon="hourglass"
          groups={prev}
          muted
          onDexClick={openDex}
          emptyTitle="No completed events yet"
          emptyHint="Completed events from this month will appear here for reference."
        />
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
  onDexClick,
  emptyTitle,
  emptyHint,
}: {
  title: string;
  icon: IconName;
  groups: EventGroup[];
  featured?: boolean;
  muted?: boolean;
  onDexClick?: (event: PogoEvent) => void;
  emptyTitle: string;
  emptyHint?: string;
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
                <EventCard key={e.eventID} event={e} featured={featured} onDexClick={onDexClick} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <EmptyState icon={icon} title={emptyTitle} hint={emptyHint} />
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
        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
