import { notFound } from "next/navigation";
import { getRoadOfLegendsDays } from "@/lib/road-of-legends";
import { getPokemon, hundoCpAt, spriteUrl } from "@/lib/pokedex";

export const revalidate = 3600;

// One poster per Road of Legends day — the raid bosses to catch that day,
// grouped by tier (5★ / Mega / Primal), with raid-catch hundo CP.
export async function generateStaticParams() {
  return getRoadOfLegendsDays().map((d) => ({ date: d.date }));
}

export async function generateMetadata({ params }: PageProps<"/graphic/rol/[date]">) {
  const { date } = await params;
  const day = getRoadOfLegendsDays().find((d) => d.date === date);
  return { title: `Road of Legends — ${day?.label ?? date} — TrainerDex Graphic` };
}

const TIER_STYLE: Record<string, string> = {
  "5★": "from-rose-500 to-red-600",
  Mega: "from-fuchsia-500 to-purple-600",
  Primal: "from-sky-500 to-blue-600",
};

export default async function RoLDayGraphic({ params }: PageProps<"/graphic/rol/[date]">) {
  const { date } = await params;
  const days = getRoadOfLegendsDays();
  const day = days.find((d) => d.date === date);
  if (!day) notFound();
  const dayIdx = days.findIndex((d) => d.date === date) + 1;

  return (
    <div className="grid min-h-screen place-items-center bg-slate-200 p-6">
      <div
        id="poster"
        className="relative w-[760px] overflow-hidden rounded-3xl px-8 py-9 text-white shadow-2xl"
        style={{ background: "radial-gradient(130% 90% at 50% -10%, #f59e0b 0%, #b45309 45%, #7c2d12 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#fbbf24 2px, transparent 2.2px), radial-gradient(#fca5a5 2px, transparent 2.2px)",
            backgroundSize: "46px 46px, 80px 80px",
            backgroundPosition: "0 0, 40px 6px",
          }}
        />
        <div className="relative">
          {/* Brand row */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-xl shadow">
                ⚡
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Trainer<span className="text-sky-300">Dex</span>
              </span>
            </div>
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">
              Day {dayIdx} of {days.length}
            </span>
          </div>

          <p className="text-center text-sm font-bold uppercase tracking-widest text-amber-200">Road of Legends</p>
          <h1 className="text-center text-3xl font-black uppercase tracking-wide drop-shadow">{day.label}</h1>
          <p className="mb-6 text-center text-sm font-medium text-white/75">Raid bosses to catch · hundo CP (raid catch)</p>

          {/* Tiers */}
          <div className="space-y-5">
            {day.tiers.map((tier) => (
              <div key={tier.tier}>
                <div className="mb-2.5 flex items-center gap-2">
                  <span
                    className={`rounded-lg bg-linear-to-br ${TIER_STYLE[tier.tier] ?? "from-slate-500 to-slate-700"} px-2.5 py-1 text-sm font-black shadow`}
                  >
                    {tier.tier} Raids
                  </span>
                  <span className="text-xs font-semibold text-white/60">{tier.bosses.length} Pokémon</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {tier.bosses.map((b) => {
                    const p = b.dex ? getPokemon(b.dex) : undefined;
                    const sprite = b.sprite ?? (b.dex ? spriteUrl(b.dex) : "");
                    return (
                      <div
                        key={b.name}
                        className="flex flex-col items-center rounded-xl bg-white/10 px-1.5 pb-2 pt-1.5 ring-1 ring-white/15 backdrop-blur-sm"
                      >
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sprite} alt={b.name} className="h-16 w-16 object-contain drop-shadow-lg" />
                          {b.shiny && (
                            <span className="absolute right-0 top-0 text-base text-amber-300 drop-shadow">✨</span>
                          )}
                        </div>
                        <p className="max-w-full truncate text-center text-[11px] font-bold leading-tight">{b.name}</p>
                        {p && (
                          <div className="mt-0.5 flex items-center gap-1">
                            <span className="rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums">
                              {hundoCpAt(p, 20).toLocaleString()}
                            </span>
                            <span className="rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums text-amber-300">
                              {hundoCpAt(p, 25).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-center gap-5 text-xs text-white/75">
            <span>
              <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold">white</span> raid catch (L20)
            </span>
            <span>
              <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold text-amber-300">gold</span> weather boosted (L25)
            </span>
            <span>✨ shiny</span>
          </div>
          <p className="mt-1 text-center text-[11px] text-white/55">TrainerDex · source: official Pokémon GO newsroom</p>
        </div>
      </div>
    </div>
  );
}
