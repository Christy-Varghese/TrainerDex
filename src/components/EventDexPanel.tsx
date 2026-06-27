"use client";

import { useEffect } from "react";
import type { PogoEvent } from "@/lib/types";
import RotomDexIcon from "./RotomDexIcon";

// ─── Script types ─────────────────────────────────────────────────────────────

interface DexScript {
  ytTitle: string;
  quickCatchup: string;
  datesLine: string;
  timelineHighlights: string[];
  finePrint: string[];
  walletFree: string[];
  walletPaid: string[];
  walletVerdict: string;
  metaCheck: string[];
  minMax: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDate(iso: string): string {
  const [datePart, timePart] = iso.split("T");
  const [, m, d] = datePart.split("-").map(Number);
  const hm = timePart?.substring(0, 5);
  return `${MONTHS[m - 1]} ${d}${hm && hm !== "00:00" ? ` at ${hm}` : ""}`;
}

function eventDatesLine(event: PogoEvent): string {
  const s = fmtDate(event.start);
  const e = fmtDate(event.end);
  return `${s} – ${e} (local time)`;
}

// ─── Script generator ─────────────────────────────────────────────────────────

function buildScript(event: PogoEvent): DexScript {
  const { eventType, name, extraData } = event;
  const spotlight = extraData?.spotlight;
  const bosses = extraData?.raidbattles?.bosses ?? [];
  const cd = extraData?.communityday;
  const datesLine = eventDatesLine(event);

  const featured = cd?.spawns?.[0]?.name ?? "the featured Pokémon";
  const topBoss = bosses[0];
  const shineBosses = bosses.filter((b) => b.canBeShiny).map((b) => b.name);
  const tier5s = bosses.filter((b) => b.tier === "5" || b.tier === "mega");

  switch (eventType) {

    // ── Community Day ──────────────────────────────────────────────────────────
    case "community-day":
      return {
        ytTitle: `Community Day Is LIVE — Every Bonus, Trap, and Min-Max Secret for ${featured}!`,
        quickCatchup: `Bzzzt! Community Day is the biggest catch event of the month — 6 hours of insane ${featured} spawns, a brand-new exclusive Charged Attack, and more Candy than you can handle. ${cd?.featuredMove ? `The move you're hunting is **${cd.featuredMove}** — and there's a strict window to get it. ` : ""}Miss the exclusive move window and you'll need an Elite TM to fix it. No pressure.`,
        datesLine,
        timelineHighlights: [
          `${featured} floods every biome for the full event window — highest spawn density you'll see all month`,
          ...(cd?.featuredMove ? [`Exclusive Charged Attack: **${cd.featuredMove}** — available during the event PLUS a 4-hour evolution grace period after`] : []),
          `2× Catch Candy (Pinap every catch), ¼ Egg Hatch Distance, boosted Shiny rates`,
          `1 extra Special Trade at 50% Stardust discount`,
          ...(cd?.bonuses?.map((b) => b.text) ?? []),
        ],
        finePrint: [
          `**The #1 trap: evolving too early.** The exclusive move only unlocks if you evolve DURING the event window or within 4 hours after it closes. Hold every evolution until you've caught your best IV.`,
          `Silver Pinap on high-IV encounters only — regular Pinap for everything else. Silver Pinap gives a catch rate boost AND double Candy; don't waste it on a 1-star.`,
          `Lure Modules last 3 hours during Community Day. Drop them at a PokéStop cluster at the start and farm both halves of the event window without moving far.`,
          `Rural/solo trainers: Incense spawns are boosted today. Pop one at the start and it keeps the featured Pokémon coming even without a dense PokéStop grid.`,
          `Do NOT use your Special Trade early — save it for a cross-region legendary or a Pokémon you're missing from trade distance. The Stardust saving is massive.`,
        ],
        walletFree: [
          `Full access to all boosted ${featured} spawns and boosted Shiny rates`,
          `2× Catch Candy + ¼ Hatch Distance bonuses apply to every trainer, no ticket needed`,
          `Standard Field Research tasks with event-themed rewards`,
        ],
        walletPaid: [
          `Community Day tickets typically add Special Research with guaranteed featured encounters (sometimes Shiny-locked rewards)`,
          `Extra Stardust or XP rewards through the exclusive paid research line`,
          `Some tickets include a Special Research story with a bonus encounter for the final evolution`,
        ],
        walletVerdict: `The free tier is already exceptional on Community Day — it's the best free event in the game. A ticket adds nice padding (bonus encounters, Stardust) but isn't required to get everything that matters. Buy it if you're a hardcore grinder; skip it if you're playing casually.`,
        metaCheck: [
          cd?.featuredMove
            ? `**${cd.featuredMove}** is the move to evaluate — if it makes ${featured}'s final evolution a top-tier attacker or GBL pick, this is a **mandatory event**. Check our Pokédex for the updated tier rating.`
            : `The final evolution's competitive value depends on the exclusive move. Check the moveset on our Pokédex page before deciding how hard to grind.`,
          `For PvP: a 1-star or 0-star ${featured} with ideal low-Attack IVs often outperforms a perfect 15/15/15 hundo under a CP cap — don't throw those "bad" IV catches away.`,
          `For raids: if the final evolution has a stat spread over 250 ATK in GO, it's likely a meta-relevant attacker. The exclusive move usually pushes it into the top 5 for its type.`,
        ],
        minMax: [
          `Activate a **Mega Evolution** matching ${featured}'s type at the start of the event — it boosts Candy earned on every catch of that type by +1 (or +2 for dual-type matches). Run it for the full 6 hours.`,
          `Stack: **Star Piece** + **Lucky Egg** + Incense in the final 30 minutes of the event when you mass-evolve your keepers. The evolution XP + event XP hits very hard.`,
          `Pre-sort your box before the event. Transfer any duplicates now so you can catch continuously without hitting storage limits mid-session.`,
          `Buddy your final evolution during the event — Adventure Sync distance counts toward the Buddy candy milestone even when the app is minimised.`,
          `Check the hundo CP for ${featured} BEFORE the event starts — knowing the exact CP means you instantly spot a perfect IV without opening the appraisal screen mid-stream.`,
        ],
      };

    // ── Spotlight Hour ─────────────────────────────────────────────────────────
    case "pokemon-spotlight-hour":
      return {
        ytTitle: `Spotlight Hour Guide: 60 Minutes${spotlight?.canBeShiny ? " — Is the SHINY Worth Hunting?" : " — Stack THIS Bonus HARD!"}`,
        quickCatchup: `Bzzzt! Spotlight Hour is every Tuesday from 6–7 PM local and it punches way above its one-hour runtime. ${spotlight ? `This week features **${spotlight.name}**${spotlight.canBeShiny ? " with Shiny available" : ""} — and the bonus is ${spotlight.bonus}.` : "The weekly bonus rotates, so check in-game before it starts."} One hour, zero preparation needed, maximum reward if you know the play.`,
        datesLine,
        timelineHighlights: [
          spotlight ? `Featured Pokémon: **${spotlight.name}**${spotlight.canBeShiny ? " ✨ Shiny available!" : ""}` : "Check the in-game news for this week's feature",
          spotlight ? `Active bonus: **${spotlight.bonus}**` : "Rotating weekly bonus — evolve / transfer / catch / stardust",
          `Event runs exactly 60 minutes (6:00 PM – 7:00 PM local time)`,
          `Boosted spawn density — featured Pokémon is everywhere during the hour`,
        ],
        finePrint: [
          `The bonus ONLY applies during the hour. If you're mass-evolving, mass-transferring, or farming Stardust — do it NOW during the window, not after.`,
          spotlight?.bonus?.toLowerCase().includes("evolv")
            ? "Pre-stage every evolution you're sitting on. Have them sorted in the 'transfer' view so you can chain evolves without fumbling the menu."
            : spotlight?.bonus?.toLowerCase().includes("transfer")
            ? "Sort your box by Candy count before the event. Mass-transfer from the bottom — you want to be touching the button, not scrolling."
            : "Pop your Star Piece or Lucky Egg as close to 6:00 PM as possible. Don't burn 90 seconds of the window doing admin.",
          `Rural players: Spotlight Hour doesn't need PokéStops. Featured spawns appear from the ticker even with one device and no lures. Pop Incense and stay put.`,
          `Don't waste time catching Pokémon that aren't featured unless they're rare. Volume on the spotlight Pokémon is the entire point.`,
        ],
        walletFree: [
          "100% free — Spotlight Hour has zero paid component",
          "Full bonus and full spawn boost with no ticket required",
        ],
        walletPaid: [
          "No paid tier — this event is completely free to play",
        ],
        walletVerdict: `Spotlight Hour is free. There is nothing to buy here. Just show up at 6 PM and play.`,
        metaCheck: [
          spotlight
            ? `${spotlight.name} is worth evaluating for PvP if it has a stat spread that fits a CP league. ${spotlight.canBeShiny ? "Shiny hunters: tap every single one." : "No Shiny this week — focus purely on IVs."}`
            : "Evaluate the featured Pokémon based on its final evolution's GO stats. If it's meta-relevant for raids or GBL, farm hard.",
          `Spotlight Hours are the best regular source of Candy for whatever Pokémon is featured. Use this hour to bulk up on Candy for a future power-up.`,
        ],
        minMax: [
          `Activate a **Mega Evolution** that type-matches the featured Pokémon — it grants +1 Candy per catch of that type (or even +2 for certain interactions). This stacks directly with any Catch Candy bonus.`,
          spotlight?.bonus?.toLowerCase().includes("stardust") || spotlight?.bonus?.toLowerCase().includes("candy")
            ? "Pinap Berry every catch this hour. Even combine with a Mega boost — the Candy multiplier is your entire income stream for 60 minutes."
            : "If the bonus is Stardust, run a Star Piece for the full hour. If it's XP, a Lucky Egg. Time the activation to 5:59 PM.",
          `Use Adventure Sync — keep walking during the hour. Buddy Candy + Egg distance counts on top of catch Candy.`,
        ],
      };

    // ── Raid Battles / Raid Day ────────────────────────────────────────────────
    case "raid-battles":
    case "raid-day": {
      const megaBosses = bosses.filter((b) => b.tier === "mega");
      return {
        ytTitle: topBoss
          ? `${topBoss.name} Raid Guide — Counters, Hundo CP, and Whether It's Worth Your Passes`
          : "New Raid Rotation Is Live — Here's What to Hit and What to Skip",
        quickCatchup: `Bzzzt! New raid bosses just dropped${topBoss ? ` and **${topBoss.name}** is the headliner` : ""}. ${shineBosses.length > 0 ? `Shiny hunters — ${shineBosses.join(", ")} ${shineBosses.length > 1 ? "all have" : "has"} the Shiny available this rotation. ` : ""}Here's your full breakdown so you know exactly which gyms to walk into and which ones to skip.`,
        datesLine,
        timelineHighlights: [
          topBoss ? `Featured boss: **${topBoss.name}**${topBoss.canBeShiny ? " ✨ Shiny available!" : ""}` : `${bosses.length} new raid bosses across all tiers`,
          ...(shineBosses.length > 0 ? [`Shiny-eligible bosses: ${shineBosses.join(", ")}`] : []),
          ...(megaBosses.length > 0 ? [`Mega raids: ${megaBosses.map((b) => b.name).join(", ")} — farm Mega Energy`] : []),
          ...(tier5s.length > 0 ? [`Tier 5 bosses: minimum 4–6 trainers recommended`] : []),
          `Weather-boosted catches land at Level 25 (vs. L20 standard) — higher CP, same Stardust cost`,
        ],
        finePrint: [
          `**You cannot solo a Tier 5 or Mega raid.** Minimum 4 competent trainers or 6 casual players. Show up without a lobby and you're wasting a Pass. Coordinate on Campfire or a local group chat first.`,
          `Remote Raid cap: you can only hold **3 Remote Raid Passes** at once. Use them during peak window — don't stockpile past 3 because they're capped.`,
          `The hundo CP is fixed — memorise it before you walk in. A weather-boosted hundo shows a different (higher) CP than a regular one. There are two numbers. Know both.`,
          `Type advantage isn't optional at Tier 5. A super-effective Level 35 attacker beats a neutral Level 50 one. Don't bring neutral DPS — it slows the whole lobby.`,
        ],
        walletFree: [
          "1 free Raid Pass per day from spinning any Gym disc",
          "All raid rewards (Rare Candy, TMs, Golden Razz) are available to free players",
          "Bonus Raid Passes sometimes granted during event periods — check the in-game news",
        ],
        walletPaid: [
          "Remote Raid Passes (160 coins each or bundles) let you chain raids from home",
          "Premium Battle Passes give +1 bonus Premier Ball per raid — marginal but real",
          "Raid Day tickets (if applicable) may grant extra passes and boosted Shiny rates",
        ],
        walletVerdict: topBoss
          ? `${topBoss.name} is worth spending passes on${topBoss.canBeShiny ? " — especially with the Shiny available" : ""}. Budget 5–8 passes if you're hunting a hundo; 2–3 if you just need the Pokédex entry. Skip Remote passes on Tier 1–3 bosses — walk to those.`
          : "Spend passes on the highest-tier bosses with Shiny availability first. Never Remote-raid a Tier 1–3 boss unless you physically can't walk to a gym.",
        metaCheck: [
          topBoss
            ? `**${topBoss.name}** — check the stat spread: ATK over 250 in GO = top-tier attacker. DEF over 200 = PvP wall. Under both thresholds = collect one for Pokédex and move on.`
            : "Evaluate each boss by its GO stat spread. Prioritise anything with 250+ ATK for Raid DPS or Pokémon with typed coverage moves you need.",
          ...(shineBosses.length > 0 ? [`Shiny versions are cosmetic but rare — expect roughly 1 in 20 raids. The meta check is the same for Shiny vs normal.`] : []),
          `Weather-boosted catches have a higher CP floor — the same IVs show a higher number. Don't confuse boosted CP with a lower-IV catch being "worse".`,
        ],
        minMax: [
          topBoss
            ? `Activate a **Mega Evolution** that matches ${topBoss.name}'s type weakness — it boosts all party members' damage of that type by 30%. The DPS increase can be the difference between a 5-trainer and 4-trainer clear.`
            : "Mega-evolve a Pokémon matching the boss's type weakness to boost lobby DPS by ~30%.",
          `Chain raids: finish one lobby, immediately join the next on Campfire before leaving the gym. The app keeps your pass active until you exit the raid UI.`,
          `For hundos: use your Gold Razz + Excellent Curveball. Every extra Premier Ball from being in the gym's team gets you closer to the catch. Never throw a non-Excellent on a 100% IV mon.`,
          `Stack your daily Raid Pass with the **last raid of the event** — you get the free pass regardless of when you use it, so burn it on the highest-value boss.`,
        ],
      };
    }

    // ── Raid Hour ─────────────────────────────────────────────────────────────
    case "raid-hour":
      return {
        ytTitle: `Raid Hour Speed-Run: How to Chain 10+ Legendary Raids in ONE Hour`,
        quickCatchup: `Bzzzt! Raid Hour runs every Wednesday from 6–7 PM and every Gym near you fills with the current Tier 5 boss. If you only do ONE raid session per week, this is the hour to do it — the gym density is unmatched and you can chain legendary encounters back-to-back if you play it right.`,
        datesLine,
        timelineHighlights: [
          "Every Gym within range fills with the current Tier 5 / Mega boss",
          "60-minute window — 6:00 PM to 7:00 PM local time",
          "Chain raids back-to-back: finish one, immediately join the next",
          "Remote Raid Passes let you chain from your couch with no travel",
        ],
        finePrint: [
          `**You can only hold 3 Remote Raid Passes at a time.** Use them as you go — don't start the hour with 2 in your bag and expect to chain 6+ remote raids.`,
          `Raid Hour lobbies fill faster than normal. If you're going in-person, move between gyms the second a raid finishes — don't linger in the post-raid screen.`,
          `Pre-set your counter Battle Party BEFORE 6 PM. Fumbling the team selector in a 120-second lobby timer costs you DPS and sometimes the whole raid if you're short-staffed.`,
          `Solo trainers: Remote raids are your friend here. Share your lobby code on Campfire or the official GO Discord — Raid Hour lobbies fill within seconds of being posted.`,
        ],
        walletFree: [
          "Free Raid Pass can be used once during the hour",
          "Full access to every Gym raid around you during the window",
        ],
        walletPaid: [
          "Remote Raid Passes let you chain without walking between gyms",
          "Stack 3 passes before the hour starts to immediately fire into 3+ raids",
        ],
        walletVerdict: `3 Remote passes during Raid Hour = 3 guaranteed legendary encounters in 60 minutes from your couch. That's the best ROI in the game per coin spent. Highly recommended if the current boss is meta-relevant or has a Shiny available.`,
        metaCheck: [
          "The boss is whoever's in the current rotation. Check the Raids page before Raid Hour to confirm if it's worth spending passes on.",
          "Raid Hour is the highest-volume legendary encounter source per week. If the boss is meta-relevant, this is where you farm hundos and Shinies.",
        ],
        minMax: [
          `Activate your **Mega Evolution** of the type that counters the boss BEFORE 6 PM — don't waste lobby time on the activation animation.`,
          `Post your lobby on Campfire the moment you enter it, not after it fills. Remote trainers join faster when codes appear early in the countdown.`,
          `Know the hundo CP BEFORE you start — checking the appraisal screen in the catch phase costs you 10–15 seconds per raid. Multiply that by 8 raids.`,
          `Adventure Sync: set your phone to screen-off walking mode between gyms. Buddy Candy keeps accruing even while you're speed-walking.`,
        ],
      };

    // ── GO Battle League ──────────────────────────────────────────────────────
    case "go-battle-league":
      return {
        ytTitle: `GO Battle League Guide: The ONE Mechanic That Wins More Games Than Anything Else`,
        quickCatchup: `Bzzzt! GO Battle League is the most skill-intensive thing in Pokémon GO and most trainers are losing to the same preventable mistakes over and over. The ranking system rewards consistency over luck — if you're losing series you should be winning, this breakdown will fix it.`,
        datesLine,
        timelineHighlights: [
          "5 free daily battles + unlimited with Raid Passes",
          "New season resets rank — climb early while matchmaking is soft",
          "Current leagues/cups rotate weekly — check the schedule in-game",
          "GBL encounters reward meta Pokémon including Legendaries",
        ],
        finePrint: [
          `**Shield baiting is the #1 skill gap.** Lead with a cheap Charged Attack first (Mud Shot → Earthquake bait). Force your opponent to burn a shield on a cheap move, then hit your big Charged Attack unblocked. This wins more games than any team-building decision.`,
          `**Don't shield a Pokémon that's about to faint.** A shield used on a 10 HP Pokémon is a free shield handed to your opponent on a silver platter.`,
          `PvP IVs are completely different from raid IVs. Under a CP cap, LOW Attack IVs let a Pokémon squeeze more HP and Defense into the budget. A 0/15/15 often beats 15/15/15 in Great League.`,
          `Master League is the ONLY format where raid hundos (15/15/15) are the ideal IV spread. In Great/Ultra League, a hundo is usually a liability.`,
        ],
        walletFree: [
          "5 free sets daily — that's 25 battles for free every day",
          "All GBL rewards (Stardust, encounters, TMs) accessible without spending",
        ],
        walletPaid: [
          "Premium passes unlock unlimited sets beyond the daily 5",
          "Only worth buying if you're actively climbing for end-of-season rank rewards",
        ],
        walletVerdict: `5 free sets covers most players perfectly. Only buy passes if you're chasing a specific end-of-season milestone reward and you're close to the cutoff. GBL rank is capped and resets anyway — don't overspend.`,
        metaCheck: [
          "Great League (1500 CP cap): Maximize HP + Defense IVs. Pokémon with high bulk and low Energy cost moves dominate.",
          "Ultra League (2500 CP cap): Legendaries and strong evolutions are viable. XL Candy investment is often required.",
          "Master League (no cap): Your raid hundos finally shine here. Mewtwo, Dialga, Zacian, Garchomp are top picks.",
          "Check PvPoke.com for current meta rankings before spending Stardust on a new team. The meta shifts with every cup rotation.",
        ],
        minMax: [
          `For the Walking requirement: walk with your **Buddy Pokémon** that you need Candy XL for. GBL unlocks battles per km walked — your buddy Candy XL accrues simultaneously.`,
          `Farm GBL encounters during the reward windows — encounters reward Pokémon from the current Season pool, often including meta picks that are hard to find in the wild.`,
          `Use your TMs wisely. Elite Fast TMs and Elite Charged TMs from GBL are the ONLY way to access certain exclusive moves. Don't spend them impulsively.`,
          `Shadow Pokémon do 20% more damage in PvP (at the cost of 20% more damage taken). A Shadow attacker with the right IVs completely redefines breakpoints in some matchups.`,
        ],
      };

    // ── GO Fest ───────────────────────────────────────────────────────────────
    case "pokemon-go-fest":
    case "live-event":
      return {
        ytTitle: `GO Fest ${name.match(/\d{4}/) ?? ""} — The COMPLETE Playbook: Regionals, Shinies & Ticket Breakdown`,
        quickCatchup: `Bzzzt! GO Fest is the biggest event in Pokémon GO and it only comes once a year — this is the weekend where everything in the game gets cranked to 11. Regional Pokémon appear globally, Shiny rates are through the roof, and exclusive raids run back-to-back. Don't wing this one.`,
        datesLine,
        timelineHighlights: [
          "Regional Pokémon available globally — your ONLY chance without travel for most of the year",
          "Massively boosted Shiny rates on ALL featured Pokémon for ticket holders",
          "Exclusive raid bosses and Legendary encounters only available during GO Fest",
          "Habitat rotations change the spawn pool every few hours — different Pokémon across the day",
          "Incense lasts longer and attracts GO Fest-specific spawns during the event",
          "Special Research with exclusive encounters for ticket holders",
        ],
        finePrint: [
          `**Regionals are the biggest trap.** They appear globally but their spawns are diluted across the full event pool. Don't just walk your usual route — cover as much ground as possible and prioritise any regional you see immediately.`,
          `Phone battery is your biggest enemy. GO Fest will drain a full charge in under 3 hours of active play. Bring a power bank. Charge the night before. Don't learn this lesson the hard way.`,
          `Rural trainers: Incense spawns still include regionals and event-exclusive Pokémon during GO Fest. Pop one per session and you won't feel locked out just because your area has no PokéStops.`,
          `Habitat rotations are on a schedule — the rarest Pokémon often only appear in one or two windows. Check the official schedule and plan which hours to play hardest.`,
        ],
        walletFree: [
          "Boosted spawns and massively increased wild Pokémon density",
          "Access to all Habitat rotations and their featured Pokémon",
          "Standard raid pool including event-exclusive bosses",
        ],
        walletPaid: [
          "Ticket holders get significantly boosted Shiny rates on ALL featured Pokémon — this is the main reason to buy",
          "Exclusive Special Research with guaranteed encounters and a unique story",
          "GO Pass / Ticket also unlocks additional event bonuses (extra Candy, XP, or encounters depending on the year)",
          "Exclusive access to the Masterwork Research (if applicable that year)",
        ],
        walletVerdict: `GO Fest ticket is the best-value ticket in the entire Pokémon GO calendar. The Shiny rate boost alone justifies the price if you plan to play all day. Buy on the Web Store to save the 30% Niantic app fee — it's the same ticket, cheaper direct.`,
        metaCheck: [
          "GO Fest typically introduces brand-new Pokémon or new Shiny variants. Check the announcement for debuts — first appearances often have the highest Shiny scarcity for years to come.",
          "Exclusive raid bosses are often the meta's next top attackers. Prioritise raid passes for any new Tier 5 or Mega boss you haven't caught yet.",
          "Shadow Pokémon from Rocket invasions during GO Fest often include meta Legendaries — watch for Giovanni encounters with increased frequency.",
        ],
        minMax: [
          `Run Incense + Lure Modules for the ENTIRE event window. GO Fest Incense attracts the rarest spawns — don't let it sit in your bag.`,
          `Activate the **Mega Evolution** matching the rarest spawn type you expect in each habitat. Switch Megas between habitat rotations to maximise Candy earned per type.`,
          `GO Snapshot during the event — it's a free bonus encounter that often includes event-exclusive Pokémon. Do it in the first 10 minutes; don't forget.`,
          `Buddy with your rarest Legendary during GO Fest. Adventure Sync + active Buddy = Candy XL accumulating while you walk between habitats all day.`,
          `Use a Silver Pinap on every first-encounter regional — boosted catch rate + guaranteed Candy is the correct play when you might not see that regional again for months.`,
        ],
      };

    // ── Max Mondays ───────────────────────────────────────────────────────────
    case "max-mondays":
      return {
        ytTitle: `Max Monday GUIDE: How to Actually Win Max Battles (And What You Can Solo vs. What You Can't)`,
        quickCatchup: `Bzzzt! Max Monday runs every Monday and it's the only way to earn Dynamax Candy XL and Max Particles outside of exploring Power Spots. This is strictly a team-sport event — show up solo to a high-tier Max Battle and you're going home empty-handed. Here's how to not waste your Dynamax energy.`,
        datesLine,
        timelineHighlights: [
          "Power Spots activate Dynamax Battles for the duration of Max Monday",
          "Earn **Dynamax Candy XL** by defeating the Dynamax Pokémon — the only regular source",
          "Max Particles required to Dynamax your own Pokémon in battle",
          "Tier 1 Max Battles can be soloed; Tier 5 / Max4 need a full group of 4",
        ],
        finePrint: [
          `**The biggest trap: attempting a high-tier Max Battle without a full group.** Tier 3+ battles are designed for 4 trainers. Show up solo or as 2 players and you will fail and waste passes.`,
          `You MUST coordinate in advance. Campfire, local Discord, or an in-person group are mandatory for Tier 4–5 Max Battles. There is no matchmaking — you join with people you know or you don't join at all.`,
          `Max Particles are capped. Farm Power Spots daily in the days leading up to Monday so you arrive with enough energy to Dynamax freely during the event window.`,
          `Rural players face a real barrier here — Max Battles require physical proximity to Power Spots. If you don't have one nearby, this event isn't accessible without travel.`,
        ],
        walletFree: [
          "Max Battles at Power Spots are free — no passes required to participate",
          "Dynamax Candy XL and Max Particle rewards are available to all players",
        ],
        walletPaid: [
          "No paid tier for Max Monday itself",
          "Max Battle Passes (if purchased) provide bonus rewards in some special Max events",
        ],
        walletVerdict: `Max Monday is free to play. The bottleneck isn't cost — it's coordination. Find your local group or a Campfire community before showing up, or you'll be standing next to a Power Spot with nobody to battle with.`,
        metaCheck: [
          "The featured Dynamax Pokémon changes weekly. A Dynamax Charizard or Machamp is significantly more valuable in Max Battles than a Dynamax Marowak — know the tier before you commit passes.",
          "Dynamax Candy XL is the bottleneck resource for building powerful Max teams. Any Pokémon with high Max Battle utility is worth farming Candy for during Max Monday.",
          "Max Moves (Max Strike, Max Guard, Max Spirit) matter more than raw DPS. A Pokémon with Max Guard or Max Spirit support roles can save an entire lobby from failing.",
        ],
        minMax: [
          `Pre-power your Max Moves before the battle starts. Max Strike Level 3 hits significantly harder than Level 1 — the Dynamax Candy investment pays off immediately.`,
          `Use **Max Spirit** (healing Max Move) if your team is under-levelled. Keeping the lobby alive longer generates more DPS than pure offense on a fragile team.`,
          `Coordinate shield timing: call out when the boss charges a big move in your group chat and coordinate **Max Guard** blocks — one player shielding isn't enough at Tier 5.`,
          `After the battle, immediately restart the Power Spot for another lobby. The cooldown is short. Back-to-back runs with the same group = maximum Candy XL per hour.`,
        ],
      };

    // ── Research ──────────────────────────────────────────────────────────────
    case "research":
    case "research-breakthrough":
      return {
        ytTitle: `Research Event Guide — How to Stack Tasks for MAX Encounters and FREE Legendaries`,
        quickCatchup: `Bzzzt! Research events are the lowest-effort, highest-reward category in Pokémon GO if you know which tasks to farm. Spin the right PokéStops, grab the right tasks, and the featured Pokémon come to you. Here's the no-fluff guide.`,
        datesLine,
        timelineHighlights: [
          "Event-exclusive Field Research tasks appear at PokéStops across the event window",
          "Completing 7 days of research stamps earns a Research Breakthrough encounter",
          "Featured Pokémon often have boosted Shiny rates in Research encounters vs. wild",
          "Tasks reset daily — new stamps available every day at midnight local time",
        ],
        finePrint: [
          `Field Research tasks are random from PokéStops. Spin until you find the event-specific ones that reward the featured Pokémon — then delete the rest. You can hold any task from any Stop.`,
          `**Research Breakthrough encounters have a higher Shiny chance than wild.** If the Breakthrough Pokémon has a Shiny available, these encounters are premium Shiny sources.`,
          `You only get ONE stamp per day. Completing 20 tasks on day 1 still only advances one stamp. Pace yourself — one research completion per day gets you to Breakthrough in exactly 7 days.`,
          `Some research tasks appear only during specific event windows. Don't wait until the last day — tasks disappear when the event ends even if you collected them.`,
        ],
        walletFree: [
          "All Field Research tasks are free — spin PokéStops and complete them",
          "Research Breakthrough is free and available to every trainer with 7 stamps",
          "Event research rewards (encounters, items) require no ticket",
        ],
        walletPaid: [
          "Special Research (paid) may offer a story with exclusive Pokémon or unique items",
          "Paid Special Research sometimes includes Shiny-locked encounter rewards",
        ],
        walletVerdict: `Field Research is entirely free. Paid Special Research is worth it only if the exclusive encounter or Shiny-locked reward is something you genuinely want and can't get otherwise.`,
        metaCheck: [
          "Research encounters are caught at Level 15 with a minimum 10/10/10 IV floor — better odds than wild catches for competitive IVs.",
          "If the Breakthrough or event Pokémon is meta-relevant (GBL, raids), farm research actively this event window. You won't get this IV floor or Shiny chance outside of this window.",
        ],
        minMax: [
          `Spin every PokéStop you walk past — don't wait for specific stops. The event task you want can drop from any Stop during the event.`,
          `Hold multiple copies of the best task (e.g. 'Catch 5 Pokémon → Rare Pokémon encounter'). You can hold 3 tasks simultaneously; queue the same task 3 times for back-to-back encounters.`,
          `Use Pinap Berry on all Research encounters for the featured Pokémon — you can't throw Golden Razz on a guaranteed encounter, but Candy is always worth more.`,
          `Buddy your Research encounter target during the event — Adventure Sync counts Buddy distance toward Candy XL while you're walking and tapping PokéStops.`,
        ],
      };

    // ── Season ────────────────────────────────────────────────────────────────
    case "season":
      return {
        ytTitle: `New Season in Pokémon GO — Everything That Changes and How to Start STRONG`,
        quickCatchup: `Bzzzt! A new Season just kicked off and it reshuffles almost everything — spawn pools, Egg rosters, GBL rank, hemisphere bonuses, and buddy candy. If you don't read the season notes, you'll be grinding the wrong things all month. Here's the quick hit.`,
        datesLine,
        timelineHighlights: [
          "GO Battle League rank resets — climb early while lower-rank matchmaking is softer",
          "Egg pool rotates — new Pokémon in 2km, 5km, 7km, 10km, and 12km eggs",
          "Hemisphere spawns change — different regional-equivalent Pokémon by location",
          "Season bonuses apply passively (extra Raid Passes, buddy distance reductions, etc.)",
          "Seasonal Research and themed PokéStop field tasks go live immediately",
        ],
        finePrint: [
          `**Hatch all your old eggs before the season flips.** Eggs you collected before the reset contain the OLD egg pool. Don't waste incubator time on outdated eggs if the new pool is better.`,
          `GBL reset only resets your visual rank — your Elo score partially carries. Early-season matchmaking is softer because of rank redistribution; the first week is the easiest climbing window.`,
          `Hemisphere spawns: check which version's wild pool matches what you're missing. If your hemisphere has what you need, grind it NOW — it rotates out next season.`,
        ],
        walletFree: [
          "Season bonuses apply to all players — extra daily Raid Passes, buddy distance reductions, and spawn changes are free",
          "New Field Research tasks are available to everyone from PokéStop spins",
        ],
        walletPaid: [
          "Seasonal GO Battle League passes for unlimited sets",
          "Season-timed Special Research sometimes offers additional encounters",
        ],
        walletVerdict: `Seasons are background mechanics — there's nothing to buy specifically for a season. The only recurring purchase decision is whether to buy GBL passes, which is already covered in the GBL guide.`,
        metaCheck: [
          "New seasons sometimes introduce new moves or rebalance existing ones. Check the patch notes carefully — meta shifts happen at season boundaries.",
          "The new egg pool is the biggest meta signal. If a new meta Pokémon appears in eggs (especially 10/12km), run incubators aggressively in the first week.",
        ],
        minMax: [
          `Use the GBL early-season soft matchmaking: grind your first 50 battles in the first week. You'll bank wins while climbing through redistributed rank brackets.`,
          `Swap your Buddy to whichever Pokémon's Candy XL you're closest to maxing. New season = new seasonal milestone research that often gives Buddy Candy XL.`,
          `Check the Seasonal Incubator bonus. Some seasons grant bonus hatch distance reduction — if so, run all your incubators simultaneously to get maximum distance credit per step.`,
        ],
      };

    // ── Ticketed / Choose Your Path ───────────────────────────────────────────
    case "ticketed-event":
    case "choose-your-path":
      return {
        ytTitle: `${name} — The HONEST Breakdown: Which Path to Choose and Is the Ticket Worth It?`,
        quickCatchup: `Bzzzt! ${name} is a choose-your-adventure style ticketed event — and the path you pick is permanent. One wrong choice and you'll be missing out on the Pokémon you actually needed. Here's everything you need to know before you tap that button.`,
        datesLine,
        timelineHighlights: [
          "Two paths to choose — each offers different featured Pokémon and bonuses",
          "Your path choice is **permanent** — no switching after selection",
          "Boosted Shiny rates on featured Pokémon for ticket holders",
          "Special Research with exclusive encounters tied to your chosen path",
          "Ticket holders also get broader event spawns beyond their path rewards",
        ],
        finePrint: [
          `**Your choice is PERMANENT.** Before tapping your path, look up BOTH options and decide based on which Pokémon you actually still need — not which one looks cooler.`,
          `Even if you don't buy the ticket, the spawn pool is boosted during the event window. Free players still get massively elevated encounters compared to a normal day.`,
          `Path Pokémon often have Shiny availability. Confirm which path features a new Shiny debut before choosing — first-release Shinies are rare and may not return for months.`,
          `Complete the free research tasks before the paid ones. They often converge on the same bonus encounters and you'll save ticket-exclusive task slots for the harder rewards.`,
        ],
        walletFree: [
          "Boosted wild spawns with elevated Shiny rates during the event window",
          "Free standard research tasks leading to event-featured encounters",
          "Access to both path Pokémon in the wild (reduced rates compared to ticket holders)",
        ],
        walletPaid: [
          "Ticket unlocks Special Research with guaranteed path Pokémon encounters (potentially Shiny-locked)",
          "Significantly boosted Shiny rates on ALL featured Pokémon for the event duration",
          "Additional bonus encounters and items through the exclusive research line",
        ],
        walletVerdict: `Ticket is worth it if your chosen path features a Shiny debut or a Pokémon you genuinely need. Skip the ticket if both paths offer Pokémon you already have in abundance — the free spawn boost gives you plenty of catches without paying. Always buy on the Web Store to avoid the 30% in-app fee.`,
        metaCheck: [
          "Evaluate each path's Pokémon by their final evolution's GO stat spread. Check which path has the higher-ranked attacker or GBL pick before committing.",
          "If either path features a Pokémon with upcoming Shadow or Mega potential, that increases its long-term value significantly.",
        ],
        minMax: [
          `Mega-evolve a Pokémon matching the type of your chosen path's featured Pokémon before the event starts. The Candy boost applies to every catch of that type throughout the event.`,
          `Clear your bag before the event. Ticketed events generate a lot of balls, potions, and revives — a full bag means missed rewards from PokéStop spins during your play session.`,
          `Use Lucky Egg during your mass-evolution window at the end of the event. Stacking the path encounter XP + evolution XP under a Lucky Egg is a significant levelling shortcut.`,
        ],
      };

    // ── Default fallback ──────────────────────────────────────────────────────
    default:
      return {
        ytTitle: `${name} — The Full Trainer Breakdown: Bonuses, Meta, and Min-Max Tips`,
        quickCatchup: `Bzzzt! ${name} just went live and if you're not reading up before you play, you're leaving Candy, Stardust, and Shinies on the table. Here's everything you need to know to play this event at full capacity.`,
        datesLine,
        timelineHighlights: [
          "Boosted spawn rates on featured Pokémon for the full event window",
          "Elevated Shiny rates — tap every spawn you see, especially early in the session",
          "Check the in-game news for event-specific Field Research tasks and bonuses",
          "Incense and Lures attract the featured spawns even in low-density areas",
        ],
        finePrint: [
          `Pop a Star Piece and Lucky Egg at the very START of the event, not 20 minutes in. Every catch and evolve from the first second counts toward the multiplier.`,
          `Silver Pinap on any high-IV encounter of the featured Pokémon — the catch rate boost AND the double Candy is worth the premium item on a keeper.`,
          `Rural players: Incense keeps featured spawns coming even without PokéStops nearby. It's worth activating even if you can't walk — spawns come to you.`,
          `Check your storage before playing. A full Pokémon or Item box means missed encounters and rewards. Clear space before the event window opens.`,
        ],
        walletFree: [
          "All event-featured spawns and Shiny encounters are available to free players",
          "Standard bonus active for all trainers regardless of ticket status",
          "Field Research tasks from PokéStops accessible to everyone",
        ],
        walletPaid: [
          "Any paid Special Research or ticket adds bonus encounters and potentially boosted Shiny rates",
          "Check the in-game shop for whether this event has a ticket tier and what it specifically includes",
        ],
        walletVerdict: `Check whether this specific event has a paid tier in the in-game shop. If it's a standard event with no ticket, everything is free. If there's a ticket, compare the exclusive rewards against the price — boosted Shiny rates are almost always the key justifier.`,
        metaCheck: [
          "Evaluate the featured Pokémon's final evolution stats in GO. ATK over 250 = top raider. High bulk + right typing = GBL pick. Under both thresholds = fill the Pokédex and move on.",
          "Check if any featured Pokémon has a Shiny debut this event — first-appearance Shinies are the scarcest collectibles in the game and may not return for a long time.",
        ],
        minMax: [
          `Activate a **Mega Evolution** that type-matches the featured Pokémon to earn +1 Candy per catch of that type throughout the event. Check what types are featured and switch Megas accordingly.`,
          `Curveball + Excellent throw = the highest single-throw catch bonus in the game. It's a ×1.7 (curve) × 1.99 (Excellent) multiplier. Practice it before the event window.`,
          `Stack your Buddy miles during the event. Any Pokémon you're working toward Candy XL for — buddy it during the event so Adventure Sync counts distance toward XL milestones while you play.`,
          `Snap a GO Snapshot during the event window for a surprise bonus encounter. It only takes 10 seconds and often rewards a featured or event-exclusive Pokémon.`,
        ],
      };
  }
}

// ─── Section component ────────────────────────────────────────────────────────

function ScriptSection({
  emoji,
  number,
  heading,
  items,
}: {
  emoji: string;
  number: number;
  heading: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
        <span className="text-base leading-none">{emoji}</span>
        <span className="text-sky-600 dark:text-sky-400">{number}.</span>
        {heading}
      </p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400 grid place-items-center">
              <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span
              className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{
                __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Panel component ──────────────────────────────────────────────────────────

interface Props {
  event: PogoEvent | null;
  onClose: () => void;
}

export default function EventDexPanel({ event, onClose }: Props) {
  useEffect(() => {
    if (!event) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [event, onClose]);

  useEffect(() => {
    if (event) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [event]);

  if (!event) return null;

  const s = buildScript(event);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal
        aria-label={`Dex breakdown for ${event.name}`}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl animate-sheet-up rounded-t-3xl bg-white shadow-2xl dark:bg-[#131a2e] overflow-hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-white/20" />
        </div>

        {/* Scrollable content */}
        <div className="max-h-[82vh] overflow-y-auto overscroll-contain px-5 pb-10 pt-2">

          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="mascot-float shrink-0">
                <RotomDexIcon size={52} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500">Rotom Dex says</p>
                <h2 className="text-base font-bold leading-snug text-slate-900 dark:text-white">{event.name}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">{s.datesLine}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="mt-1 shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 transition"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* YouTube-style title */}
          <div className="mb-4 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-0.5">🚀 Dex&apos;s Video Breakdown</p>
            <p className="text-sm font-bold text-white leading-snug">{s.ytTitle}</p>
          </div>

          {/* Quick Catchup */}
          <div className="mb-5 rounded-2xl rounded-tl-sm border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700/30 dark:bg-amber-900/20">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Bzzzt! Quick Catchup</p>
            <p
              className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{
                __html: s.quickCatchup.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          </div>

          {/* 5 Sections */}
          <div className="space-y-3.5">
            {/* 1 — Timeline */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                <span className="text-base leading-none">⏱️</span>
                <span className="text-sky-600 dark:text-sky-400">1.</span>
                The Timeline &amp; &ldquo;The Hype&rdquo;
              </p>
              <ul className="space-y-2.5">
                {s.timelineHighlights.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-0.5 shrink-0 text-amber-500 text-sm">★</span>
                    <span
                      className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{
                        __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* 2 — Fine Print */}
            <ScriptSection emoji="🕵️" number={2} heading='The Fine Print (The Stuff They Don&apos;t Tell You!)' items={s.finePrint} />

            {/* 3 — Wallet Check */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                <span className="text-base leading-none">💰</span>
                <span className="text-sky-600 dark:text-sky-400">3.</span>
                The Wallet Check: Is the Ticket Worth It?
              </p>
              <div className="space-y-2.5">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Free rewards</p>
                  <ul className="space-y-1.5">
                    {s.walletFree.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        <span className="shrink-0 text-emerald-500">✓</span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Paid / ticket</p>
                  <ul className="space-y-1.5">
                    {s.walletPaid.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        <span className="shrink-0 text-amber-500">🎟</span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-1 rounded-xl bg-sky-50 px-3 py-2.5 dark:bg-sky-900/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-0.5">The Verdict</p>
                  <p
                    className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                    dangerouslySetInnerHTML={{
                      __html: s.walletVerdict.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 4 — Meta Check */}
            <ScriptSection emoji="📊" number={4} heading="The Meta Check: Box Filler or Meta Killer?" items={s.metaCheck} />

            {/* 5 — Min-Max Strategy */}
            <ScriptSection emoji="🔄" number={5} heading="Rotom's Secret Min-Max Strategy" items={s.minMax} />
          </div>

        </div>
      </div>
    </>
  );
}
