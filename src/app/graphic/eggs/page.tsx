import Image from "next/image";
import { getEggs, eggsByDistance, eggDistanceColor, type Egg } from "@/lib/eggs";
import PosterScaler from "@/components/PosterScaler";

export const revalidate = 3600;
export const metadata = { title: "Egg Hatches · Hundo CP — TrainerDex" };

// Egg-hatch infographic: every Pokémon currently in eggs with its hatch hundo CP
// (eggs hatch at L20, so combatPower.max is the 100% IV value) and shiny status,
// grouped by hatch distance. Rendered at a fixed width for PNG capture.
export default async function EggGraphic() {
  const eggs = await getEggs();
  const groups = eggsByDistance(eggs);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4 sm:p-6">
      <PosterScaler posterWidth={720}>
      <div
        id="poster"
        className="relative w-[720px] overflow-hidden rounded-3xl px-8 py-9 text-white shadow-2xl"
        style={{ background: "radial-gradient(130% 90% at 50% -10%, #14b8a6 0%, #0d9488 45%, #115e59 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#fde68a 2px, transparent 2.2px), radial-gradient(#f9a8d4 2px, transparent 2.2px), radial-gradient(#a7f3d0 2px, transparent 2.2px)",
            backgroundSize: "52px 52px, 72px 72px, 96px 96px",
            backgroundPosition: "0 0, 26px 18px, 12px 34px",
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
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">{today}</span>
          </div>
          <h1 className="text-center text-3xl font-black uppercase tracking-wide drop-shadow">🥚 Egg Hatches</h1>
          <p className="mb-6 text-center text-sm font-medium text-white/75">
            Hatch hundo CP (eggs hatch at L20) · ✨ = shiny available
          </p>

          {/* Distance groups */}
          <div className="space-y-6">
            {groups.map(({ distance, eggs: list }) => (
              <section key={distance}>
                <div className="mb-3 flex items-center gap-3">
                  <span className={`rounded-xl px-3 py-1 text-base font-black ${eggDistanceColor(distance)}`}>
                    {distance}
                  </span>
                  <span className="h-px flex-1 bg-white/15" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {list.map((e) => (
                    <EggMon key={`${distance}-${e.name}`} egg={e} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-8 text-center text-[11px] text-white/65">
            White = hatch hundo CP (L20, 15/15/15) · ✨ shiny-eligible · TrainerDex · data via Leek Duck
          </p>
        </div>
      </div>
      </PosterScaler>
    </div>
  );
}

function EggMon({ egg }: { egg: Egg }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 px-2 pb-2 pt-1.5 ring-1 ring-white/15">
      <div className="relative">
        <Image src={egg.image} alt={egg.name} width={72} height={72} className="h-[72px] w-[72px] object-contain drop-shadow-md" unoptimized />
        {egg.canBeShiny && <span className="absolute right-0 top-0 text-base text-amber-300 drop-shadow">✨</span>}
      </div>
      <p className="max-w-full truncate text-center text-xs font-bold leading-tight">{egg.name}</p>
      <span className="mt-0.5 rounded-md bg-black/80 px-2 py-0.5 text-xs font-extrabold tabular-nums">
        {egg.combatPower.max.toLocaleString()}
      </span>
    </div>
  );
}
