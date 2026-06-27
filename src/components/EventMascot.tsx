"use client";

import { useState, useEffect, useCallback } from "react";
import type { EventType } from "@/lib/types";
import RotomDexIcon from "./RotomDexIcon";

interface MascotTip {
  intro: string;
  body: string;
}

const EVENT_TIPS: Record<string, MascotTip[]> = {
  "community-day": [
    {
      intro: "Community Day alert!",
      body: "Only evolve your featured Pokémon during the event window — the exclusive move is locked to that 4-hour grace period after the event ends.",
    },
    {
      intro: "Berry strategy!",
      body: "Silver Pinap Berries boost both catch rate and Candy count. Save them for high-IV encounters when the 2× Catch Candy bonus is active.",
    },
    {
      intro: "Egg trick!",
      body: "Hatch Distance drops to ¼ during Community Day. Fill every incubator the moment the event starts to burn distance four times faster.",
    },
    {
      intro: "Trade window!",
      body: "Trades cost 50% less Stardust and you get one extra Special Trade. Use it on a Legendary or cross-regional Pokémon for massive savings.",
    },
  ],
  "raid-battles": [
    {
      intro: "Raid ready?",
      body: "Weather-boosted bosses catch at Level 25 instead of 20 — higher CP, same Stardust cost. Always check the boost type before you join.",
    },
    {
      intro: "Hundo hunting!",
      body: "100% IV raid catches always land at the same CP. Memorise the hundo value from our Raids page before you throw — if it matches, it's perfect.",
    },
    {
      intro: "Counter tip!",
      body: "Super-effective attackers beat high-CP neutral ones every time. Build a few mono-type teams (Fire, Water, Dragon) so you're ready for any rotation.",
    },
  ],
  "raid-hour": [
    {
      intro: "Raid Hour is live!",
      body: "Gyms stay full all hour — coordinate in advance so you always have a lobby to jump into. Remote Raid Passes help you chain raids fast.",
    },
    {
      intro: "Remote cap!",
      body: "You can only hold 3 Remote Raid Passes at once. Use them during Raid Hour to maximise legendary encounters before the hour ends.",
    },
  ],
  "raid-day": [
    {
      intro: "Raid Day!",
      body: "Boosted Shiny rates and frequent spawns all day. Stack weather boost, use Golden Razz on high-IV encounters, and keep your passes stocked.",
    },
  ],
  "pokemon-spotlight-hour": [
    {
      intro: "Spotlight Hour!",
      body: "Each Spotlight Hour rotates a unique bonus — Catch Candy, Stardust, or Transfer Candy. Mass-evolve or transfer during that exact hour to stack the payout.",
    },
    {
      intro: "Shiny hunting!",
      body: "The featured Pokémon floods every biome for a full hour. Tap every single one — volume is the key to finding a Shiny.",
    },
  ],
  "go-battle-league": [
    {
      intro: "Battle tip!",
      body: "Bait shields with a cheap Charged Attack first, then hit your big move unblocked. Shield baiting is the single highest-leverage skill in GO Battle League.",
    },
    {
      intro: "PvP IV secret!",
      body: "Low Attack IV lets a Pokémon stay under the CP cap while maximising bulk. A 0/15/15 spread often beats a perfect 15/15/15 in Great League.",
    },
  ],
  "pokemon-go-fest": [
    {
      intro: "GO Fest is here!",
      body: "Rare regional Pokémon appear globally during GO Fest. Prioritise anything you can't normally find in your region — they won't be this easy to catch again soon.",
    },
    {
      intro: "Ticket bonus!",
      body: "Ticket holders get boosted Shiny rates across all featured Pokémon. Even free players see massively enhanced spawns — it's worth playing all day.",
    },
  ],
  "max-mondays": [
    {
      intro: "Max Monday!",
      body: "Max Battles need a full lobby to go smoothly. Coordinate in Campfire or with local trainers before the hour so you're never stuck waiting.",
    },
  ],
  "choose-your-path": [
    {
      intro: "Choose Your Path!",
      body: "Both paths give different Pokémon and bonuses — check which featured spawns align with what you still need before committing your choice.",
    },
  ],
  default: [
    {
      intro: "Trainer tip!",
      body: "Curveball throws add a ×1.7 catch bonus on top of Nice/Great/Excellent. Always spin — it's free extra catch rate on every encounter.",
    },
    {
      intro: "Free raid passes!",
      body: "You get one free Raid Pass per day by spinning a Gym Photo Disc. Never spend PokéCoins on regular passes — save them for Remote raids.",
    },
    {
      intro: "Buddy smartly!",
      body: "Keep your active Buddy walking to earn Candy XL for powering past Level 40. Adventure Sync counts distance even when the app is closed.",
    },
    {
      intro: "Stardust rule!",
      body: "Stardust is the rarest resource in the game. Only power up Pokémon you'll use in PvP, raids, or gym defence — never for the Pokédex entry.",
    },
  ],
};

function getTipsForTypes(types: EventType[]): MascotTip[] {
  for (const type of types) {
    if (EVENT_TIPS[type]) return EVENT_TIPS[type];
  }
  return EVENT_TIPS.default;
}

interface Props {
  activeEventTypes: EventType[];
}

export default function EventMascot({ activeEventTypes }: Props) {
  const tips = getTipsForTypes(activeEventTypes);
  const [tipIndex, setTipIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (dismissed || tips.length <= 1) return;
    const id = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 9000);
    return () => clearInterval(id);
  }, [dismissed, tips.length]);

  const advance = useCallback(() => setTipIndex((i) => (i + 1) % tips.length), [tips.length]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => setDismissed(true), 300);
  };

  if (dismissed) return null;

  const tip = tips[tipIndex];

  return (
    <div
      className={[
        "mb-6 flex items-end gap-3 sm:gap-4 transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
      ].join(" ")}
      aria-live="polite"
      aria-label="TrainerDex mascot tips"
    >
      {/* Floating mascot */}
      <div className="shrink-0 mascot-float" aria-hidden>
        <RotomDexIcon size={72} />
      </div>

      {/* Speech bubble */}
      <div className="relative min-w-0 flex-1">
        {/* Bubble tail */}
        <div
          className="absolute -left-2 bottom-5 h-3 w-3 rotate-45 border-b border-l border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"
          aria-hidden
        />

        <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white p-4 shadow-md dark:border-white/10 dark:bg-white/5">
          <div
            key={tipIndex}
            className="animate-fade-in"
          >
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-sky-500">
              {tip.intro}
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {tip.body}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            {/* Dot nav */}
            <div className="flex items-center gap-1" role="tablist" aria-label="Tip navigation">
              {tips.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === tipIndex}
                  aria-label={`Tip ${i + 1}`}
                  onClick={() => setTipIndex(i)}
                  className={[
                    "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                    i === tipIndex
                      ? "w-5 bg-sky-500"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-white/20",
                  ].join(" ")}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {tips.length > 1 && (
                <button
                  onClick={advance}
                  className="text-xs font-medium text-sky-500 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
                >
                  Next tip →
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

