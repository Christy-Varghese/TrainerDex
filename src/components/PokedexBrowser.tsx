"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ALL_TYPES, REGIONS, spriteUrl, typeColor, type Pokemon } from "@/lib/pokedex";
import Icon from "./Icon";
import SpriteImage from "./SpriteImage";

const PAGE = 60; // grow the visible list in chunks to keep the DOM light

export default function PokedexBrowser({ pokemon }: { pokemon: Pokemon[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [shinyOnly, setShinyOnly] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return pokemon.filter((p) => {
      if (type !== "all" && !p.types.includes(type)) return false;
      if (region !== "all" && p.region !== region) return false;
      if (shinyOnly && !p.shiny) return false;
      if (needle) {
        const matchName = p.name.toLowerCase().includes(needle);
        const matchDex = String(p.dex) === needle || `#${p.dex}` === needle;
        if (!matchName && !matchDex) return false;
      }
      return true;
    });
  }, [pokemon, q, type, region, shinyOnly]);

  const visible = filtered.slice(0, limit);

  // Reset paging whenever the filter set changes.
  const onFilter = (fn: () => void) => {
    fn();
    setLimit(PAGE);
  };

  return (
    <>
      {/* Search */}
      <div className="mb-3">
        <input
          type="search"
          value={q}
          onChange={(e) => onFilter(() => setQ(e.target.value))}
          placeholder="Search by name or dex number…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Region + shiny */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select
          value={region}
          onChange={(e) => onFilter(() => setRegion(e.target.value))}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-sky-400"
        >
          <option value="all">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onFilter(() => setShinyOnly((v) => !v))}
          aria-pressed={shinyOnly}
          className={[
            "inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
            shinyOnly
              ? "bg-amber-400 text-amber-950 shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300",
          ].join(" ")}
        >
          <Icon name="sparkles" />
          Shiny available
        </button>
      </div>

      {/* Type filter */}
      <div className="mb-4 -mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          <TypePill active={type === "all"} onClick={() => onFilter(() => setType("all"))} cls="bg-slate-900 text-white">
            All types
          </TypePill>
          {ALL_TYPES.map((t) => (
            <TypePill key={t} active={type === t} onClick={() => onFilter(() => setType(t))} cls={typeColor(t)}>
              {t}
            </TypePill>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-slate-400">
        {filtered.length} Pokémon{filtered.length !== pokemon.length ? " match" : ""}
      </p>

      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <Link
                key={p.dex}
                href={`/pokemon/${p.dex}`}
                className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <span className="self-end text-[11px] font-medium text-slate-300">#{p.dex}</span>
                <div className="grid h-20 w-20 place-items-center">
                  <SpriteImage src={spriteUrl(p.dex)} alt={p.name} size={64} className="h-16 w-16 drop-shadow-sm" />
                </div>
                <p className="mt-1 font-semibold text-slate-900 group-hover:text-sky-600">{p.name}</p>
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {p.types.map((t) => (
                    <span key={t} className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${typeColor(t)}`}>
                      {t}
                    </span>
                  ))}
                </div>
                {p.shiny && (
                  <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-amber-500">
                    <Icon name="sparkles" /> shiny
                  </span>
                )}
              </Link>
            ))}
          </div>

          {limit < filtered.length && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setLimit((n) => n + PAGE)}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Load more ({filtered.length - limit} left)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-white/15 dark:bg-white/5">
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-200 text-xl text-slate-500 dark:bg-white/10 dark:text-slate-300">
            <Icon name="search" />
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-100">No Pokémon match those filters</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Try a different type or region, or clear the filters to see all {pokemon.length}.
          </p>
          <button
            type="button"
            onClick={() =>
              onFilter(() => {
                setQ("");
                setType("all");
                setRegion("all");
                setShinyOnly(false);
              })
            }
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

function TypePill({
  active,
  onClick,
  cls,
  children,
}: {
  active: boolean;
  onClick: () => void;
  cls: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        active ? `${cls} shadow-sm` : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
