import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { getWeeks } from "@/lib/weekly";
import { getRoadOfLegendsDays } from "@/lib/road-of-legends";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Weekly Graphics — TrainerDex",
  description:
    "Auto-generated weekly Pokémon GO hundo-CP graphics for every upcoming week. View and download shareable cards.",
};

export default async function GraphicsHub() {
  const weeks = await getWeeks(6);
  const rolDays = getRoadOfLegendsDays();

  return (
    <>
      <Header active="graphics" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <section className="mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-violet-500 to-purple-700 p-6 sm:p-8 shadow-lg shadow-violet-200">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-violet-100">Shareable Graphics</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Weekly Hundo CP Cards</h1>
          <p className="mt-2 max-w-2xl text-violet-100">
            One auto-generated card per upcoming week — every featured Pokémon with its 100% IV CP. Pokémon that
            share a CP are merged under one badge. View full size or download the PNG.
          </p>
        </section>

        {/* Featured: current raids + eggs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <GraphicCard
            title="Current Raid Bosses"
            subtitle="Live raid rotation · L20 / L25 hundo CP"
            png="/graphics/raid-hundo-cp.png"
            openHref="/graphic/raids"
          />
          <GraphicCard
            title="Egg Hatches"
            subtitle="Current egg pool · hatch hundo CP + shiny"
            png="/graphics/egg-hatches.png"
            openHref="/graphic/eggs"
          />
          <GraphicCard
            title="Road of Legends"
            subtitle="Featured Pokémon · hundo CP"
            png="/graphics/event-road-of-legends.png"
            openHref="/graphic/event/road-of-legends-2026"
          />
          <GraphicCard
            title="GO Fest 2026: Global"
            subtitle="July 11–12 · habitats, headliners & wild spawns"
            png="/graphics/event-go-fest-global.png"
            openHref="/graphic/go-fest"
          />
        </div>

        {/* Road of Legends — day-by-day raid bosses */}
        {rolDays.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <Icon name="shield" className="text-amber-500" /> Road of Legends · Daily Raids
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {rolDays.map((d) => {
                const count = d.tiers.reduce((n, t) => n + t.bosses.length, 0);
                return (
                  <GraphicCard
                    key={d.date}
                    title={d.label}
                    subtitle={`${count} raid bosses · ${d.tiers.map((t) => t.tier).join(" · ")}`}
                    png={`/graphics/rol-${d.date}.png`}
                    openHref={`/graphic/rol/${d.date}`}
                  />
                );
              })}
            </div>
          </>
        )}

        <h2 className="mb-3 mt-8 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Icon name="calendar" className="text-violet-500" /> Upcoming Weeks
        </h2>
        {weeks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center text-sm text-slate-400 dark:border-white/15 dark:bg-white/5">
            No upcoming events with featured Pokémon yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {weeks.map((w) => (
              <GraphicCard
                key={w.id}
                title={`Week of ${w.label}`}
                subtitle={`${w.monCount} Pokémon · ${w.events.length} event${w.events.length === 1 ? "" : "s"}`}
                png={`/graphics/week-${w.id}.png`}
                openHref={`/graphics/week/${w.id}`}
                chips={w.events.slice(0, 4).map((e) => e.name)}
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-slate-400">
          CP values use the official formula per catch level (Raid L20 / boosted L25, Wild L30 / boosted L35,
          Research L15). Sprites via PokeMiners; event data via Leek Duck.
        </p>
      </main>

      <Footer />
    </>
  );
}

function GraphicCard({
  title,
  subtitle,
  png,
  openHref,
  chips,
}: {
  title: string;
  subtitle: string;
  png: string;
  openHref: string;
  chips?: string[];
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
      <Link href={openHref} className="block bg-slate-100 dark:bg-white/5">
        {/* Pre-rendered poster preview */}
        <Image
          src={png}
          alt={title}
          width={800}
          height={420}
          unoptimized
          className="mx-auto max-h-[360px] w-full object-contain"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        {chips && chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span key={c} className="truncate rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">
                {c}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <a
            href={png}
            download
            className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            ⬇ Download PNG
          </a>
          <Link
            href={openHref}
            className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            Open full
          </Link>
        </div>
      </div>
    </article>
  );
}
