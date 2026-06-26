<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from
your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing
any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# TrainerDex — Agent Rules

These rules apply to every AI coding agent working in this repository.

---

## Project Context

TrainerDex is a **premium Pokémon GO companion app** — a Trainer Operating System that unifies:

Pokédex · Events · Raids · PvP · Graphics · News · Tips · Leaks · Research · Collection Tracker · Community

The UI must feel like an **official Pokémon GO application**: immersive, card-based, glassmorphic,
animated, and mobile-first.

---

## Next.js Rules

- App Router only — no Pages Router patterns
- Read `node_modules/next/dist/docs/` for any routing, layout, or metadata question
- Use `generateStaticParams` for all static Pokémon and graphic pages
- Use `generateMetadata` for every page — never skip SEO metadata
- Layouts (`layout.tsx`) must not contain data fetching — use Server Components inside pages
- Route groups `(group)/` for visual organisation — they do not affect URLs

---

## Design System Rules

The UI must follow these constraints at all times:

| Rule | Implementation |
|---|---|
| Cards | `rounded-2xl shadow-lg overflow-hidden` |
| Glass effect | `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl` |
| Gradients | Soft, two-stop Tailwind gradients — no harsh solid backgrounds |
| Spacing | Tailwind scale only (4 / 6 / 8 / 12 / 16 / 24) |
| Typography | Bold headings, medium body — no light-weight fonts for body text |
| Motion | Framer Motion only — `whileHover={{ scale: 1.02 }}`, page fade-in via `y: 16 → 0` |
| Images | `next/image` always — width + height or `fill` prop required |
| Dark mode | Supported from day one — use `dark:` Tailwind variants |

---

## Component Rules

- **Server Components** by default; `"use client"` only for interactivity or browser APIs
- One component per file; file name matches component name in PascalCase
- Props interfaces defined in the same file as the component (or in `types.ts` if shared)
- No prop drilling beyond 2 levels — use context or React Query cache instead
- Skeleton loaders required for every async component — no blank loading states

---

## Data & State Rules

- All data access goes through `src/lib/` — never fetch or transform data inside a component
- React Query for all client-side async state — no `useEffect` + `fetch`
- Zod schemas at every external data boundary (API responses, form inputs)
- Prisma for all DB access — no raw SQL unless inside a named query helper
- Redis cache keys must be namespaced: `trainerdex:<entity>:<id>`

---

## Sprite & Asset Rules

- Sprites live in `public/sprites/`
- Before rendering a sprite, verify the file exists; on failure render a placeholder
- Log every missing sprite in `missing-sprites.md` using the format:

```
| #XXX | Pokémon Name | variant (default/shiny/shadow/mega/regional/costume) | source URL or N/A | missing |
```

- Never commit a broken `src` path — a placeholder is always better than a broken image

---

## Sprint & Workflow Rules

Always follow the gstack sprint order:

```
/office-hours  →  /autoplan  →  build  →  /review  →  /qa  →  /ship  →  /retro
```

- Run `/cso` before every production deploy
- Use `/context-save` before ending a long session
- Use `/context-restore` to resume after a crash or interruption
- Use `/investigate` before fixing any non-obvious bug — no blind fixes

---

## Prohibited Patterns

| ❌ Never do this | ✅ Do this instead |
|---|---|
| Raw `<img>` tags | `<Image>` from `next/image` |
| `useEffect` for data fetching | React Query or Server Components |
| Hardcoded hex colors | Tailwind config tokens |
| Hardcoded Pokémon data in JSX | Import from `src/lib/` |
| `any` in TypeScript | Proper types or Zod inference |
| CSS `transition` on interactive elements | Framer Motion |
| Committing broken sprite paths | Add to `missing-sprites.md` |
| Shipping without `/cso` | Run `/cso` first |
