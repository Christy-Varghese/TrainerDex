"use client";

import { useMemo, useState } from "react";
import type { Raid } from "@/lib/raids";
import { tierRank } from "@/lib/raids";
import RaidCard from "./RaidCard";

/** Tier filter bar + responsive grid of current raid bosses. */
export default function RaidsBrowser({ raids }: { raids: Raid[] }) {
  // Distinct tiers present in the data, battle-ordered (Mega → 5 → 3 → 1).
  const tiers = useMemo(
    () => [...new Set(raids.map((r) => r.tier))].sort((a, b) => tierRank(a) - tierRank(b)),
    [raids],
  );

  const [tier, setTier] = useState<string>("all");
  const sorted = useMemo(
    () =>
      [...raids].sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || a.name.localeCompare(b.name)),
    [raids],
  );
  const shown = tier === "all" ? sorted : sorted.filter((r) => r.tier === tier);

  return (
    <>
      <div className="mb-6 -mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          <Pill active={tier === "all"} onClick={() => setTier("all")}>
            All ({raids.length})
          </Pill>
          {tiers.map((t) => (
            <Pill key={t} active={tier === t} onClick={() => setTier(t)}>
              {t}
            </Pill>
          ))}
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <RaidCard key={`${r.tier}-${r.name}`} raid={r} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center text-sm text-slate-400">
          No raid bosses in this tier right now.
        </div>
      )}
    </>
  );
}

function Pill({
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
      className={[
        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
