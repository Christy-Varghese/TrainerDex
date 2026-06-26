import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPokedex, getPokemon, hundoScenarios, shadowScenarios, spriteUrl, typeColor } from "@/lib/pokedex";
import { getMoveset } from "@/lib/moves";
import { bestCounters } from "@/lib/counters";
import { getVariants } from "@/lib/variants";
import { defenseProfile } from "@/lib/type-chart";
import ShadowBadge from "@/components/ShadowBadge";
import SpriteImage from "@/components/SpriteImage";
import VariantViewer from "@/components/VariantViewer";
import Icon from "@/components/Icon";

export async function generateStaticParams() {
  return getPokedex().map((p) => ({ dex: String(p.dex) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/pokemon/[dex]">): Promise<Metadata> {
  const { dex } = await params;
  const p = getPokemon(Number(dex));
  if (!p) return { title: "Pokémon not found — TrainerDex" };
  return {
    title: `${p.name} #${p.dex} — Pokémon GO — TrainerDex`,
    description: `${p.name} (${p.types.join("/")}) — ${p.region}. GO stats: ${p.atk} ATK / ${p.def} DEF / ${p.sta} STA. Max CP ${p.maxCp}.`,
  };
}

// 250 is roughly the strongest GO base stat — scale the bars against it.
const STAT_MAX = 300;
const STATS = [
  { key: "atk", label: "Attack", color: "bg-rose-400" },
  { key: "def", label: "Defense", color: "bg-sky-400" },
  { key: "sta", label: "Stamina", color: "bg-emerald-400" },
] as const;

export default async function PokemonDetail({ params }: PageProps<"/pokemon/[dex]">) {
  const { dex } = await params;
  const p = getPokemon(Number(dex));
  if (!p) notFound();

  const prev = getPokemon(p.dex - 1);
  const next = getPokemon(p.dex + 1);
  const inGo = p.inGo !== false; // GO-specific blocks only for released Pokémon

  // Raid utility — moveset + best L40 counters (GO Pokémon only).
  const moveset = inGo ? await getMoveset(p.dex) : undefined;
  const counters = inGo ? bestCounters(p.types, p.dex, 12) : [];
  const variants = inGo ? await getVariants(p) : [];
  const defense = defenseProfile(p.types);

  return (
    <>
      <Header active="pokemon" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Link
          href="/pokemon"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
        >
          ← Pokédex
        </Link>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Hero */}
          <div className="flex items-center gap-5 border-b border-slate-100 bg-linear-to-br from-emerald-50 to-teal-50 p-5 sm:p-6 dark:from-emerald-950/50 dark:to-teal-950/40">
            <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-white shadow-sm dark:bg-white/10">
              <SpriteImage src={spriteUrl(p.dex)} alt={p.name} size={96} className="h-24 w-24" priority />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-400">#{String(p.dex).padStart(3, "0")}</p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{p.name}</h1>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.types.map((t) => (
                  <span key={t} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${typeColor(t)}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            {!inGo && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
                📋 Not yet released in Pokémon GO — National Dex entry. GO stats, CP and shiny data will appear once
                it&apos;s added to the game.
              </div>
            )}

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Fact label="Region">{p.region}</Fact>
              {inGo && <Fact label="Max CP (L40, hundo)">{p.maxCp.toLocaleString()}</Fact>}
              <Fact label="Shiny">
                {!inGo ? (
                  "—"
                ) : p.shiny ? (
                  <span className="inline-flex items-center gap-1 text-amber-500">
                    <Icon name="sparkles" /> Available
                  </span>
                ) : (
                  "Not yet"
                )}
              </Fact>
            </div>

            {/* Type matchups — defensive weaknesses & resistances */}
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Icon name="shield" className="text-rose-500" /> Type matchups
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-rose-500">
                    Weak to · takes more damage
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {defense.weaknesses.map((w) => (
                      <span key={w.type} className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${typeColor(w.type)}`}>
                        {w.type}
                        <span className="text-[10px] font-bold opacity-70">×{w.mult.toFixed(2)}</span>
                      </span>
                    ))}
                  </div>
                </div>
                {defense.resistances.length > 0 && (
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                      Resists · takes less damage
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {defense.resistances.map((r) => (
                        <span key={r.type} className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${typeColor(r.type)}`}>
                          {r.type}
                          <span className="text-[10px] font-bold opacity-70">×{r.mult.toFixed(2)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hundo CP by catch scenario */}
            {inGo && (
            <div>
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Hundo CP by catch source
              </h2>
              <p className="mb-3 text-xs text-slate-400">
                A 100% IV catch shows a different CP depending on the level it&apos;s caught at. Match the number
                to confirm a perfect catch.
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {hundoScenarios(p).map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between gap-3 px-3 py-2 text-sm ${
                      i % 2 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <span className="text-slate-600">
                      {s.note && <span className="mr-1">{s.note}</span>}
                      {s.label}
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="text-[11px] text-slate-400">L{s.level}</span>
                      <span className="font-bold tabular-nums text-slate-900">{s.cp.toLocaleString()}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Shadow catch hundo CPs (Team GO Rocket) */}
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-700/30 bg-linear-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/10">
                <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2">
                  <ShadowBadge size={4} />
                  <span className="text-xs font-semibold text-slate-700">Shadow (Team GO Rocket)</span>
                </div>
                {shadowScenarios(p).map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <span className="text-slate-600">{s.label}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="text-[11px] text-slate-400">L{s.level}</span>
                      <span className="font-bold tabular-nums text-slate-900">{s.cp.toLocaleString()}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* GO base stats */}
            {inGo && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">GO base stats</h2>
              <div className="space-y-2.5">
                {STATS.map((s) => {
                  const val = p[s.key];
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-sm text-slate-500">{s.label}</span>
                      <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-900">{val}</span>
                      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <span
                          className={`block h-full rounded-full ${s.color}`}
                          style={{ width: `${Math.min(100, (val / STAT_MAX) * 100)}%` }}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {/* Forms & variants — shiny / mega / gigantamax / dynamax */}
            {inGo && variants.length > 0 && (
              <VariantViewer
                base={{ label: p.name, sprite: spriteUrl(p.dex), types: p.types, maxCp: p.maxCp }}
                variants={variants}
              />
            )}

            {/* Moveset (GO) */}
            {inGo && moveset && (moveset.fast.length > 0 || moveset.charged.length > 0) && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Icon name="flame" className="text-rose-500" /> Moveset
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Fast moves</p>
                    <div className="flex flex-wrap gap-1.5">
                      {moveset.fast.map((m) => (
                        <span key={m} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">
                          {m}
                        </span>
                      ))}
                      {moveset.eliteFast.map((m) => (
                        <span key={m} className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" title="Elite / legacy move">
                          {m} ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Charged moves</p>
                    <div className="flex flex-wrap gap-1.5">
                      {moveset.charged.map((m) => (
                        <span key={m} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">
                          {m}
                        </span>
                      ))}
                      {moveset.eliteCharged.map((m) => (
                        <span key={m} className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" title="Elite / legacy move">
                          {m} ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Best raid counters at L40 */}
            {inGo && counters.length > 0 && (
              <div id="counters" className="scroll-mt-20">
                <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Icon name="shield" className="text-sky-500" /> Best counters (Level 40)
                </h2>
                <p className="mb-3 text-xs text-slate-400">
                  Top attackers vs {p.name}&apos;s typing, rated at L40. The chip shows the super-effective
                  type each one brings.
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {counters.map((c, i) => (
                    <Link
                      key={c.pokemon.dex}
                      href={`/pokemon/${c.pokemon.dex}`}
                      className="group flex items-center gap-2.5 rounded-xl border border-slate-200 p-2 transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-white/10"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                        {i + 1}
                      </span>
                      <SpriteImage src={spriteUrl(c.pokemon.dex)} alt={c.pokemon.name} size={40} className="h-10 w-10 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.pokemon.name}</p>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className={`rounded px-1 py-px text-[9px] font-medium ${typeColor(c.bestType)}`}>{c.bestType}</span>
                          <span className="text-[10px] text-slate-400">CP {c.cp.toLocaleString()}</span>
                        </div>
                        <span className="mt-1 block h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                          <span className="block h-full rounded-full bg-sky-400" style={{ width: `${c.score}%` }} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Alternate regional forms */}
            {p.forms && p.forms.length > 0 && (
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Other forms
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {p.forms.map((f) => (
                    <div key={f.form} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-slate-100 dark:bg-white/10">
                        <SpriteImage src={f.sprite} alt={`${f.form} ${p.name}`} size={56} className="h-14 w-14" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {f.form} {p.name}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {f.types.map((t) => (
                            <span key={t} className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${typeColor(t)}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {f.atk}/{f.def}/{f.sta} · Max CP {f.maxCp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shiny acquisition */}
            {p.shiny && p.shinyMethods.length > 0 && (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Where to find the shiny
                </h2>
                <div className="flex flex-wrap gap-2">
                  {p.shinyMethods.map((m) => (
                    <span key={m} className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="border-t border-slate-100 pt-4 text-xs text-slate-400">
              GO data via{" "}
              <a
                href="https://pogoapi.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline-offset-2 hover:underline"
              >
                pogoapi.net
              </a>
              . Max CP is the level-40, 15/15/15 value.
            </p>
          </div>
        </section>

        {/* Prev / next */}
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          {prev ? (
            <Link href={`/pokemon/${prev.dex}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600">
              ← #{prev.dex} {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/pokemon/${next.dex}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600">
              #{next.dex} {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 font-semibold text-slate-900">{children}</p>
    </div>
  );
}
