import Link from "next/link";
import type { PogoEvent } from "@/lib/types";
import { typeMeta } from "@/lib/events";
import { formatTimeRange } from "@/lib/time";
import Countdown from "./Countdown";
import Icon from "./Icon";
import RotomDexIcon from "./RotomDexIcon";
import SpriteImage from "./SpriteImage";

interface Props {
  event: PogoEvent;
  /** Larger, accent treatment for the "Today" panel. */
  featured?: boolean;
  /** Called when the user taps the Dex button on this card. */
  onDexClick?: (event: PogoEvent) => void;
}

export default function EventCard({ event, featured = false, onDexClick }: Props) {
  const meta = typeMeta(event.eventType);
  const spotlight = event.extraData?.spotlight;
  const bosses = event.extraData?.raidbattles?.bosses;
  const cd = event.extraData?.communityday;

  return (
    <div className="relative group">
      <Link
        href={`/events/${event.eventID}`}
        className={[
          "relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition dark:border-white/10 dark:bg-white/5",
          "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
          featured ? "ring-1 ring-sky-200 dark:ring-sky-500/30" : "",
          onDexClick ? "pr-12" : "",
        ].join(" ")}
      >
        {/* Pokémon / event art */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10">
          <SpriteImage src={event.image} alt="" size={56} className="h-14 w-14 drop-shadow-sm" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.badge}`}>
              <Icon name={meta.icon} />
              {meta.label}
            </span>
          </div>

          <h3 className="truncate font-semibold text-slate-900 dark:text-white">{event.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formatTimeRange(event.start, event.end)}</p>

          {spotlight && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              Bonus: <span className="font-medium text-slate-900 dark:text-white">{spotlight.bonus}</span>
              {spotlight.canBeShiny && <Icon name="sparkles" title="Shiny available" className="text-amber-500" />}
            </p>
          )}
          {bosses && bosses.length > 0 && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              Boss: <span className="font-medium text-slate-900 dark:text-white">{bosses[0].name}</span>
              {bosses[0].canBeShiny && <Icon name="sparkles" title="Shiny available" className="text-amber-500" />}
            </p>
          )}
          {cd?.featuredMove && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Featured move: <span className="font-medium text-slate-900 dark:text-white">{cd.featuredMove}</span>
            </p>
          )}

          <div className="mt-2 flex items-center justify-between text-sm">
            <Countdown startISO={event.start} endISO={event.end} />
            <Icon name="chevronRight" className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
          </div>
        </div>
      </Link>

      {/* Dex button — sits outside the Link to avoid nested-interactive HTML */}
      {onDexClick && (
        <button
          type="button"
          onClick={() => onDexClick(event)}
          aria-label={`Ask Dex about ${event.name}`}
          title="Ask Dex"
          className={[
            "absolute right-3 top-1/2 -translate-y-1/2 z-10",
            "flex h-9 w-9 items-center justify-center rounded-full",
            "bg-amber-400 shadow-md shadow-amber-200/60 dark:shadow-amber-900/40",
            "transition hover:scale-110 hover:bg-amber-300 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
          ].join(" ")}
        >
          <RotomDexIcon size={26} />
        </button>
      )}
    </div>
  );
}
