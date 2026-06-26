import Link from "next/link";
import { contextHundo, findByName, isShadowName, spriteUrl, typeColor } from "@/lib/pokedex";
import { isSpecialBackground } from "@/lib/special";
import { shinyOddsFor } from "@/lib/shiny";
import type { EventType } from "@/lib/types";
import ShadowBadge from "./ShadowBadge";
import SpecialBgIcon from "./SpecialBgIcon";
import Icon from "./Icon";
import SpriteImage from "./SpriteImage";

interface Props {
  name: string;
  /** Fallback art from the event feed if the Pokémon isn't in our Pokédex. */
  image?: string;
  canBeShiny: boolean;
  eventType: EventType;
  /** Optional override label, e.g. a raid tier ("5★ Raid"). */
  context?: string;
}

/**
 * Enriched featured-Pokémon card: links to the Pokédex entry and surfaces the
 * trainer-relevant numbers — hundo (100% IV) CP and the approximate shiny odds
 * for this event context — alongside types and region.
 */
export default function FeaturedMon({ name, image, canBeShiny, eventType, context }: Props) {
  const dex = findByName(name);
  const odds = shinyOddsFor(eventType, canBeShiny);
  const art = dex ? spriteUrl(dex.dex) : image;
  const shadow = isShadowName(name);
  const specialBg = dex ? isSpecialBackground(dex.dex) : false;
  // The shadow-fire image marks Shadow Pokémon, so drop the word from the label.
  const displayName = name.replace(/^shadow\s+/i, "");

  const inner = (
    <>
      <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-slate-100 dark:bg-white/10">
        {art && <SpriteImage src={art} alt={displayName} size={56} className="h-14 w-14 drop-shadow-sm" />}
        {shadow && (
          <span className="absolute left-0.5 top-0.5">
            <ShadowBadge size={5} />
          </span>
        )}
        {specialBg && (
          <span className="absolute bottom-0.5 right-0.5">
            <SpecialBgIcon size={4} />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-900 dark:text-white">{displayName}</span>
          {dex && <span className="text-xs text-slate-400">#{dex.dex}</span>}
          {canBeShiny && <Icon name="sparkles" title="Shiny available" className="text-amber-500" />}
        </div>

        {dex ? (
          <>
            <div className="mt-1 flex flex-wrap gap-1">
              {dex.types.map((t) => (
                <span key={t} className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${typeColor(t)}`}>
                  {t}
                </span>
              ))}
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                {dex.region}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {(() => {
                const h = contextHundo(dex, eventType, shadow);
                return (
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    {h.label} hundo <span className="font-bold text-slate-900 dark:text-white">{h.cp.toLocaleString()}</span>
                    {h.boostedCp !== h.cp && (
                      <span className="ml-1 inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400">
                        / <Icon name="sun" /> {h.boostedCp.toLocaleString()}
                      </span>
                    )}
                  </span>
                );
              })()}
              {odds && (
                <span className="rounded-md bg-amber-50 px-2 py-1 text-amber-700">
                  Shiny ≈ <span className="font-bold">{odds.ratio}</span>
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="mt-1 text-xs text-slate-400">
            {context ?? "Featured"}
            {odds && <span className="ml-1 text-amber-600">· shiny ≈ {odds.ratio}</span>}
          </p>
        )}
      </div>

      {dex && (
        <Icon
          name="chevronRight"
          className="self-center text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-500"
        />
      )}
    </>
  );

  const cls =
    "group flex gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-white/10 dark:bg-white/5";

  return dex ? (
    <Link href={`/pokemon/${dex.dex}`} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls.replace("group ", "")}>{inner}</div>
  );
}
