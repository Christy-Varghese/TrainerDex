"use client";

import { useState } from "react";
import SpriteImage from "./SpriteImage";
import Icon from "./Icon";
import { typeColor } from "@/lib/pokedex";
import type { Variant } from "@/lib/variants";

interface BaseForm {
  label: string;
  sprite: string;
  types: string[];
  maxCp: number;
}

/**
 * Variant gallery for a Pokémon detail page. A row of toggle buttons (Default +
 * Shiny / Mega / Gigantamax / Dynamax) swaps the displayed sprite and shows
 * that form's facts. The shared hundo / moves / counters sections live below on
 * the page — this is the "view variant" surface.
 */
export default function VariantViewer({ base, variants }: { base: BaseForm; variants: Variant[] }) {
  const [active, setActive] = useState<string>("default");
  const variant = variants.find((v) => v.key === active);

  const sprite = variant ? variant.sprite : base.sprite;
  const types = variant?.types ?? base.types;
  const cp = variant?.cp ?? base.maxCp;
  const maxAura = !!variant?.maxAura;

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <Icon name="sparkles" className="text-fuchsia-500" /> Forms &amp; variants
      </h2>

      {/* Toggle buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <VariantPill active={active === "default"} onClick={() => setActive("default")}>
          Default
        </VariantPill>
        {variants.map((v) => (
          <VariantPill key={v.key} active={active === v.key} onClick={() => setActive(v.key)}>
            {v.label}
          </VariantPill>
        ))}
      </div>

      {/* Selected variant display */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
        <div
          className={`relative grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-white dark:bg-white/10 ${
            maxAura ? "ring-2 ring-red-400 shadow-[0_0_24px_-2px_rgba(248,113,113,0.7)]" : ""
          }`}
        >
          <SpriteImage src={sprite} alt={variant ? variant.label : base.label} size={84} className="h-20 w-20" />
          {maxAura && (
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              Max
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 dark:text-white">
            {variant ? variant.label : `${base.label} (Default)`}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {types.map((t) => (
              <span key={t} className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${typeColor(t)}`}>
                {t}
              </span>
            ))}
          </div>
          {/* Stats line: megas carry their own; others share base. */}
          {variant?.cp != null ? (
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              Max CP <span className="font-bold text-slate-900 dark:text-white">{cp.toLocaleString()}</span>
              {variant.atk != null && (
                <span className="ml-2 text-xs text-slate-400">
                  {variant.atk}/{variant.def}/{variant.sta}
                </span>
              )}
            </p>
          ) : variant?.sameAsBase ? (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Same stats as the standard form (Max CP {base.maxCp.toLocaleString()}).
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              Max CP <span className="font-bold text-slate-900 dark:text-white">{cp.toLocaleString()}</span>
            </p>
          )}
          {variant?.note && <p className="mt-1 text-xs text-slate-400">{variant.note}</p>}
        </div>
      </div>
    </div>
  );
}

function VariantPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400",
        active
          ? "bg-fuchsia-500 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
