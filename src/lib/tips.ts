// Tips & Tricks grounded in official Pokémon GO mechanics, as stated in the
// official newsroom (https://pokemongo.com/en/news) and event pages. Each tip
// is evergreen gameplay strategy — not a dated announcement — so it stays
// useful between events. Where a tip restates an official bonus verbatim, the
// `source` links the article it came from.

export type TipCategory = "community-day" | "raids" | "catching" | "battle" | "eggs";

export interface Tip {
  title: string;
  body: string;
  /** Optional official article slug backing the tip. */
  sourceSlug?: string;
}

export interface TipGroup {
  category: TipCategory;
  label: string;
  emoji: string;
  tips: Tip[];
}

/** Find the tip group for a category (used to surface related tips on news pages). */
export function getTipGroup(category: TipCategory): TipGroup | undefined {
  return TIP_GROUPS.find((g) => g.category === category);
}

export const TIP_GROUPS: TipGroup[] = [
  {
    category: "community-day",
    label: "Community Day",
    emoji: "🌟",
    tips: [
      {
        title: "Evolve inside the move window",
        body: "The exclusive Charged Attack only comes from evolving during the event or up to four hours afterwards. Save your evolutions for that window — never evolve early.",
        sourceSlug: "communityday-july-2026-sobble",
      },
      {
        title: "Stack the 2× Candy bonus",
        body: "Catching gives 2× Candy and, for level 31+, double the chance at Candy XL. Use Pinap/Silver Pinap Berries to multiply Candy further while you farm the featured Pokémon.",
        sourceSlug: "communityday-july-2026-sobble",
      },
      {
        title: "Lures run long — plan a spot",
        body: "Lure Modules last one hour during Community Day and attract the featured Pokémon, which keeps its boosted Shiny odds. Park at a cluster of lured PokéStops for steady spawns.",
        sourceSlug: "communityday-july-2026-sobble",
      },
      {
        title: "Trade cheap during the window",
        body: "Trades cost 50% less Stardust and you get one extra Special Trade. Use it on a high-cost trade (Legendary or cross-region) to bank the biggest savings.",
        sourceSlug: "communityday-july-2026-sobble",
      },
    ],
  },
  {
    category: "raids",
    label: "Raids",
    emoji: "🛡️",
    tips: [
      {
        title: "Memorize the hundo CP",
        body: "A 100% IV raid catch always shows the same CP. Check the hundo number on our Raids page before you throw — if the encounter matches, it's perfect. The ☀️ value is the weather-boosted CP.",
      },
      {
        title: "Hunt in boosted weather",
        body: "Weather-boosted bosses catch at level 25 instead of 20 — higher CP and a stronger Pokémon for the same dust. Check the boost weather on each raid card.",
      },
      {
        title: "Counter by type, not by CP",
        body: "A super-effective attacker beats a higher-CP neutral one. Build a few mono-type counter teams (Fire, Water, Dragon) so you're ready for any rotation.",
      },
    ],
  },
  {
    category: "catching",
    label: "Catching",
    emoji: "🎯",
    tips: [
      {
        title: "Spotlight Hour = stack the bonus",
        body: "Each weekly Spotlight Hour adds a single rotating bonus (e.g. 2× Catch Stardust or 2× Candy). Mass-evolve or mass-transfer during that exact hour to multiply the payout.",
      },
      {
        title: "Excellent throws on the small circle",
        body: "Wait for the target ring to shrink, then throw for an Excellent bonus — higher catch rate and more XP. Curveballs add another multiplier on top.",
      },
      {
        title: "Save snapshots during events",
        body: "Many events reward a snapshot with a surprise spawn. Snap a photo during the event window for a free extra encounter.",
        sourceSlug: "communityday-july-2026-sobble",
      },
    ],
  },
  {
    category: "battle",
    label: "Battle (PvP)",
    emoji: "🥊",
    tips: [
      {
        title: "Bait shields with cheap moves",
        body: "Lead with a low-energy Charged Attack to force the opponent to burn a shield, then land your heavy hitter unblocked.",
      },
      {
        title: "Watch new attack power splits",
        body: "Moves often have different power in PvP vs raids — e.g. Snipe Shot is 65 power (with a chance to raise Attack) in Trainer Battles but 100 in gyms and raids. Pick movesets per format.",
        sourceSlug: "communityday-july-2026-sobble",
      },
      {
        title: "Respect the league CP cap",
        body: "Great League caps at 1500 CP. A Pokémon with lower Attack IV can hit higher stat totals under the cap — the 'best' PvP IV is often the opposite of a raid hundo.",
      },
    ],
  },
  {
    category: "eggs",
    label: "Eggs & Hatching",
    emoji: "🥚",
    tips: [
      {
        title: "Incubate during hatch-distance bonuses",
        body: "Community Day gives 1/4 Egg Hatch Distance. Place eggs in incubators right as the event starts to burn distance four times faster.",
        sourceSlug: "communityday-july-2026-sobble",
      },
      {
        title: "Use the unlimited incubator for short eggs",
        body: "Reserve paid incubators for 10 km and 12 km eggs; let the free orange incubator handle 2 km and 5 km so you never waste a charge.",
      },
    ],
  },
];
