# TrainerDex

Your all-in-one Pokémon GO companion — events, raids, IV references, and more, in
one place. No more hopping between sites: TrainerDex consolidates event schedules,
raid bosses, counters, shiny/hundo references, and updates into a single, fast,
mobile-first hub.

Built with **Next.js 16** (App Router) + **Tailwind CSS v4**.

## Status

**Phase 1 — Events Hub.** The home page is a live Events browser:

- **Happening Now** and **Upcoming Events** sections, each split into
  time-proximity groups (`Ends Today`, `Ends This Week`, `Starts Next Week`, …)
  shown as centered pill dividers.
- **Filter bar** — filter by event type (Community Day, Spotlight Hour, Raid
  Hour, Research, …). Only types present in the current data appear.
- **Quick-nav bar** — Events (live); Raids, Research, Shiny, IV Tools, Promo
  Codes, Eggs marked *coming soon*.
- **Event cards** — type badge, name, local date/time range, live countdown, and
  a key detail line (bonus / boss / featured move).

Everything stays on TrainerDex — no external navigation.

## Data

Event data comes from the public [ScrapedDuck](https://github.com/bigfoott/ScrapedDuck)
feed (Leek Duck data), revalidated hourly via Next's data cache. A bundled seed
dataset (`src/lib/seed-events.ts`) renders the site offline / when the feed is
unreachable. Source is attributed in the footer.

Times are stored as local-naive ISO strings, so each trainer sees events in their
own timezone with no conversion math.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx        # Events hub — fetches feed, buckets by time proximity
    layout.tsx      # Root layout, metadata, fonts
  components/
    EventsBrowser.tsx  # Client: quick-nav, filter bar, pill-divider sections
    EventCard.tsx      # Event card with badge + live countdown
    Countdown.tsx      # Live ticking countdown (client)
    Header.tsx / Footer.tsx
  lib/
    events.ts       # Feed fetch + per-type display metadata
    time.ts         # Local-time parsing, countdown, proximity bucketing
    types.ts        # Event schema (mirrors ScrapedDuck)
    seed-events.ts  # Offline fallback dataset
```

## Roadmap (Next Phase)

- `/events/[id]` internal detail pages (no external navigation).
- Raids & battle guides, IV / hundo tools, shiny references, promo codes, eggs.
- Downloadable visual assets and a news feed.

---

Unofficial fan-made resource. Not affiliated with Niantic, The Pokémon Company, or
Nintendo. Pokémon and Pokémon GO are trademarks of their respective owners.
