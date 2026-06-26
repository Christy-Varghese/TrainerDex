// Official news headlines collected from the Pokémon GO newsroom
// (https://pokemongo.com/en/news). Facts only — date, title, official slug —
// rendered in our own UI and always linking back to the official article for
// the full write-up (transparency requirement from the project idea).
//
// This is a dated snapshot of the live newsroom. Refresh by re-collecting the
// feed; the `category` is derived from the headline for filtering.

export type NewsCategory =
  | "community-day"
  | "raid"
  | "go-fest"
  | "battle"
  | "go-pass"
  | "research"
  | "update";

export interface NewsItem {
  /** Article slug under https://pokemongo.com/en/news/ */
  slug: string;
  title: string;
  /** ISO date the article was published. */
  date: string;
  category: NewsCategory;
}

export const OFFICIAL_NEWS_BASE = "https://pokemongo.com/en/news";

// ---- Full article bodies -------------------------------------------------
// Structured content collected from the official article pages (SSR HTML).
// Rendered on our own `/news/[slug]` pages so trainers never leave the site;
// the official article is linked as the source at the end of each page.

export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] };

import ARTICLES from "./news-articles.json";

const ARTICLE_MAP = ARTICLES as Record<string, ArticleBlock[]>;

/** Full structured body for a news slug, if collected. */
export function getArticle(slug: string): ArticleBlock[] | undefined {
  return ARTICLE_MAP[slug];
}

export function getNewsItem(slug: string): NewsItem | undefined {
  return NEWS.find((n) => n.slug === slug);
}

/** Match an event to an official news article we've collected, if one exists.
 *  Tries an exact slug match on the event ID first, then significant-word
 *  overlap between the event name and a headline. */
export function findEventArticle(eventID: string, eventName: string): NewsItem | undefined {
  const withBody = NEWS.filter((n) => ARTICLE_MAP[n.slug]);
  const exact = withBody.find((n) => n.slug === eventID);
  if (exact) return exact;

  const stop = new Set(["the", "a", "and", "for", "of", "in", "to", "with", "pokemon", "go", "2026"]);
  const words = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stop.has(w)),
    );
  const target = words(eventName);
  if (target.size === 0) return undefined;

  let best: { item: NewsItem; score: number } | undefined;
  for (const n of withBody) {
    const w = words(n.title);
    let hits = 0;
    for (const t of target) if (w.has(t)) hits++;
    if (hits >= 2 && (!best || hits > best.score)) best = { item: n, score: hits };
  }
  return best?.item;
}

/** First real paragraph — used as a one-line teaser on the feed. */
export function articleSummary(slug: string): string | undefined {
  const blocks = ARTICLE_MAP[slug];
  if (!blocks) return undefined;
  const p = blocks.find(
    (b) => b.type === "p" && b.text.length > 40 && !/^\w+ \d{1,2}, \d{4}/.test(b.text),
  );
  return p && p.type === "p" ? p.text : undefined;
}

/** Snapshot of the official newsroom, newest first. */
export const NEWS: NewsItem[] = [
  { slug: "pvp-updates-competitors-cup-2026", title: "Pokémon GO Trainer Battle Update", date: "2026-06-23", category: "battle" },
  { slug: "road-of-legends-2026", title: "The Road of Legends leads the way to Pokémon GO Fest 2026: Global!", date: "2026-06-18", category: "go-fest" },
  { slug: "community-celebrations-go-fest-2026-details-asia-pacific", title: "GO Fest 2026: Global Community Celebrations in the Asia-Pacific region!", date: "2026-06-17", category: "go-fest" },
  { slug: "community-celebrations-go-fest-2026-details-en", title: "GO Fest 2026: Global Community Celebrations in North America, Europe, and Oceania!", date: "2026-06-17", category: "go-fest" },
  { slug: "communityday-july-2026-sobble", title: "July 2026 Community Day: Sobble", date: "2026-06-16", category: "community-day" },
  { slug: "save-the-date-apac-30th-anniversary-2026", title: "Save the Date: Pokémon 30th Anniversary Celebration — PokéXciting!", date: "2026-06-16", category: "update" },
  { slug: "raichu-super-mega-raid-day-2026", title: "Sparks fly for Raichu Super Mega Raid Day!", date: "2026-06-15", category: "raid" },
  { slug: "10th-anniversary-party", title: "Celebrate a decade of Pokémon GO during the 10th Anniversary Party!", date: "2026-06-11", category: "update" },
  { slug: "choose-your-path-forever-forward-2026", title: "Choose Your Path with new Timed Research and Daily Discoveries updates!", date: "2026-06-10", category: "research" },
  { slug: "flying-taxi-taken-over-2026", title: "Rescue Shadow Reshiram and more during Flying Taxi: Taken Over!", date: "2026-06-09", category: "update" },
  { slug: "flying-taxi-2026", title: "Take Flight as Squawkabilly's Debut Leads the Flying Taxi Charge", date: "2026-06-09", category: "update" },
  { slug: "skarmory-super-mega-raid-day-2026", title: "Stay sharp for Skarmory Super Mega Raid Day!", date: "2026-06-04", category: "raid" },
  { slug: "pokemon-run-30-2026", title: "Ready, set, GO! Join the Pokémon RUN 30 event near you!", date: "2026-06-02", category: "update" },
  { slug: "go-pass-june-2026", title: "The Timed Incubator returns in GO Pass: June!", date: "2026-05-27", category: "go-pass" },
  { slug: "communityday-june-2026-frigibax", title: "Frigibax featured in June Community Day; voting returns for August!", date: "2026-05-26", category: "community-day" },
  { slug: "go-battle-league-forever-forward", title: "GO Battle League: Forever Forward Update", date: "2026-05-26", category: "battle" },
  { slug: "global-events-gofest2026-overlays", title: "Team up with Blanche, Spark, and Candela on a summer quest!", date: "2026-05-18", category: "go-fest" },
  { slug: "community-celebrations-go-fest-2026", title: "Find your community at Community Celebrations during GO Fest 2026: Global!", date: "2026-05-14", category: "go-fest" },
  { slug: "mega-mewtwo-gofest-2026", title: "Mewtwo Mega Evolves and more exciting GO Fest updates!", date: "2026-04-28", category: "go-fest" },
];

interface CategoryMeta {
  label: string;
  emoji: string;
  badge: string;
}

const CATEGORY_META: Record<NewsCategory, CategoryMeta> = {
  "community-day": { label: "Community Day", emoji: "🌟", badge: "bg-amber-100 text-amber-700" },
  raid: { label: "Raids", emoji: "🛡️", badge: "bg-rose-100 text-rose-700" },
  "go-fest": { label: "GO Fest", emoji: "🎆", badge: "bg-fuchsia-100 text-fuchsia-700" },
  battle: { label: "Battle", emoji: "🥊", badge: "bg-violet-100 text-violet-700" },
  "go-pass": { label: "GO Pass", emoji: "🎟️", badge: "bg-lime-100 text-lime-700" },
  research: { label: "Research", emoji: "🔬", badge: "bg-sky-100 text-sky-700" },
  update: { label: "Update", emoji: "📣", badge: "bg-slate-100 text-slate-600" },
};

export function newsCategoryMeta(c: NewsCategory): CategoryMeta {
  return CATEGORY_META[c] ?? CATEGORY_META.update;
}

export function newsUrl(item: NewsItem): string {
  return `${OFFICIAL_NEWS_BASE}/${item.slug}`;
}
