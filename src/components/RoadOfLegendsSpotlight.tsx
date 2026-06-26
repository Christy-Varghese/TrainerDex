import Link from "next/link";
import Icon from "./Icon";
import SpriteImage from "./SpriteImage";
import { spriteUrl } from "@/lib/pokedex";
import { getRoadOfLegendsDays } from "@/lib/road-of-legends";
import { getNewsItem } from "@/lib/news";

const SLUG = "road-of-legends-2026";

// Simplified, image-led Road of Legends teaser for the events page. The full
// day-by-day schedule lives on the Raids calendar and the write-up on the News
// page — this is a graphical summary with a CTA into News & Tips.
export default function RoadOfLegendsSpotlight() {
  const days = getRoadOfLegendsDays();
  if (days.length === 0) return null;

  const item = getNewsItem(SLUG);

  // Flatten to a unique, image-able boss line-up (legendary headliners).
  const seen = new Set<string>();
  const bosses: { name: string; sprite: string; dex?: number; shiny: boolean; tier: string }[] = [];
  for (const d of days) {
    for (const t of d.tiers) {
      for (const b of t.bosses) {
        const key = b.name.toLowerCase();
        if (seen.has(key)) continue;
        const sprite = b.sprite ?? (b.dex ? spriteUrl(b.dex) : "");
        if (!sprite) continue;
        seen.add(key);
        bosses.push({ name: b.name, sprite, dex: b.dex, shiny: b.shiny, tier: t.tier });
      }
    }
  }
  const headliners = bosses.slice(0, 10);

  const dateRange =
    days.length > 1 ? `${days[0].label} – ${days[days.length - 1].label}` : days[0].label;

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 shadow-lg shadow-amber-100 dark:border-amber-400/20 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/30 dark:shadow-none">
      <div className="p-5 sm:p-6">
        {/* Heading */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              <Icon name="star" /> Featured event
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              Road of Legends
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
              <Icon name="calendar" /> {dateRange} · {days.length} days of Legendary raids
            </p>
          </div>
        </div>

        {/* Graphical day strip — one chip per scheduled day */}
        <div className="-mx-1 mt-4 flex flex-wrap gap-1.5">
          {days.map((d) => (
            <span
              key={d.date}
              className="rounded-lg bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-amber-200 dark:bg-white/10 dark:text-slate-300 dark:ring-amber-400/20"
            >
              {d.label}
            </span>
          ))}
        </div>

        {/* Legendary line-up — image-led, scrollable */}
        {headliners.length > 0 && (
          <div className="-mx-5 mt-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
            <div className="flex w-max gap-3">
              {headliners.map((b) => {
                const inner = (
                  <>
                    <div className="relative grid h-16 w-16 place-items-center rounded-xl bg-white shadow-sm dark:bg-white/10">
                      <SpriteImage src={b.sprite} alt={b.name} size={56} className="h-14 w-14" />
                      {b.shiny && (
                        <span className="absolute -right-1 -top-1 text-amber-500">
                          <Icon name="sparkles" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1 w-16 truncate text-center text-[11px] font-medium text-slate-700 dark:text-slate-200">
                      {b.name}
                    </p>
                  </>
                );
                return b.dex ? (
                  <Link
                    key={b.name}
                    href={`/pokemon/${b.dex}#counters`}
                    className="group shrink-0 rounded-xl p-1 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={b.name} className="shrink-0 p-1">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA → News & Tips */}
        <Link
          href={`/news/${SLUG}`}
          className="group mt-5 flex items-center gap-3 rounded-2xl bg-amber-500 px-4 py-3 text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
            <Icon name="megaphone" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Read the full guide on News &amp; Tips</p>
            <p className="truncate text-sm text-amber-50">
              {item?.title ?? "The Road of Legends — full schedule, bosses & strategy"}
            </p>
          </div>
          <Icon name="arrowRight" className="shrink-0 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
