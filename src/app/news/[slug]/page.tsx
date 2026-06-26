import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  NEWS,
  getArticle,
  getNewsItem,
  newsCategoryMeta,
  newsUrl,
  articleSummary,
  type ArticleBlock,
} from "@/lib/news";
import { getTipGroup, type TipCategory } from "@/lib/tips";
import { extractPokemon, isMegaName, isShadowName, megaSpriteUrl, spriteUrl } from "@/lib/pokedex";
import { findSpecialForm } from "@/lib/special-forms";
import { isSpecialBackground } from "@/lib/special";
import { bonusIcon, bonusSprite } from "@/lib/bonus-icons";
import ShadowBadge from "@/components/ShadowBadge";
import SpecialBgIcon from "@/components/SpecialBgIcon";
import Icon from "@/components/Icon";
import SpriteImage from "@/components/SpriteImage";

export async function generateStaticParams() {
  return NEWS.filter((n) => getArticle(n.slug)).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return { title: "News not found — TrainerDex" };
  return {
    title: `${item.title} — TrainerDex`,
    description: articleSummary(slug) ?? `${item.title} — event details and Trainer tips on TrainerDex.`,
  };
}

const DAY_FMT: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

interface BossLine {
  name: string;
  sprite: string;
  dex?: number;
  shiny: boolean;
  shadow: boolean;
}

// A schedule paragraph (e.g. Road of Legends) is a single Pokémon name, maybe
// with a trailing "*" (shiny) or "(region)" note. Resolve it to a sprite so the
// body shows art instead of a bare name. Returns null for prose / headers.
function pokemonLine(text: string): BossLine | null {
  const t = text.trim();
  if (!t) return null;
  const shiny = t.endsWith("*");
  const core = t.replace(/\*+$/, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
  // A boss line is a short label (≤6 words) with no sentence punctuation —
  // this rejects prose paragraphs and the trailing note/footnote lines. Periods
  // are allowed so name abbreviations resolve ("Mime Jr.", "Mr. Mime").
  if (!core || core.split(/\s+/).length > 6 || /[,:;]/.test(core)) return null;

  const sf = findSpecialForm(core);
  if (sf) return { name: core, sprite: sf.sprite, dex: sf.baseDex, shiny, shadow: false };

  // Strip shadow prefix for display; flag for ShadowBadge overlay.
  const shadow = isShadowName(core);
  const stripped = core.replace(/^shadow\s+/i, "");

  const mons = extractPokemon([stripped], 1);
  if (mons.length === 0) return null;
  const p = mons[0].pokemon;

  const mega = isMegaName(stripped);
  const sprite = mega ? megaSpriteUrl(stripped, p.dex) : spriteUrl(p.dex);

  return { name: stripped, sprite, dex: p.dex, shiny, shadow };
}

// News category → relevant Trainer-tip group shown alongside the article.
const TIP_FOR: Partial<Record<string, TipCategory>> = {
  "community-day": "community-day",
  raid: "raids",
  battle: "battle",
};

// Canonical News & Tips section order, applied to every article:
// Event bonus → Raid bosses → GO Pass → Eggs → everything else (special info).
function sectionRank(heading: string): number {
  const t = heading.toLowerCase();
  if (/bonus/.test(t)) return 0;
  if (/go pass/.test(t)) return 2; // before "raid" so "GO Pass" never reads as a raid
  if (/raid|mega-evolved|super mega/.test(t)) return 1;
  if (/egg|hatch/.test(t)) return 3;
  return 4;
}

// Reorder an article's blocks into the canonical section order. Intro blocks
// before the first heading stay on top; each heading + its body move together;
// sort is stable so same-rank sections keep their original order.
function orderArticle(blocks: ArticleBlock[]): ArticleBlock[] {
  type HeadingBlock = Extract<ArticleBlock, { type: "heading" }>;
  const lead: ArticleBlock[] = [];
  const sections: { heading: HeadingBlock; body: ArticleBlock[] }[] = [];
  let cur: { heading: HeadingBlock; body: ArticleBlock[] } | null = null;
  for (const b of blocks) {
    if (b.type === "heading") {
      cur = { heading: b, body: [] };
      sections.push(cur);
    } else if (cur) {
      cur.body.push(b);
    } else {
      lead.push(b);
    }
  }
  const sorted = sections
    .map((s, i) => ({ s, i }))
    .sort((a, b) => sectionRank(a.s.heading.text) - sectionRank(b.s.heading.text) || a.i - b.i)
    .map((x) => x.s);
  return [...lead, ...sorted.flatMap((s) => [s.heading, ...s.body])];
}

// Highlight important details in article text: dates, times, Raid Hours and
// critical terms (Elite TM, Special Backgrounds, Adventure Effects).
const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
const WEEKDAYS = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday";
const HILITE = new RegExp(
  "(" +
    `(?:(?:${WEEKDAYS}),?\\s+)?(?:${MONTHS})\\s+\\d{1,2}(?:,\\s*\\d{4})?` + // dates
    "|" +
    `\\d{1,2}:\\d{2}(?:\\s*(?:a\\.m\\.|p\\.m\\.))?` + // times
    "|" +
    `(?:Mega |Primal )?Raid Hour|Spotlight Hour|Community Day` + // event hours
    "|" +
    `Elite TM|Special Backgrounds?|Adventure Effects?` + // critical terms
    ")",
  "g",
);
const MARK: Record<string, string> = {
  time: "rounded bg-amber-100 px-1 font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  hour: "rounded bg-rose-100 px-1 font-semibold text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  term: "rounded bg-emerald-100 px-1 font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
};
function highlight(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  HILITE.lastIndex = 0;
  while ((m = HILITE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const kind = /Raid Hour|Spotlight Hour|Community Day/.test(tok)
      ? "hour"
      : /Elite TM|Special Background|Adventure Effect/.test(tok)
        ? "term"
        : "time";
    out.push(
      <mark key={k++} className={MARK[kind]}>
        {tok}
      </mark>,
    );
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Section tags (#bonuses / #raids / #go-pass / #eggs) for the sections present.
function sectionTags(blocks: ArticleBlock[]): string[] {
  const present = new Set<number>();
  for (const b of blocks) if (b.type === "heading") present.add(sectionRank(b.text));
  const map: [number, string][] = [
    [0, "bonuses"],
    [1, "raids"],
    [2, "go-pass"],
    [3, "eggs"],
  ];
  return map.filter(([r]) => present.has(r)).map(([, t]) => t);
}

const tagSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  const blocks = getArticle(slug);
  if (!item || !blocks) notFound();

  const meta = newsCategoryMeta(item.category);
  const tipGroup = TIP_FOR[item.category] ? getTipGroup(TIP_FOR[item.category]!) : undefined;

  // Canonical section order for every article (bonus → raids → GO Pass → eggs → rest).
  const orderedBlocks = orderArticle(blocks);

  // Collapse runs of single-Pokémon schedule lines into one sprite grid so they
  // lay out as columns instead of one full-width row each.
  type RenderItem = ArticleBlock | { type: "bossgrid"; bosses: BossLine[] };
  const renderItems: RenderItem[] = [];
  for (const b of orderedBlocks) {
    const boss = b.type === "p" ? pokemonLine(b.text) : null;
    if (boss) {
      const last = renderItems[renderItems.length - 1];
      if (last && "bosses" in last) last.bosses.push(boss);
      else renderItems.push({ type: "bossgrid", bosses: [boss] });
    } else {
      renderItems.push(b);
    }
  }

  // Pokémon named anywhere in the article → sprite strip with shiny icons.
  const mentioned = extractPokemon(
    blocks.flatMap((b) => (b.type === "list" ? b.items : [b.text])),
  );

  // Obsidian-style frontmatter: properties + tags.
  const POKE_TAG_CAP = 12;
  const pokeTags = mentioned.slice(0, POKE_TAG_CAP).map((m) => tagSlug(m.pokemon.name));
  const extraPokeTags = mentioned.length - pokeTags.length;
  const secTags = sectionTags(blocks);

  return (
    <>
      <Header active="news" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Link
          href="/news"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          ← News &amp; Tips
        </Link>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Article header */}
          <header className="border-b border-slate-100 bg-linear-to-br from-indigo-50 to-violet-50 p-5 sm:p-7 dark:from-indigo-950/50 dark:to-violet-950/40">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}>
                {meta.label}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(item.date).toLocaleDateString(undefined, DAY_FMT)}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{item.title}</h1>
          </header>

          {/* Frontmatter — properties + tags (Obsidian-style) */}
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-7 dark:border-white/10 dark:bg-white/5">
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <Prop icon="calendar" label="Date">
                {new Date(item.date).toLocaleDateString(undefined, DAY_FMT)}
              </Prop>
              <Prop icon="info" label="Category">{meta.label}</Prop>
              <Prop icon="megaphone" label="Source">
                <a
                  href={newsUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
                >
                  Official Pokémon GO newsroom ↗
                </a>
              </Prop>
            </dl>

            {(secTags.length > 0 || pokeTags.length > 0) && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-white/10">
                {secTags.map((t) => (
                  <span
                    key={`sec-${t}`}
                    className="rounded-md bg-indigo-100 px-2 py-0.5 font-mono text-[11px] font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                  >
                    #{t}
                  </span>
                ))}
                {pokeTags.map((t) => (
                  <span
                    key={`poke-${t}`}
                    className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  >
                    #{t}
                  </span>
                ))}
                {extraPokeTags > 0 && (
                  <span className="font-mono text-[11px] text-slate-400">+{extraPokeTags} more</span>
                )}
              </div>
            )}
          </div>

          {/* Pokémon featured in this update */}
          {mentioned.length > 0 && (
            <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Pokémon in this update
              </p>
              <div className="flex flex-wrap gap-2">
                {mentioned.map(({ pokemon: p, shadow, mega, megaFullName }) => (
                  <Link
                    key={p.dex}
                    href={`/pokemon/${p.dex}`}
                    title={shadow ? `${p.name} (Shadow)` : p.name}
                    className="group flex w-16 flex-col items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-2 text-center transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm"
                  >
                    <div className="relative h-10 w-10">
                      <SpriteImage
                        src={mega ? megaSpriteUrl(megaFullName || p.name, p.dex) : spriteUrl(p.dex)}
                        alt={p.name}
                        size={40}
                        className="h-10 w-10"
                      />
                      {shadow && (
                        <span className="absolute -left-1.5 -top-1.5">
                          <ShadowBadge size={4} />
                        </span>
                      )}
                      {p.shiny && (
                        <span className="absolute -top-1 right-0 text-amber-400">
                          <Icon name="sparkles" title="Shiny available" />
                        </span>
                      )}
                      {isSpecialBackground(p.dex) && (
                        <span className="absolute -bottom-1 -right-1.5">
                          <SpecialBgIcon size={4} />
                        </span>
                      )}
                    </div>
                    <span className="w-full truncate text-[10px] text-slate-600 group-hover:text-emerald-600">
                      {p.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-5 sm:p-7">
            <div className="space-y-4">
              {renderItems.map((b, i) => {
                if (b.type === "bossgrid") {
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-2 sm:grid-cols-5"
                    >
                      {b.bosses.map((boss, j) => {
                        const card = (
                          <>
                            <span className="relative grid h-14 w-14 place-items-center rounded-lg bg-white shadow-sm dark:bg-white/10">
                              <SpriteImage src={boss.sprite} alt={boss.name} size={48} className="h-12 w-12" />
                              {boss.shadow && (
                                <span className="absolute left-0.5 top-0.5">
                                  <ShadowBadge size={4} />
                                </span>
                              )}
                              {boss.shiny && (
                                <span className="absolute -right-1 -top-1 text-amber-400">
                                  <Icon name="sparkles" title="Shiny available" />
                                </span>
                              )}
                            </span>
                            <span className="w-full truncate text-center text-[11px] font-medium text-slate-700 dark:text-slate-200">
                              {boss.name}
                            </span>
                          </>
                        );
                        return boss.dex ? (
                          <Link
                            key={j}
                            href={`/pokemon/${boss.dex}`}
                            title={boss.name}
                            className="group flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 p-2 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
                          >
                            {card}
                          </Link>
                        ) : (
                          <div
                            key={j}
                            title={boss.name}
                            className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5"
                          >
                            {card}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                if (b.type === "heading") {
                  return (
                    <h2 key={i} className="pt-2 text-lg font-bold text-slate-900">
                      {b.text}
                    </h2>
                  );
                }
                if (b.type === "list") {
                  return (
                    <ul key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {b.items.map((it, j) => {
                        const mons = extractPokemon([it], 4);
                        const sprite = bonusSprite(it);
                        return (
                          <li
                            key={j}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-700"
                          >
                            {mons.length > 0 ? (
                              <span className="flex shrink-0 gap-1">
                                {mons.map(({ pokemon: p, shadow }) => (
                                  <span
                                    key={p.dex}
                                    className="relative grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm"
                                  >
                                    <SpriteImage src={spriteUrl(p.dex)} alt={p.name} size={28} className="h-7 w-7" />
                                    {shadow && (
                                      <span className="absolute -left-1.5 -top-1.5">
                                        <ShadowBadge size={4} />
                                      </span>
                                    )}
                                    {p.shiny && (
                                      <span className="absolute -right-1 -top-1 text-xs text-amber-400">
                                        <Icon name="sparkles" title="Shiny available" />
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </span>
                            ) : (
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-lg shadow-sm dark:bg-white/10">
                                {sprite ? (
                                  <SpriteImage src={sprite} alt="" size={24} className="h-6 w-6" />
                                ) : (
                                  bonusIcon(it)
                                )}
                              </span>
                            )}
                            <span className="text-sm leading-snug">{highlight(it)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                const footnote = b.text.startsWith("*");
                return (
                  <p
                    key={i}
                    className={
                      footnote
                        ? "text-xs leading-relaxed text-slate-400"
                        : "leading-relaxed text-slate-700"
                    }
                  >
                    {highlight(b.text)}
                  </p>
                );
              })}
            </div>

            {/* Related Trainer tips */}
            {tipGroup && (
              <aside className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-400/20 dark:bg-indigo-950/30">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-200">
                  <Icon name="lightbulb" /> Trainer Tips · {tipGroup.label}
                </h2>
                <div className="space-y-3">
                  {tipGroup.tips.map((t) => (
                    <div key={t.title}>
                      <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                      <p className="text-sm leading-relaxed text-slate-600">{t.body}</p>
                    </div>
                  ))}
                </div>
              </aside>
            )}

            {/* Source attribution at the end */}
            <div className="mt-8 border-t border-slate-100 pt-4 text-sm text-slate-500">
              Source:{" "}
              <a
                href={newsUrl(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 underline-offset-2 hover:underline"
              >
                Official Pokémon GO newsroom ↗
              </a>
              <p className="mt-1 text-xs text-slate-400">
                Content from the official article, summarized and reformatted on TrainerDex. All event
                details belong to Niantic / The Pokémon Company.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}

function Prop({
  icon,
  label,
  children,
}: {
  icon: React.ComponentProps<typeof Icon>["name"];
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="flex w-24 shrink-0 items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <Icon name={icon} /> {label}
      </span>
      <span className="font-medium text-slate-700 dark:text-slate-200">{children}</span>
    </div>
  );
}
