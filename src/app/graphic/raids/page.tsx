import Image from "next/image";
import { getRaids, tierMeta, tierRank, type Raid } from "@/lib/raids";
import { isShadowName } from "@/lib/pokedex";
import ShadowBadge from "@/components/ShadowBadge";

export const revalidate = 3600;

// A shareable event-style infographic (à la the community "hundo CP" cards),
// generated entirely from the live raid feed. Each boss shows its 100% IV CP:
// the white number is the L20 raid catch, the gold number the L25 weather boost
// — exactly the levels you catch a raid boss at. Rendered at a fixed poster
// width so it can be screenshotted to a PNG.

export const metadata = { title: "Raid Hundo CP — TrainerDex" };

function tierGroups(raids: Raid[]) {
  const map = new Map<string, Raid[]>();
  for (const r of raids) (map.get(r.tier) ?? map.set(r.tier, []).get(r.tier)!).push(r);
  return [...map.entries()]
    .sort((a, b) => tierRank(a[0]) - tierRank(b[0]))
    .map(([tier, list]) => ({ tier, list: list.sort((a, b) => a.name.localeCompare(b.name)) }));
}

export default async function RaidGraphic() {
  const raids = await getRaids();
  const groups = tierGroups(raids);
  const shinies = raids.filter((r) => r.canBeShiny);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="grid min-h-screen place-items-center bg-slate-200 p-6">
      {/* Poster */}
      <div
        id="poster"
        className="relative w-[720px] overflow-hidden rounded-3xl px-8 py-9 text-white shadow-2xl"
        style={{
          background:
            "radial-gradient(130% 90% at 50% -10%, #8b5cf6 0%, #6d28d9 45%, #4c1d95 100%)",
        }}
      >
        {/* confetti speckles */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(#fbbf24 2px, transparent 2.2px), radial-gradient(#34d399 2px, transparent 2.2px), radial-gradient(#f472b6 2px, transparent 2.2px), radial-gradient(#60a5fa 2px, transparent 2.2px)",
            backgroundSize: "46px 46px, 64px 64px, 80px 80px, 104px 104px",
            backgroundPosition: "0 0, 23px 18px, 40px 6px, 12px 34px",
          }}
        />

        <div className="relative">
          {/* Header */}
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-xl shadow">
                ⚡
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Trainer<span className="text-sky-300">Dex</span>
              </span>
            </div>
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium">{today}</span>
          </div>
          <h1 className="mb-1 text-center text-3xl font-black uppercase tracking-wide drop-shadow">
            Raid Hundo CP
          </h1>
          <p className="mb-7 text-center text-sm font-medium text-white/70">
            100% IV catch CP · what to look for on the encounter screen
          </p>

          {/* Tier sections */}
          <div className="space-y-7">
            {groups.map(({ tier, list }) => {
              const m = tierMeta(tier);
              return (
                <section key={tier}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className={`rounded-xl px-3 py-1 text-base font-black ${m.badge}`}>{m.short}</span>
                    <span className="text-sm font-bold uppercase tracking-widest text-white/80">{tier}</span>
                    <span className="h-px flex-1 bg-white/15" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {list.map((r) => (
                      <Mon key={r.name} raid={r} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Shiny luck */}
          {shinies.length > 0 && (
            <>
              <h2 className="mt-9 text-center text-xl font-black uppercase tracking-widest text-amber-300 drop-shadow">
                ✨ Shiny Luck ✨
              </h2>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                {shinies.map((r) => (
                  <Image key={r.name} src={r.image} alt={r.name} width={56} height={56} className="h-14 w-14 object-contain drop-shadow" unoptimized />
                ))}
              </div>
            </>
          )}

          {/* Footer legend */}
          <div className="mt-8 flex items-center justify-center gap-5 text-xs text-white/75">
            <span className="flex items-center gap-1.5">
              <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold">L20</span> raid catch
            </span>
            <span className="flex items-center gap-1.5">
              <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold text-amber-300">L25</span> weather boosted
            </span>
            <span className="flex items-center gap-1.5">✨ shiny</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mon({ raid }: { raid: Raid }) {
  const shadow = isShadowName(raid.name);
  const name = raid.name.replace(/^shadow\s+/i, "");
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 px-2 pb-2.5 pt-2 ring-1 ring-white/15 backdrop-blur-sm">
      <div className="relative">
        <Image src={raid.image} alt={raid.name} width={104} height={104} className="h-[104px] w-[104px] object-contain drop-shadow-lg" unoptimized />
        {shadow && (
          <span className="absolute left-0 top-0">
            <ShadowBadge size={6} />
          </span>
        )}
        {raid.canBeShiny && <span className="absolute right-0 top-0 text-lg text-amber-300 drop-shadow">✨</span>}
      </div>

      <p className="mt-0.5 max-w-full truncate text-center text-sm font-bold">{name}</p>

      <div className="mt-1 flex items-center gap-1.5">
        <span className="rounded-md bg-black/85 px-2 py-0.5 text-sm font-extrabold tabular-nums">
          {raid.combatPower.normal.max}
        </span>
        <span className="rounded-md bg-black/85 px-2 py-0.5 text-sm font-extrabold tabular-nums text-amber-300">
          {raid.combatPower.boosted.max}
        </span>
      </div>
    </div>
  );
}
