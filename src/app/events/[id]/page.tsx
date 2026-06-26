import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Countdown from "@/components/Countdown";
import FeaturedMon from "@/components/FeaturedMon";
import Icon from "@/components/Icon";
import SpriteImage from "@/components/SpriteImage";
import { getEvent, getEvents, typeMeta } from "@/lib/events";
import { findEventArticle } from "@/lib/news";
import { formatTimeRange } from "@/lib/time";

export const revalidate = 3600;

// Prerender every event currently in the feed; new IDs render on first request.
export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ id: e.eventID }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return { title: "Event not found — TrainerDex" };
  return {
    title: `${event.name} — TrainerDex`,
    description: `${event.heading} · ${formatTimeRange(event.start, event.end)}. Bonuses, featured Pokémon and raid bosses on TrainerDex.`,
  };
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const meta = typeMeta(event.eventType);
  const spotlight = event.extraData?.spotlight;
  const raid = event.extraData?.raidbattles;
  const cd = event.extraData?.communityday;

  // Unified featured-Pokémon list (spotlight mon(s) + community day spawns).
  const featured: { name: string; image?: string; canBeShiny: boolean }[] = [];
  if (spotlight) {
    const list = spotlight.list?.length
      ? spotlight.list
      : [{ name: spotlight.name, image: spotlight.image, canBeShiny: spotlight.canBeShiny }];
    for (const m of list) featured.push({ name: m.name, image: m.image, canBeShiny: m.canBeShiny });
  }
  for (const s of cd?.spawns ?? []) featured.push({ name: s.name, image: s.image, canBeShiny: true });

  const article = findEventArticle(event.eventID, event.name);

  return (
    <>
      <Header active={event.eventType.includes("raid") ? "raids" : "events"} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-sky-600"
        >
          ← All events
        </Link>

        {/* Hero */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white shadow-sm dark:bg-white/10">
              <SpriteImage src={event.image} alt={event.name} size={64} className="h-16 w-16" />
            </div>
            <div className="min-w-0">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}>
                <Icon name={meta.icon} /> {meta.label}
              </span>
              <h1 className="mt-1.5 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">{event.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{formatTimeRange(event.start, event.end)}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-white/5 dark:text-slate-200">
              <Icon name="hourglass" /> <Countdown startISO={event.start} endISO={event.end} />
            </div>

            {/* Prominent CTA to the full news article. The event page is a
                summary — the detailed write-up lives on the news page. */}
            {article && (
              <Link
                href={`/news/${article.slug}`}
                className="group mb-6 flex items-center gap-3 rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 to-violet-50 p-4 transition hover:border-indigo-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-indigo-400/30 dark:from-indigo-950/50 dark:to-violet-950/40"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500 text-white shadow-sm">
                  <Icon name="megaphone" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Read the full details</p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">{article.title}</p>
                </div>
                <Icon name="arrowRight" className="shrink-0 text-indigo-500 transition group-hover:translate-x-0.5" />
              </Link>
            )}

            {/* Spotlight Hour */}
            {spotlight && (
              <Block title="Spotlight bonus">
                <p className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <span className="font-semibold text-slate-900 dark:text-white">{spotlight.bonus}</span>
                  {spotlight.canBeShiny && (
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Icon name="sparkles" /> can be shiny
                    </span>
                  )}
                </p>
              </Block>
            )}

            {/* Community Day */}
            {cd?.featuredMove && (
              <Block title="Featured move">
                <p className="font-semibold text-slate-900 dark:text-white">{cd.featuredMove}</p>
              </Block>
            )}
            {cd?.bonuses && cd.bonuses.length > 0 && (
              <Block title="Event bonuses">
                <ul className="space-y-1.5">
                  {cd.bonuses.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <Icon name="check" className="shrink-0 text-emerald-500" />
                      {b.text}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {/* Raid bosses — enriched with hundo CP + shiny odds */}
            {raid?.bosses && raid.bosses.length > 0 && (
              <Block title="Raid bosses">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {raid.bosses.map((b) => (
                    <FeaturedMon
                      key={b.name}
                      name={b.name}
                      image={b.image}
                      canBeShiny={b.canBeShiny}
                      eventType={event.eventType}
                      context={b.tier}
                    />
                  ))}
                </div>
              </Block>
            )}

            {/* Featured / spawning Pokémon — enriched with hundo CP + shiny odds */}
            {featured.length > 0 && (
              <Block title="Featured Pokémon">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {featured.map((p) => (
                    <FeaturedMon
                      key={p.name}
                      name={p.name}
                      image={p.image}
                      canBeShiny={p.canBeShiny}
                      eventType={event.eventType}
                    />
                  ))}
                </div>
              </Block>
            )}

            {/* Full story lives on the news page — see the CTA at the top. */}

            {/* Source attribution — transparency requirement from the idea */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-white/10">
              Source:{" "}
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline-offset-2 hover:underline"
              >
                Leek Duck
              </a>
              {article && <> &amp; the official Pokémon GO newsroom</>}. Times in your local timezone. Shiny
              odds are approximate community estimates.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{title}</h2>
      {children}
    </div>
  );
}
