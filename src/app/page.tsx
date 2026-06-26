import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Countdown from "@/components/Countdown";
import Icon, { type IconName } from "@/components/Icon";
import SpriteImage from "@/components/SpriteImage";
import { getEvents } from "@/lib/events";
import { getRaids, tierMeta, tierRank } from "@/lib/raids";
import { getEggs } from "@/lib/eggs";
import { NEWS, newsCategoryMeta, getArticle } from "@/lib/news";
import { findByName, spriteUrl, typeColor } from "@/lib/pokedex";
import { hasEnded, parseLocal, formatTimeRange } from "@/lib/time";
import type { PogoEvent } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "TrainerDex — Your Pokémon GO Dashboard",
  description:
    "The all-in-one Pokémon GO dashboard: live raids, Spotlight Hour, Community Day, eggs, events, news and your Pokédex — everything in one place.",
};

const QUICK: { label: string; href: string; icon: IconName; grad: string }[] = [
  { label: "Pokédex", href: "/pokemon", icon: "pokedex", grad: "from-emerald-400 to-teal-600" },
  { label: "Raids", href: "/raids", icon: "shield", grad: "from-rose-400 to-red-600" },
  { label: "Events", href: "/events", icon: "calendar", grad: "from-sky-400 to-blue-600" },
  { label: "News", href: "/news", icon: "megaphone", grad: "from-indigo-400 to-violet-600" },
  { label: "Graphics", href: "/graphics", icon: "image", grad: "from-fuchsia-400 to-purple-600" },
  { label: "Tips", href: "/news", icon: "lightbulb", grad: "from-amber-400 to-orange-600" },
];

function soonest(events: PogoEvent[], pred: (e: PogoEvent) => boolean, now: Date): PogoEvent | undefined {
  return events
    .filter((e) => !hasEnded(e.end, now) && pred(e))
    .sort((a, b) => parseLocal(a.start).getTime() - parseLocal(b.start).getTime())[0];
}

export default async function Dashboard() {
  const now = new Date();
  const [events, raids, eggs] = await Promise.all([getEvents(), getRaids(), getEggs()]);

  const live = events.filter((e) => !hasEnded(e.end, now));
  const nextEvent =
    live
      .filter((e) => parseLocal(e.start).getTime() > now.getTime())
      .sort((a, b) => parseLocal(a.start).getTime() - parseLocal(b.start).getTime())[0] ?? live[0];
  const spotlight = soonest(events, (e) => e.eventType === "pokemon-spotlight-hour", now);
  const communityDay = soonest(events, (e) => e.eventType === "community-day", now);

  const topRaids = [...raids].sort((a, b) => tierRank(a.tier) - tierRank(b.tier)).slice(0, 8);
  const eggShiny = eggs.filter((e) => e.canBeShiny).length;
  const news = NEWS.slice(0, 5);

  // Featured Pokémon strip — spotlight mon + the headline raid bosses.
  const featuredNames = [
    spotlight?.extraData?.spotlight?.name,
    ...topRaids.slice(0, 7).map((r) => r.name),
  ].filter(Boolean) as string[];
  const featured = featuredNames
    .map((n) => findByName(n))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .filter((p, i, arr) => arr.findIndex((x) => x.dex === p.dex) === i)
    .slice(0, 8);

  return (
    <>
      <Header active="events" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {/* Hero */}
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 via-indigo-600 to-blue-700 p-6 sm:p-9 shadow-xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(#fff 1.5px, transparent 1.6px), radial-gradient(#fde68a 1.5px, transparent 1.6px)",
              backgroundSize: "44px 44px, 70px 70px",
              backgroundPosition: "0 0, 22px 16px",
            }}
          />
          <div className="relative">
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-indigo-200">
              Your Trainer Dashboard
            </p>
            <h1 className="max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
              Everything Pokémon GO, in one place.
            </h1>
            <p className="mt-2 max-w-2xl text-indigo-100">
              Live raids, Spotlight Hour, Community Day, eggs, events and news — refreshed hourly, all in your local
              timezone.
            </p>

            {/* Quick actions */}
            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {QUICK.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="group flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/15 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br ${q.grad} text-xl text-white shadow`}>
                    <Icon name={q.icon} />
                  </span>
                  <span className="text-xs font-semibold text-white">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Now / Next row */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {nextEvent && (
            <DashCard label="Next up" icon="hourglass" accent="sky">
              <Link href={`/events/${nextEvent.eventID}`} className="group block">
                <p className="text-lg font-bold text-slate-900 group-hover:text-sky-600 dark:text-white">
                  {nextEvent.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatTimeRange(nextEvent.start, nextEvent.end)}
                </p>
                <div className="mt-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                  <Countdown startISO={nextEvent.start} endISO={nextEvent.end} />
                </div>
              </Link>
            </DashCard>
          )}

          {spotlight && (
            <DashCard label="Spotlight Hour" icon="spotlight" accent="amber">
              <FeaturedLine event={spotlight} detail={spotlight.extraData?.spotlight?.bonus} />
            </DashCard>
          )}

          {communityDay ? (
            <DashCard label="Community Day" icon="star" accent="rose">
              <FeaturedLine
                event={communityDay}
                detail={communityDay.extraData?.communityday?.featuredMove ?? undefined}
              />
            </DashCard>
          ) : (
            <DashCard label="Community Day" icon="star" accent="rose">
              <p className="text-sm text-slate-500 dark:text-slate-400">None scheduled yet — check back soon.</p>
            </DashCard>
          )}
        </div>

        {/* Current raids */}
        <SectionHeader title="Current Raid Bosses" icon="shield" href="/raids" />
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topRaids.map((r) => {
            const m = tierMeta(r.tier);
            const dex = findByName(r.name);
            return (
              <Link
                key={r.name}
                href={dex ? `/pokemon/${dex.dex}` : "/raids"}
                className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-white/10 dark:bg-white/5"
              >
                <span className={`mb-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${m.badge}`}>{m.short}</span>
                <SpriteImage src={r.image} alt={r.name} size={64} className="h-16 w-16" />
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{r.name}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  CP {r.combatPower.normal.max}
                  {r.canBeShiny && <Icon name="sparkles" title="Shiny available" className="text-amber-500" />}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Eggs + News */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DashCard label="Current Eggs" icon="egg" accent="teal">
            <div className="flex items-center justify-between">
              <span className="sr-only">Current eggs</span>
              <Link href="/graphic/eggs" className="ml-auto text-xs font-medium text-teal-600 hover:underline dark:text-teal-400">
                View pool →
              </Link>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{eggs.length}</p>
            <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              hatchable Pokémon ·
              <Icon name="sparkles" className="text-amber-500" />
              <span className="text-amber-500">{eggShiny} shiny-eligible</span>
            </p>
          </DashCard>

          <DashCard label="Latest News" icon="megaphone" accent="indigo">
            <div className="-mt-1 mb-1 flex justify-end">
              <Link href="/news" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                All news →
              </Link>
            </div>
            <ul className="space-y-1.5">
              {news.map((n) => {
                const m = newsCategoryMeta(n.category);
                const has = !!getArticle(n.slug);
                const body = (
                  <span className="flex items-center gap-2">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${m.badge}`}>
                      {m.label}
                    </span>
                    <span className="truncate text-sm text-slate-700 dark:text-slate-300">{n.title}</span>
                  </span>
                );
                return (
                  <li key={n.slug}>
                    {has ? (
                      <Link href={`/news/${n.slug}`} className="block hover:text-indigo-600 dark:hover:text-indigo-400">
                        {body}
                      </Link>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          </DashCard>
        </div>

        {/* Featured Pokémon */}
        {featured.length > 0 && (
          <>
            <SectionHeader title="Featured Pokémon" icon="sparkles" href="/pokemon" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {featured.map((p) => (
                <Link
                  key={p.dex}
                  href={`/pokemon/${p.dex}`}
                  className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-white/10 dark:bg-white/5"
                >
                  <SpriteImage src={spriteUrl(p.dex)} alt={p.name} size={56} className="h-14 w-14" />
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">{p.name}</p>
                  <div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                    {p.types.map((t) => (
                      <span key={t} className={`rounded px-1 py-px text-[9px] font-medium ${typeColor(t)}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

// ---- small dashboard primitives ----

// Color-block label chips replace the AI-slop left-border accent. Each card
// leads with a small filled icon chip in the accent color — intentional
// hierarchy, not a decorative stripe.
const CHIP: Record<string, string> = {
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
};

function DashCard({
  label,
  icon,
  accent,
  children,
}: {
  label: string;
  icon: IconName;
  accent: keyof typeof CHIP;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-center gap-2">
        <span className={`grid h-6 w-6 place-items-center rounded-lg text-sm ${CHIP[accent]}`}>
          <Icon name={icon} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ title, icon, href }: { title: string; icon: IconName; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <Icon name={icon} className="text-sky-500" />
        {title}
      </h2>
      <Link href={href} className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400">
        See all →
      </Link>
    </div>
  );
}

function FeaturedLine({ event, detail }: { event: PogoEvent; detail?: string }) {
  const sp = event.extraData?.spotlight;
  const name = sp?.name ?? event.extraData?.communityday?.spawns?.[0]?.name;
  const dex = name ? findByName(name) : undefined;
  return (
    <Link href={`/events/${event.eventID}`} className="group flex items-center gap-3">
      {dex && <SpriteImage src={spriteUrl(dex.dex)} alt="" size={56} className="h-14 w-14 shrink-0" />}
      <div className="min-w-0">
        <p className="truncate font-bold text-slate-900 group-hover:text-sky-600 dark:text-white">{event.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{formatTimeRange(event.start, event.end)}</p>
        {detail && <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-slate-300">{detail}</p>}
        <div className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">
          <Countdown startISO={event.start} endISO={event.end} />
        </div>
      </div>
    </Link>
  );
}
