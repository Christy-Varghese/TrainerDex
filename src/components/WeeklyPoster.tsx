import ShadowBadge from "./ShadowBadge";
import type { WeekData, WeekMon } from "@/lib/weekly";

/**
 * Shareable weekly poster — "Weekly Hundo List". Same card format as the raid
 * graphic, split into sections by catch source: Raid Pokémon, Wild/Spotlight,
 * and Research encounters. Each card shows the 100% IV CP for how that Pokémon
 * is obtained (white = primary catch level, gold = weather-boosted or Giovanni
 * for Shadow). Egg hatches live in their own graphic (event/monthly, not weekly).
 */
export default function WeeklyPoster({ week, domId }: { week: WeekData; domId?: string }) {
  return (
    <div
      id={domId}
      className="relative w-[720px] overflow-hidden rounded-3xl px-8 py-9 text-white shadow-2xl"
      style={{ background: "radial-gradient(130% 90% at 50% -10%, #8b5cf6 0%, #6d28d9 45%, #4c1d95 100%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(#fbbf24 2px, transparent 2.2px), radial-gradient(#34d399 2px, transparent 2.2px), radial-gradient(#f472b6 2px, transparent 2.2px), radial-gradient(#60a5fa 2px, transparent 2.2px)",
          backgroundSize: "46px 46px, 64px 64px, 80px 80px, 104px 104px",
          backgroundPosition: "0 0, 23px 18px, 40px 6px, 12px 34px",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-xl shadow">
              ⚡
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Trainer<span className="text-sky-300">Dex</span>
            </span>
          </div>
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">{week.label}</span>
        </div>
        <h1 className="text-center text-3xl font-black uppercase tracking-wide drop-shadow">Weekly Hundo List</h1>
        <p className="mb-6 text-center text-sm font-medium text-white/70">
          100% IV CP by where you catch it · ✨ shiny ·{" "}
          <span className="inline-flex items-center gap-1 align-middle">
            <ShadowBadge size={4} /> shadow
          </span>
        </p>

        {/* Event chips */}
        {week.events.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {week.events.slice(0, 8).map((e, i) => (
              <span key={i} className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/90">
                {e.emoji} {e.name}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-7">
          {/* Event-source sections */}
          {week.sections.map((s) => (
            <Section key={s.key} title={s.label} emoji={s.emoji}>
              <div className="grid grid-cols-3 gap-3">
                {s.mons.map((m) => (
                  <MonCard key={`${m.dex}`} mon={m} />
                ))}
              </div>
            </Section>
          ))}
        </div>

        {/* Footer legend */}
        <div className="mt-8 flex items-center justify-center gap-5 text-xs text-white/75">
          <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold">white</span> primary catch CP
          <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold text-amber-300">gold</span> boosted / Giovanni
        </div>
        <p className="mt-1 text-center text-[11px] text-white/55">
          TrainerDex · Pokémon GO Trainer Hub · data via Leek Duck
        </p>
      </div>
    </div>
  );
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-lg">{emoji}</span>
        <span className="text-base font-bold uppercase tracking-widest text-white/85">{title}</span>
        <span className="h-px flex-1 bg-white/15" />
      </div>
      {children}
    </section>
  );
}

function MonCard({ mon }: { mon: WeekMon }) {
  const showSecondary = mon.secondaryCp !== mon.primaryCp;
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 px-2 pb-2.5 pt-2 ring-1 ring-white/15 backdrop-blur-sm">
      <div className="relative">
        {mon.sprite && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={mon.sprite} alt={mon.name} className="h-24 w-24 object-contain drop-shadow-lg" />
        )}
        {mon.shadow && (
          <span className="absolute left-0 top-0">
            <ShadowBadge size={6} />
          </span>
        )}
        {mon.shiny && <span className="absolute right-0 top-0 text-lg text-amber-300 drop-shadow">✨</span>}
      </div>
      <p className="max-w-full truncate text-center text-sm font-bold leading-tight">{mon.name}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="rounded-md bg-black/85 px-2 py-0.5 text-sm font-extrabold tabular-nums">
          {mon.primaryCp.toLocaleString()}
        </span>
        {showSecondary && (
          <span className="rounded-md bg-black/85 px-2 py-0.5 text-sm font-extrabold tabular-nums text-amber-300">
            {mon.secondaryCp.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

