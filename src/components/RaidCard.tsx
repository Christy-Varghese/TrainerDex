import Link from "next/link";
import type { Raid } from "@/lib/raids";
import { tierMeta } from "@/lib/raids";
import { findByName } from "@/lib/pokedex";
import Icon from "./Icon";
import SpriteImage from "./SpriteImage";

/**
 * One raid boss. The headline number is the "hundo" CP — the CP a 15/15/15
 * catch shows on the encounter screen. Memorize it and you know instantly,
 * before throwing a ball, whether the boss you just beat is perfect. No
 * third-party IV app needed. Weather-boosted bosses catch at a higher level,
 * so they get a second, higher hundo CP. The whole card links to the Pokémon's
 * page, jumping to its best L40 counters.
 */
export default function RaidCard({ raid }: { raid: Raid }) {
  const meta = tierMeta(raid.tier);
  const hundo = raid.combatPower.normal.max;
  const hundoBoosted = raid.combatPower.boosted.max;
  const dex = findByName(raid.name)?.dex;

  const body = (
    <>
      <div className="flex items-start gap-3">
        <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-slate-100 ring-2 dark:bg-white/10 ${meta.ring}`}>
          <SpriteImage src={raid.image} alt={raid.name} size={56} className="h-14 w-14 drop-shadow-sm" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${meta.badge}`}>{meta.short}</span>
            {raid.canBeShiny && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                <Icon name="sparkles" /> Shiny
              </span>
            )}
          </div>
          <h3 className="truncate font-semibold text-slate-900 dark:text-white">{raid.name}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {raid.types.map((t) => (
              <span key={t.name} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium capitalize text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hundo (100% IV) CP reference */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 px-2 py-2 dark:bg-white/5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Hundo CP</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{hundo}</p>
        </div>
        <div className="rounded-xl bg-sky-50 px-2 py-2 dark:bg-sky-500/10">
          <p className="flex items-center justify-center gap-1 text-[11px] font-medium uppercase tracking-wide text-sky-500">
            <Icon name="sun" /> Boosted
          </p>
          <p className="text-lg font-bold text-sky-700 dark:text-sky-300">{hundoBoosted}</p>
        </div>
      </div>

      {raid.boostedWeather.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Weather boost:{" "}
          <span className="font-medium capitalize text-slate-700 dark:text-slate-300">
            {raid.boostedWeather.map((w) => w.name).join(", ")}
          </span>
        </p>
      )}

      {dex && (
        <span className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-rose-600">
          <Icon name="shield" /> Best counters
          <Icon name="arrowRight" className="transition group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  const cls =
    "flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:border-white/10 dark:bg-white/5";

  return dex ? (
    <Link href={`/pokemon/${dex}#counters`} className={`group ${cls}`}>
      {body}
    </Link>
  ) : (
    <article className={cls}>{body}</article>
  );
}
