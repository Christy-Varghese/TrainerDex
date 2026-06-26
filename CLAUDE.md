@AGENTS.md

# TrainerDex — CLAUDE.md

> Full project context for Claude Code. Read this before writing any code.

---

## Project Identity

**TrainerDex** is a premium, all-in-one Pokémon GO companion web application.

Goal: replace the need to visit LeekDuck, PvPoke, Pokebattler, GO Hub, Reddit, and Campfire by
combining everything into one beautiful, daily-use **Trainer Operating System**.

The product must feel like an official Pokémon GO app — not a fan website.

---

## Tech Stack

### Frontend
- **Next.js** (App Router) — read `node_modules/next/dist/docs/` before touching routing or layouts
- **React** + **TypeScript** (strict mode)
- **Tailwind CSS** — utility-first; no inline styles, no raw CSS unless inside a `.css` module
- **Framer Motion** — all animations go through Framer; no CSS transitions on interactive elements
- **React Query (TanStack Query)** — all async data fetching; no `useEffect` + `fetch` anti-pattern

### Backend
- **Next.js API Routes** (default) or **NestJS** for complex services
- **PostgreSQL** via **Prisma ORM** — always use migrations, never `db push` in production
- **Redis** — caching layer for raid bosses, egg pools, and event data
- **Clerk** or **Auth.js** — authentication; never roll custom auth

### Infrastructure
- **Vercel** — frontend deployment
- **Railway** or **Supabase** — database hosting
- **Cloudflare CDN** — static assets and images
- **`next/image`** — every `<img>` tag must use `next/image`; no raw `<img>` elements

---

## Project Structure

```
src/
  app/              # Next.js App Router pages and layouts
  components/       # Shared React components
  lib/              # Data utilities, type definitions, helpers
  styles/           # Global CSS (minimal — prefer Tailwind)
public/
  sprites/          # Pokémon sprite assets
  graphics/         # Infographic and promo assets
```

### Key files in `src/lib/`
| File | Purpose |
|---|---|
| `types.ts` | Shared TypeScript types — extend here, never duplicate |
| `pokedex.ts` | Pokédex data access layer |
| `events.ts` | Event data fetching and formatting |
| `raids.ts` | Raid boss data |
| `eggs.ts` | Egg pool data |
| `news.ts` | News articles |
| `weekly.ts` | Weekly schedule utilities |
| `shiny.ts` | Shiny availability data |
| `tips.ts` | Tips & tricks content |
| `time.ts` | Date/time helpers — always use this, never raw `Date` manipulation |

---

## Coding Conventions

### TypeScript
- Strict mode is on — no `any`, no `@ts-ignore` without a comment explaining why
- Prefer `type` over `interface` for data shapes; use `interface` only for extensible contracts
- All API responses must be typed — use Zod for runtime validation at boundaries

### React / Next.js
- Use **Server Components** by default; add `"use client"` only when you need interactivity or browser APIs
- Data fetching lives in Server Components or React Query — never in `useEffect`
- Keep components small — if a component exceeds ~150 lines, split it
- File naming: `PascalCase.tsx` for components, `kebab-case.ts` for utilities

### Styling
- Tailwind only — no Styled Components, no Emotion
- Design tokens: use the Tailwind config `theme.extend` — never hardcode hex colors
- Glassmorphism pattern: `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl`
- Card pattern: `rounded-2xl shadow-lg overflow-hidden` with soft gradient backgrounds
- Spacing scale: stick to Tailwind's default scale (4, 6, 8, 12, 16, 24)

### Animations (Framer Motion)
- Page transitions: `initial={{ opacity: 0, y: 16 }}` → `animate={{ opacity: 1, y: 0 }}`
- Card hover: `whileHover={{ scale: 1.02 }}` — subtle, never jarring
- Skeleton loaders before data arrives — never show empty states without a skeleton

### Images / Sprites
- All sprites served from `public/sprites/`
- Missing sprites tracked in `missing-sprites.md` — update it when you add or discover a gap
- Always provide a fallback `src` or `onError` handler for sprite `<Image>` components

---

## Module Rules

### Pokédex
- Each Pokémon page is a dynamic route: `app/pokemon/[dex]/page.tsx`
- Include all form toggles: default, shiny, shadow, purified, mega, regional
- Stats, moves, PvP ranks, raid utility, and availability must all be present on one page

### Events
- Infographic-first: the event card is the primary UI, article is secondary (click-through)
- Countdowns use `lib/time.ts` helpers — never compute time deltas inline

### Raids
- Always show top 10 counters minimum; top 50 for Tier 5 and Mega
- Weather boost must be visually indicated on every counter card

### PvP
- League rank data must show Great / Ultra / Master together
- IV spreads shown as `15/15/15` format

### Graphics
- Graphics pages are static — pre-render with `generateStaticParams` where possible
- Downloadable assets link directly to `public/graphics/`

### Sprites & Missing Assets
- Before rendering a Pokémon sprite, check if the asset exists
- If missing, render a placeholder and add an entry to `missing-sprites.md`
- Format for `missing-sprites.md` rows:
  `| #XXX | Name | variant | URL or N/A | missing |`

---

## gstack

gstack is installed globally at `~/.claude/skills/gstack` and active in this vault.

Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.

Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /design-shotgun, /design-html, /review, /ship, /land-and-deploy,
/canary, /benchmark, /browse, /open-gstack-browser, /qa, /qa-only, /design-review,
/setup-browser-cookies, /setup-deploy, /setup-gbrain, /sync-gbrain, /retro, /investigate,
/document-release, /codex, /cso, /autoplan, /pair-agent, /careful, /freeze, /guard,
/unfreeze, /gstack-upgrade, /learn, /context-save, /context-restore.

Sprint order: /office-hours → /autoplan → build → /review → /qa → /ship → /retro
Security: run /cso before any production deploy.
Recovery: use /context-restore to resume interrupted sessions.

### When to use which skill

| Task | Skill |
|---|---|
| Starting a new feature | `/office-hours` then `/autoplan` |
| New UI component | `/plan-design-review` → `/design-html` |
| Refactoring or risky change | `/careful` + `/review` |
| Bug with unclear root cause | `/investigate` |
| Browser-based testing | `/qa https://localhost:3000` |
| Shipping a PR | `/ship` |
| Post-deploy check | `/canary` |
| Security audit | `/cso` |
| Updating docs after shipping | `/document-release` |
| Session crashed or interrupted | `/context-restore` |

---

## Do Not

- Do **not** use raw `<img>` — always `next/image`
- Do **not** fetch data in `useEffect` — use React Query or Server Components
- Do **not** hardcode Pokémon data inline in components — always pull from `src/lib/`
- Do **not** commit broken sprite paths — add to `missing-sprites.md` instead
- Do **not** run `/ship` or `/land-and-deploy` without first running `/cso`
- Do **not** use `any` in TypeScript
- Do **not** write animations with raw CSS `transition` on interactive elements — use Framer Motion
